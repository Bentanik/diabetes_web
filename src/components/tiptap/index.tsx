"use client";

import React, { useRef, useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import useUploadImage from "@/app/admin/blogs/create-blog/hooks/use-upload-image";
import { v4 as uuidv4 } from "uuid";
import useDeleteImage from "@/app/admin/blogs/create-blog/hooks/use-delete-image";

interface TiptapEditorProps {
    content: string;
    onUpdate: (content: string) => void;
}

let editorInstance: Editor | null = null;

// Class to manage image deletion tracking
class ImageDeleteTracker {
    private uploadedImages: Map<
        string,
        { url: string; element?: HTMLElement }
    > = new Map();
    private deletedImageIds: Set<string> = new Set(); // Track deleted image IDs
    private observer: MutationObserver | null = null;
    private editorContainer: HTMLElement | null = null;
    private deleteImageFn: ((ids: string[]) => void) | null = null;
    private preventedUndoSteps: Set<string> = new Set(); // Track prevented undo steps

    public setDeleteImageFn(fn: (ids: string[]) => void) {
        this.deleteImageFn = fn;
    }

    constructor() {
        this.initObserver();
    }

    private initObserver() {
        this.observer = new MutationObserver((mutations) => {
            const deletedImageIds: string[] = [];

            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.handleRemovedNode(
                                node as HTMLElement,
                                deletedImageIds
                            );
                        }
                    });
                }
            });

            if (deletedImageIds.length > 0) {
                console.log(
                    "🗑️ Image deleted from editor:",
                    deletedImageIds.join(", ")
                );
                // Mark images as deleted
                deletedImageIds.forEach((id) => this.deletedImageIds.add(id));
                // Set last action as image deletion
                this.setLastAction("delete_image");
                // Invalidate URLs in the editor
                this.invalidateImageUrls(deletedImageIds);
                if (this.deleteImageFn) {
                    this.deleteImageFn(deletedImageIds);
                }
                // Better undo prevention
                this.preventUndoForDeletedImages(deletedImageIds);
            }
        });
    }

    private handleRemovedNode(node: HTMLElement, deletedImageIds: string[]) {
        const images =
            node.tagName === "IMG" ? [node] : node.querySelectorAll("img");
        images.forEach((img) => {
            const imageId = img.getAttribute("title");
            if (imageId && this.uploadedImages.has(imageId)) {
                deletedImageIds.push(imageId);
                this.uploadedImages.delete(imageId);
            }
        });
    }

    private preventUndoForDeletedImages(imageIds: string[]) {
        if (!editorInstance) return;

        // Method 1: Clear history completely and force a new history entry
        const currentContent = editorInstance.getHTML();

        // Disable history temporarily
        editorInstance.setOptions({
            enableInputRules: false,
            enablePasteRules: false,
        });

        // Create a new editor state without history
        setTimeout(() => {
            if (editorInstance) {
                // Force recreation of editor state
                editorInstance.commands.clearContent();
                editorInstance.commands.setContent(currentContent, false);

                // Add a checkpoint to history that can't be undone past
                editorInstance.commands.setMeta("preventUndo", true);

                // Re-enable input rules
                editorInstance.setOptions({
                    enableInputRules: true,
                    enablePasteRules: true,
                });

                console.log(
                    "🔒 Prevented undo for deleted images:",
                    imageIds.join(", ")
                );
            }
        }, 0);
    }

    public invalidateImageUrls(imageIds: string[]) {
        if (!editorInstance) return;

        const transaction = editorInstance.state.tr;
        let updated = false;

        editorInstance.state.doc.descendants((node, pos) => {
            if (node.type.name === "image") {
                const imageId = node.attrs.title;
                if (imageIds.includes(imageId)) {
                    // Add a random character to break the URL
                    const invalidUrl =
                        node.attrs.src + "#invalid_" + Date.now();
                    transaction.setNodeMarkup(pos, undefined, {
                        ...node.attrs,
                        src: invalidUrl, // Invalidate the URL
                    });
                    updated = true;
                }
            }
        });

        if (updated) {
            editorInstance.view.dispatch(transaction);
            console.log("🔗 Invalidated URLs for images:", imageIds.join(", "));
        }
    }

    public setEditorContainer(container: HTMLElement) {
        if (this.editorContainer) {
            this.observer?.disconnect();
        }
        this.editorContainer = container;
        if (this.observer && container) {
            this.observer.observe(container, {
                childList: true,
                subtree: true,
            });
        }
    }

    public addImage(imageId: string, imageUrl: string, element?: HTMLElement) {
        this.uploadedImages.set(imageId, { url: imageUrl, element });
        console.log("📸 Image added to tracker:", {
            imageId,
            imageUrl,
            totalTracked: this.uploadedImages.size,
        });
    }

    public isImageDeleted(imageId: string): boolean {
        return this.deletedImageIds.has(imageId);
    }

    // Method to check if undo would restore deleted images
    public wouldUndoRestoreDeletedImages(): boolean {
        if (!editorInstance || this.deletedImageIds.size === 0) return false;

        // Get the current state
        const currentState = editorInstance.state;

        try {
            // Get current content
            const currentHTML = editorInstance.getHTML();

            // Check if current content contains any deleted image IDs
            for (const deletedId of this.deletedImageIds) {
                if (currentHTML.includes(deletedId)) {
                    // If current content already has deleted image,
                    // this means undo would restore it
                    return true;
                }
            }

            // Since direct access to history state is not reliable,
            // assume undo might restore deleted images if recent deletion occurred
            if (
                this.lastAction === "delete_image" &&
                Date.now() - this.lastActionTime < 1000
            ) {
                return true;
            }

            return false;
        } catch (error) {
            console.warn("Error checking undo state:", error);
            return false;
        }
    }

    // Track the last action to make smarter decisions
    private lastAction: "delete_image" | "other" | null = null;
    private lastActionTime: number = 0;

    public setLastAction(action: "delete_image" | "other") {
        this.lastAction = action;
        this.lastActionTime = Date.now();
    }

    public shouldPreventUndo(): boolean {
        if (!editorInstance || this.deletedImageIds.size === 0) return false;

        // If the last action was deleting an image and it was recent (within 1 second),
        // prevent undo to avoid restoring the deleted image
        if (
            this.lastAction === "delete_image" &&
            Date.now() - this.lastActionTime < 1000
        ) {
            return true;
        }

        // Otherwise, allow undo for other actions
        return false;
    }

    public cleanup() {
        this.observer?.disconnect();
        this.uploadedImages.clear();
        this.deletedImageIds.clear();
        this.preventedUndoSteps.clear();
    }
}

// Create global instance for ImageDeleteTracker
const imageTracker = new ImageDeleteTracker();

const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
    const { onSubmit, isPending } = useUploadImage();
    const { onSubmitDelete } = useDeleteImage();

    const handleDeleteImages = (ids: string[]) => {
        onSubmitDelete(ids, () => {
            // Invalidate URLs after API delete
            imageTracker.invalidateImageUrls(ids);
        });
    };

    useEffect(() => {
        imageTracker.setDeleteImageFn(handleDeleteImages);
    }, []);

    if (!editor) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const placeholderId = uuidv4();
            editor
                .chain()
                .focus()
                .insertContent({
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: `Uploading image (${placeholderId})...`,
                            marks: [
                                {
                                    type: "textStyle",
                                },
                            ],
                        },
                    ],
                })
                .run();

            onSubmit(
                { image: file },
                () => {
                    e.target.value = "";
                },
                (imageId, publicId, publicUrl) => {
                    setTimeout(() => {
                        let targetPos: number | null = null;
                        let textLength = 0;

                        editor.state.doc.descendants((node, pos) => {
                            if (
                                node.isText &&
                                node.text?.includes(placeholderId)
                            ) {
                                targetPos = pos;
                                textLength = node.text.length;
                                return false;
                            }
                            return true;
                        });

                        if (targetPos !== null) {
                            const transaction = editor.state.tr;

                            transaction.replaceWith(
                                targetPos,
                                targetPos + textLength,
                                editor.schema.nodes.image.create({
                                    src: publicUrl,
                                    title: imageId,
                                })
                            );

                            editor.view.dispatch(transaction);

                            imageTracker.addImage(imageId, publicUrl);
                            console.log(
                                "✅ Image uploaded successfully. URL:",
                                publicUrl
                            );
                            console.log("Image ID:", imageId);
                        } else {
                            console.warn(
                                "⚠️ Could not find placeholder with ID:",
                                placeholderId
                            );
                        }
                    }, 0);
                }
            );
        }
    };

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
            <select
                value={
                    editor.isActive("heading")
                        ? editor.getAttributes("heading").level
                        : 0
                }
                onChange={(e) => {
                    const level = parseInt(e.target.value);
                    editor.commands.focus();
                    if (level === 0) {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor
                            .chain()
                            .focus()
                            .setNode("heading", { level })
                            .run();
                    }
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
                <option value="0">Paragraph</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
            </select>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 border border-gray-300 rounded text-sm font-bold ${
                    editor.isActive("bold") ? "bg-blue-200" : "bg-white"
                }`}
            >
                B
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 border border-gray-300 rounded text-sm italic ${
                    editor.isActive("italic") ? "bg-blue-200" : "bg-white"
                }`}
            >
                I
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`px-2 py-1 border border-gray-300 rounded text-sm underline ${
                    editor.isActive("underline") ? "bg-blue-200" : "bg-white"
                }`}
            >
                U
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`px-2 py-1 border border-gray-300 rounded text-sm line-through ${
                    editor.isActive("strike") ? "bg-blue-200" : "bg-white"
                }`}
            >
                S
            </button>

            <button
                type="button"
                onClick={() => {
                    const url = window.prompt("Enter URL:");
                    if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                    }
                }}
                className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                    editor.isActive("link") ? "bg-blue-200" : "bg-white"
                }`}
            >
                Link
            </button>

            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="editor-image-upload"
                    disabled={isPending}
                />
                <button
                    type="button"
                    className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                        isPending ? "bg-gray-200" : "bg-white"
                    } cursor-pointer`}
                    onClick={() =>
                        document.getElementById("editor-image-upload")?.click()
                    }
                    disabled={isPending}
                >
                    {isPending ? "Đang tải..." : "📷 Image"}
                </button>
            </div>
        </div>
    );
};

const TiptapEditorComponent = ({ content, onUpdate }: TiptapEditorProps) => {
    const editorRef = useRef<Editor | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                history: {
                    depth: 10, // Limit history depth
                    newGroupDelay: 500, // Group changes within 500ms
                },
            }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-500 underline cursor-pointer",
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: false,
                HTMLAttributes: {
                    class: "max-w-full h-[500px] object-cover rounded-lg",
                },
            }),
            Placeholder.configure({
                placeholder: "Write something...",
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            console.log(html);
            onUpdate(html);
            editorInstance = editor;

            // Track that user made an edit (not image deletion)
            imageTracker.setLastAction("other");
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
            },
            handleKeyDown: (view, event) => {
                // Intercept Ctrl+Z (Undo) and Ctrl+Y (Redo)
                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.key === "z" &&
                    !event.shiftKey
                ) {
                    // Only prevent undo if it would actually restore a deleted image
                    if (imageTracker.shouldPreventUndo()) {
                        console.log(
                            "🚫 Undo prevented - would restore recently deleted image"
                        );
                        event.preventDefault();
                        return true;
                    }

                    // Allow undo for normal text/content changes
                    console.log("✅ Undo allowed - normal content change");
                    return false;
                }

                // Handle Ctrl+Y (Redo) - be more permissive with redo
                if (
                    (event.ctrlKey || event.metaKey) &&
                    (event.key === "y" || (event.key === "z" && event.shiftKey))
                ) {
                    // Only prevent redo in very specific cases
                    const wouldRestoreDeleted =
                        imageTracker.wouldUndoRestoreDeletedImages();
                    if (wouldRestoreDeleted) {
                        console.log(
                            "🚫 Redo prevented - would restore deleted image"
                        );
                        event.preventDefault();
                        return true;
                    }

                    console.log("✅ Redo allowed");
                    return false;
                }

                return false;
            },
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items;
                if (items) {
                    for (const item of items) {
                        if (item.type.startsWith("image/")) {
                            // Handle pasted image files (not relevant here)
                            return false;
                        }
                    }
                }

                // Check pasted HTML content for images
                const html = event.clipboardData?.getData("text/html");
                if (html) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");
                    const images = doc.querySelectorAll("img");
                    let hasDeletedImage = false;

                    images.forEach((img) => {
                        const imageId = img.getAttribute("title");
                        if (imageId && imageTracker.isImageDeleted(imageId)) {
                            hasDeletedImage = true;
                            console.log(
                                "🚫 Blocked paste of deleted image with ID:",
                                imageId
                            );
                        }
                    });

                    if (hasDeletedImage) {
                        event.preventDefault();
                        return true; // Prevent paste if any deleted image is found
                    }
                }

                return false; // Allow paste for non-deleted content
            },
            handleDOMEvents: {
                paste: (view, event) => {
                    // Additional check to ensure no deleted images are pasted
                    const html = event.clipboardData?.getData("text/html");
                    if (html) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, "text/html");
                        const images = doc.querySelectorAll("img");
                        for (const img of images) {
                            const imageId = img.getAttribute("title");
                            if (
                                imageId &&
                                imageTracker.isImageDeleted(imageId)
                            ) {
                                event.preventDefault();
                                console.log(
                                    "🚫 Prevented paste of deleted image with ID:",
                                    imageId
                                );
                                return true;
                            }
                        }
                    }
                    return false;
                },
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    useEffect(() => {
        if (editor) {
            editorRef.current = editor;
            editorInstance = editor;
            const editorContainer = editor.view.dom;
            imageTracker.setEditorContainer(editorContainer);
        }
    }, [editor]);

    useEffect(() => {
        return () => {
            imageTracker.cleanup();
        };
    }, []);

    if (!editor) return null;

    return (
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-[#248fca] transition-colors">
            <TiptapToolbar editor={editor} />
            <EditorContent
                editor={editor}
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl min-h-[300px] max-h-[500px] overflow-y-auto"
            />
        </div>
    );
};

const TiptapEditor = TiptapEditorComponent as React.FC<TiptapEditorProps> & {
    getEditor: () => Editor | null;
    getImageTracker: () => typeof imageTracker;
};

TiptapEditor.getEditor = () => editorInstance;
TiptapEditor.getImageTracker = () => imageTracker;

export default TiptapEditor;

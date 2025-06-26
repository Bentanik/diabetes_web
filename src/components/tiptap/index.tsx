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
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
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
    private observer: MutationObserver | null = null;
    private editorContainer: HTMLElement | null = null;
    private deleteImageFn: ((ids: string[]) => void) | null = null;

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
                if (this.deleteImageFn) {
                    this.deleteImageFn(deletedImageIds);
                }
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

    public cleanup() {
        this.observer?.disconnect();
        this.uploadedImages.clear();
    }
}

// Create global instance for ImageDeleteTracker
const imageTracker = new ImageDeleteTracker();

const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
    const { onSubmit, isPending } = useUploadImage();
    const { onSubmitDelete } = useDeleteImage();

    const handleDeleteImages = (ids: string[]) => {
        onSubmitDelete(ids, () => {});
    };

    useEffect(() => {
        imageTracker.setDeleteImageFn(handleDeleteImages);
    }, []);

    if (!editor) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Generate a unique ID for the placeholder
            const placeholderId = uuidv4();
            // Insert placeholder text with a unique identifier
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

                        // Tìm đoạn text chứa placeholderId trong document thực
                        editor.state.doc.descendants((node, pos) => {
                            if (
                                node.isText &&
                                node.text?.includes(placeholderId)
                            ) {
                                targetPos = pos;
                                textLength = node.text.length;
                                return false; // dừng duyệt
                            }
                            return true;
                        });

                        if (targetPos !== null) {
                            const transaction = editor.state.tr;

                            // Xoá đoạn văn bản chứa placeholder và chèn ảnh vào cùng vị trí
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
            StarterKit,
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
            onUpdate(html);
            editorInstance = editor;
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
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

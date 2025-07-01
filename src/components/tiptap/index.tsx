"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
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
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Extension } from "@tiptap/core";
import debounce from "lodash.debounce";

// Extension tùy chỉnh để xử lý phím Enter
const CustomEnter = Extension.create({
    name: "customEnter",
    addKeyboardShortcuts() {
        return {
            Enter: ({ editor }) => {
                const { state, view } = editor;
                const { selection } = state;
                const { $from, $to } = selection;

                if ($from.parent.type.name === "paragraph") {
                    if (
                        $from.pos === $to.pos &&
                        $from.parentOffset === $from.parent.nodeSize - 2
                    ) {
                        editor.commands.insertContent("<br><br>");
                        return true;
                    } else {
                        editor.commands.splitBlock();
                        return true;
                    }
                }
                return false;
            },
            "Shift-Enter": ({ editor }) => {
                editor.commands.insertContent("<br>");
                return true;
            },
        };
    },
});

let editorInstance: Editor | null = null;

// Class to manage image deletion tracking
class ImageDeleteTracker {
    private uploadedImages: Map<
        string,
        { url: string; element?: HTMLElement }
    > = new Map();
    private deletedImageIds: Set<string> = new Set();
    private observer: MutationObserver | null = null;
    private editorContainer: HTMLElement | null = null;
    private preventedUndoSteps: Set<string> = new Set();

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
                deletedImageIds.forEach((id) => this.deletedImageIds.add(id));
                this.setLastAction("delete_image");
                this.invalidateImageUrls(deletedImageIds);
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

        const currentContent = editorInstance.getHTML();
        editorInstance.setOptions({
            enableInputRules: false,
            enablePasteRules: false,
        });

        setTimeout(() => {
            if (editorInstance) {
                editorInstance.commands.clearContent();
                editorInstance.commands.setContent(currentContent, false);
                editorInstance.commands.setMeta("preventUndo", true);
                editorInstance.setOptions({
                    enableInputRules: true,
                    enablePasteRules: true,
                });
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
                    const invalidUrl =
                        node.attrs.src + "#invalid_" + Date.now();
                    transaction.setNodeMarkup(pos, undefined, {
                        ...node.attrs,
                        src: invalidUrl,
                    });
                    updated = true;
                }
            }
        });

        if (updated) {
            editorInstance.view.dispatch(transaction);
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
    }

    public isImageDeleted(imageId: string): boolean {
        return this.deletedImageIds.has(imageId);
    }

    public wouldUndoRestoreDeletedImages(): boolean {
        if (!editorInstance || this.deletedImageIds.size === 0) return false;

        try {
            const currentHTML = editorInstance.getHTML();
            for (const deletedId of this.deletedImageIds) {
                if (currentHTML.includes(deletedId)) {
                    return true;
                }
            }
            if (
                this.lastAction === "delete_image" &&
                Date.now() - this.lastActionTime < 1000
            ) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    private lastAction: "delete_image" | "other" | null = null;
    private lastActionTime: number = 0;

    public setLastAction(action: "delete_image" | "other") {
        this.lastAction = action;
        this.lastActionTime = Date.now();
    }

    public shouldPreventUndo(): boolean {
        if (!editorInstance || this.deletedImageIds.size === 0) return false;

        if (
            this.lastAction === "delete_image" &&
            Date.now() - this.lastActionTime < 1000
        ) {
            return true;
        }
        return false;
    }

    public cleanup() {
        this.observer?.disconnect();
        this.uploadedImages.clear();
        this.deletedImageIds.clear();
        this.preventedUndoSteps.clear();
    }
}

const imageTracker = new ImageDeleteTracker();

interface TiptapEditorProps {
    content: string;
    onUpdate: (content: string) => void;
    name: string;
}

const TiptapToolbar = ({
    editor,
    countdown,
    savedMessage,
}: {
    editor: Editor | null;
    countdown: number | null;
    savedMessage: string;
}) => {
    const { onSubmit, isPending } = useUploadImage();

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
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50 items-center">
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
                className={`px-2 py-1 border border-gray-300 flared text-sm ${
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

            <div className="ml-auto text-sm text-gray-500">
                {countdown !== null && countdown > 0
                    ? `Sẽ lưu sau ${countdown}s...`
                    : savedMessage || " "}
            </div>
        </div>
    );
};

const TiptapEditorComponent = ({
    content,
    onUpdate,
    name,
}: TiptapEditorProps) => {
    const editorRef = useRef<Editor | null>(null);
    const {
        formState: { errors },
    } = useFormContext();
    const hasError = name ? !!errors[name] : false;
    const [countdown, setCountdown] = useState<number | null>(null);
    const [savedMessage, setSavedMessage] = useState<string>("");

    // Hàm xử lý lưu (thay vì gọi API, in ra console và hiển thị thông báo)
    const handleSave = useCallback((content: string) => {
        console.log("Đã lưu:", content);
        setSavedMessage("Đã lưu");
        setTimeout(() => setSavedMessage(""), 2000); // Ẩn thông báo sau 2 giây
    }, []);

    // Sử dụng debounce để trì hoãn lưu sau 5 giây
    const debouncedSave = useCallback(
        debounce((content: string) => {
            handleSave(content);
        }, 5000),
        [handleSave]
    );

    // Xử lý đếm ngược
    useEffect(() => {
        if (countdown === null) return;

        if (countdown === 0) {
            setCountdown(null);
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                history: {
                    depth: 10,
                    newGroupDelay: 500,
                },
                paragraph: {
                    HTMLAttributes: {
                        class: "m-0",
                    },
                },
            }),
            CustomEnter,
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
                    class: "w-full h-[500px] object-cover rounded-lg",
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
            imageTracker.setLastAction("other");
            // Kích hoạt đếm ngược và lưu
            setCountdown(5);
            setSavedMessage("");
            debouncedSave(html);
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
            },
            handleKeyDown: (view, event) => {
                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.key === "z" &&
                    !event.shiftKey
                ) {
                    if (imageTracker.shouldPreventUndo()) {
                        event.preventDefault();
                        return true;
                    }
                    return false;
                }
                if (
                    (event.ctrlKey || event.metaKey) &&
                    (event.key === "y" || (event.key === "z" && event.shiftKey))
                ) {
                    const wouldRestoreDeleted =
                        imageTracker.wouldUndoRestoreDeletedImages();
                    if (wouldRestoreDeleted) {
                        event.preventDefault();
                        return true;
                    }
                    return false;
                }
                return false;
            },
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items;
                if (items) {
                    for (const item of items) {
                        if (item.type.startsWith("image/")) {
                            return false;
                        }
                    }
                }
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
                        }
                    });

                    if (hasDeletedImage) {
                        event.preventDefault();
                        return true;
                    }
                }
                return false;
            },
            handleDOMEvents: {
                paste: (view, event) => {
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
        <div
            className={`border-2 rounded-lg overflow-hidden transition-colors ${
                hasError
                    ? "border-red-500 focus-within:border-red-500"
                    : "border-gray-200 focus-within:border-[#248fca]"
            }`}
        >
            <TiptapToolbar
                editor={editor}
                countdown={countdown}
                savedMessage={savedMessage}
            />
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

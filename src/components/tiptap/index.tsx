/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import useUploadImage from "@/app/admin/blogs/update-blog/hooks/use-upload-image";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Extension } from "@tiptap/core";
import debounce from "lodash.debounce";
import { List, ListOrdered, Link2, FileImage } from "lucide-react";

export const CustomEnter = Extension.create({
    name: "customEnter",
    addKeyboardShortcuts() {
        return {
            Enter: ({ editor }) => {
                const { empty, $head, from, to } = editor.state.selection;
                // Nếu có vùng chọn (bôi đen nhiều dòng) thì để Tiptap xử lý mặc định
                if (from !== to) {
                    return false;
                }
                // Nếu đang trong danh sách
                const isInList =
                    editor.isActive("bulletList") ||
                    editor.isActive("orderedList");
                if (isInList) {
                    if (empty && $head.parent.content.size === 0) {
                        return editor.commands.liftListItem("listItem");
                    }
                    return editor.commands.splitListItem("listItem");
                }
                // Ngoài danh sách → chèn <br>
                return editor.commands.insertContent("<p>&nbsp;</p>");
            },
        };
    },
});

let editorInstance: Editor | null = null;

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
                this.invalidateImageUrls(deletedImageIds);
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

    public cleanup() {
        this.observer?.disconnect();
        this.uploadedImages.clear();
        this.deletedImageIds.clear();
        this.preventedUndoSteps.clear();
    }
}

const imageTracker = new ImageDeleteTracker();

// TiptapEditor Component
interface TiptapEditorProps {
    content: string;
    onUpdate: (content: string) => void;
    name: string;
    blogId: string;
    onSubmitDraft: any;
}

const TiptapToolbar = ({
    editor,
    countdown,
    savedMessage,
}: {
    editor: Editor | null;
    countdown: number | null;
    savedMessage: string;
    handleFormSubmit: () => Promise<void>;
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
                        console.log(publicId);

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
                    editor.isActive("headingss")
                        ? editor.getAttributes("heading").level
                        : 0
                }
                onChange={(e) => {
                    const level = parseInt(e.target.value);
                    const { from, to } = editor.state.selection;
                    editor.commands.focus();
                    if (level === 0) {
                        if (from !== to) {
                            const text = editor.state.doc.textBetween(from, to);
                            // editor.chain().focus().setParagraph().run();
                            editor
                                .chain()
                                .focus()
                                .insertContentAt(
                                    { from, to },
                                    {
                                        type: "paragraph",
                                        content: [{ type: "text", text }],
                                    }
                                )
                                .run();
                        }
                    } else {
                        if (from !== to) {
                            // Có đoạn văn được tô đen
                            const text = editor.state.doc.textBetween(from, to);
                            editor
                                .chain()
                                .focus()
                                .insertContentAt(
                                    { from, to },
                                    {
                                        type: "heading",
                                        attrs: { level },
                                        content: [{ type: "text", text }],
                                    }
                                )
                                .run();
                        } else {
                            editor
                                .chain()
                                .focus()
                                .splitBlock()
                                .setNode("heading", { level })
                                .run();
                        }
                    }
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
                <option value="0">Paragraph</option>
                <option value="2">Heading 1</option>
                <option value="3">Heading 2</option>
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
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleList("bulletList", "listItem")
                        .run()
                }
                className={`px-2 py-1 border rounded text-sm ${
                    editor.isActive("bulletList") ? "bg-blue-200" : "bg-white"
                }`}
            >
                <List width={20} height={20} />
            </button>

            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleList("orderedList", "listItem")
                        .run()
                }
                className={`px-2 py-1 border rounded text-sm ${
                    editor.isActive("orderedList") ? "bg-blue-200" : "bg-white"
                }`}
            >
                <ListOrdered width={20} height={20} />
            </button>

            <button
                type="button"
                onClick={() => {
                    const { state, view } = editor;
                    const { empty, from, to } = state.selection;

                    // Nếu đang ở trong link
                    if (editor.isActive("link")) {
                        // Nếu không có vùng chọn (chỉ là con trỏ)
                        if (empty) {
                            // Gỡ mark "link" để ngăn việc chữ mới gõ tiếp tục bị dính link
                            editor.chain().focus().unsetMark("link").run();
                        } else {
                            // Nếu có vùng chọn thì chỉ gỡ link khỏi vùng đó
                            editor.chain().focus().unsetLink().run();
                        }
                    } else {
                        const url = window.prompt("Enter URL:");
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }
                }}
                className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                    editor.isActive("link") ? "bg-blue-200" : "bg-white"
                }`}
            >
                <Link2 width={20} height={20} />
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
                    <FileImage width={20} height={20} />
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
    onSubmitDraft,
}: TiptapEditorProps) => {
    const editorRef = useRef<Editor | null>(null);
    const { setValue } = useFormContext();
    const [countdown, setCountdown] = useState<number | null>(null);
    const [savedMessage, setSavedMessage] = useState<string>("");

    const latestDataRef = useRef({
        contentText: "",
        imageIds: [] as string[],
        contentHtml: "",
    });

    // Lưu nội dung trước đó để so sánh
    const previousContentRef = useRef<string>("");

    // Cập nhật nội dung HTML và các thông tin liên quan
    const updateContentHtml = useCallback(
        (editorContent: string) => {
            const extractTextContent = (html: string): string => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                return doc.body.textContent?.trim() || "";
            };

            const extractImageIds = (html: string): string[] => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const images = doc.querySelectorAll("img");
                const ids: string[] = [];
                images.forEach((img) => {
                    const imageId = img.getAttribute("title");
                    if (imageId && !imageTracker.isImageDeleted(imageId)) {
                        ids.push(imageId);
                    }
                });
                return ids;
            };

            const textContent = extractTextContent(editorContent);
            const newImageIds = extractImageIds(editorContent);

            // Chỉ cập nhật nếu nội dung HTML thay đổi
            if (editorContent !== latestDataRef.current.contentHtml) {
                setValue("contentHtml", editorContent, {
                    shouldValidate: true,
                });
                latestDataRef.current = {
                    contentText: textContent,
                    imageIds: newImageIds,
                    contentHtml: editorContent,
                };
            }
        },
        [setValue]
    );

    // Xử lý submit form
    const handleFormSubmit = useCallback(async () => {
        if (!onSubmitDraft || typeof onSubmitDraft !== "function") {
            console.error("onSubmit is not a function");
            setSavedMessage("Lỗi: Không thể lưu bài viết.");
            setTimeout(() => setSavedMessage(""), 3000);
            return;
        }

        try {
            const formData: REQUEST.TUpdateBlog = {
                title: null,
                content: latestDataRef.current.contentText,
                contentHtml: latestDataRef.current.contentHtml,
                thumbnail: null,
                categoryIds: null,
                images: latestDataRef.current.imageIds,
                doctorId: null,
                isDraft: true,
            };

            await onSubmitDraft(formData);
            setSavedMessage("Đã lưu thành công!");
            setTimeout(() => setSavedMessage(""), 2000);
        } catch (error) {
            console.error("Error updating blog draft:", error);
            setSavedMessage("Lỗi: Không thể lưu bài viết.");
            setTimeout(() => setSavedMessage(""), 3000);
        }
    }, [onSubmitDraft]);

    // Debounced function để bắt đầu đếm ngược sau khi dừng chỉnh sửa
    const startCountdown = useCallback(
        debounce(
            (content: string) => {
                if (content !== previousContentRef.current) {
                    previousContentRef.current = content;
                    setCountdown(5);
                }
            },
            1000, // Chờ 1 giây sau khi dừng chỉnh sửa
            { leading: false, trailing: true }
        ),
        []
    );

    // Gọi API khi đếm ngược hoàn tất
    const handleSave = useCallback(
        async (content: string) => {
            updateContentHtml(content);
            await handleFormSubmit();
        },
        [updateContentHtml, handleFormSubmit]
    );

    // Hiệu ứng để quản lý đếm ngược
    useEffect(() => {
        if (countdown === null) return;

        if (countdown === 0) {
            handleSave(latestDataRef.current.contentHtml);
            setCountdown(null);
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, handleSave]);

    // Hủy debounced function khi component unmount
    useEffect(() => {
        return () => {
            startCountdown.cancel();
        };
    }, [startCountdown]);

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
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            BulletList.configure({
                HTMLAttributes: { class: "list-disc pl-4" },
            }),
            OrderedList.configure({
                HTMLAttributes: { class: "list-decimal pl-4" },
            }),
            ListItem,
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
                    class: "w-full max-w-full h-auto object-cover rounded-lg",
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
            updateContentHtml(html);
            setSavedMessage("");
            startCountdown(html);
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 overflow-wrap-anywhere word-break-break-word",
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
                    console.log(view);
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
        <div className="border-gray-200 focus-within:border-[#248fca] w-[740px]">
            <TiptapToolbar
                editor={editor}
                countdown={countdown}
                savedMessage={savedMessage}
                handleFormSubmit={handleFormSubmit}
            />
            <EditorContent
                editor={editor}
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl min-h-[660px] max-h-[660px] overflow-y-auto border rounded-b-3xl max-w-none wrap-break-word whitespace-pre-wrap w-full"
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

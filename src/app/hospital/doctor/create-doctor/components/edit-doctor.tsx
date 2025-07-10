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
import { useFormContext } from "react-hook-form";
import { Extension } from "@tiptap/core";
import { List, ListOrdered, Link2 } from "lucide-react";

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

// TiptapEditor Component
interface TiptapEditorProps {
    content: string;
    onUpdate: (content: string) => void;
    name: string;
    blogId: string;
}

const TiptapToolbar = ({
    editor,
    countdown,
    savedMessage,
}: {
    editor: Editor | null;
    countdown: number | null;
    savedMessage: string;
    // handleFormSubmit: () => Promise<void>;
}) => {
    if (!editor) return null;

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

            <div className="ml-auto text-sm text-gray-500">
                {countdown !== null && countdown > 0
                    ? `Sẽ lưu sau ${countdown}s...`
                    : savedMessage || " "}
            </div>
        </div>
    );
};

const TiptapEditorComponent = ({ content, onUpdate }: TiptapEditorProps) => {
    const editorRef = useRef<Editor | null>(null);
    const { setValue } = useFormContext();
    const [countdown, setCountdown] = useState<number | null>(null);
    const [savedMessage, setSavedMessage] = useState<string>("");

    const latestDataRef = useRef({
        contentText: "",
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

            const textContent = extractTextContent(editorContent);

            // Chỉ cập nhật nếu nội dung HTML thay đổi
            if (editorContent !== latestDataRef.current.contentHtml) {
                setValue("contentHtml", editorContent, {
                    shouldValidate: true,
                });
                latestDataRef.current = {
                    contentText: textContent,
                    contentHtml: editorContent,
                };
            }
        },
        [setValue]
    );

    // Xử lý submit form
    // const handleFormSubmit = useCallback(async () => {
    //     if (!onSubmitDraft || typeof onSubmitDraft !== "function") {
    //         console.error("onSubmit is not a function");
    //         setSavedMessage("Lỗi: Không thể lưu bài viết.");
    //         setTimeout(() => setSavedMessage(""), 3000);
    //         return;
    //     }

    //     try {
    //         const formData: REQUEST.TUpdateBlog = {
    //             title: null,
    //             content: latestDataRef.current.contentText,
    //             contentHtml: latestDataRef.current.contentHtml,
    //             thumbnail: null,
    //             categoryIds: null,
    //             doctorId: null,
    //             isDraft: true,
    //         };

    //         await onSubmitDraft(formData);
    //         setSavedMessage("Đã lưu thành công!");
    //         setTimeout(() => setSavedMessage(""), 2000);
    //     } catch (error) {
    //         console.error("Error updating blog draft:", error);
    //         setSavedMessage("Lỗi: Không thể lưu bài viết.");
    //         setTimeout(() => setSavedMessage(""), 3000);
    //     }
    // }, [onSubmitDraft]);

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
        ],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onUpdate(html);
            editorInstance = editor;
            updateContentHtml(html);
            setSavedMessage("");
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 overflow-wrap-anywhere word-break-break-word",
            },
            // handleDOMEvents: {
            //     paste: (view, event) => {
            //         const html = event.clipboardData?.getData("text/html");
            //         if (html) {
            //             const parser = new DOMParser();
            //             const doc = parser.parseFromString(html, "text/html");
            //             const images = doc.querySelectorAll("img");
            //             for (const img of images) {
            //                 const imageId = img.getAttribute("title");
            //                 if (
            //                     imageId &&
            //                 ) {
            //                     event.preventDefault();
            //                     return true;
            //                 }
            //             }
            //         }
            //         console.log(view);
            //         return false;
            //     },
            // },
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
        }
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="border-gray-200 focus-within:border-[#248fca] ">
            <TiptapToolbar
                editor={editor}
                countdown={countdown}
                savedMessage={savedMessage}
                // handleFormSubmit={handleFormSubmit}
            />
            <EditorContent
                editor={editor}
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl  max-h-[660px] overflow-y-auto border rounded-b-3xl max-w-none wrap-break-word whitespace-pre-wrap w-full"
            />
        </div>
    );
};

const DoctorEditor = TiptapEditorComponent as React.FC<TiptapEditorProps> & {
    getEditor: () => Editor | null;
};

DoctorEditor.getEditor = () => editorInstance;

export default DoctorEditor;

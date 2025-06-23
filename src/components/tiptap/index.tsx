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

interface TiptapEditorProps {
    content: string;
    onUpdate: (content: string) => void;
}

// Biến toàn cục để truy cập instance editor
let editorInstance: Editor | null = null;

// Toolbar component for Tiptap
const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
            {/* Headers */}
            <select
                value={
                    editor.isActive("heading")
                        ? editor.getAttributes("heading").level
                        : 0
                }
                onChange={(e) => {
                    const level = parseInt(e.target.value);
                    console.log("Setting heading level:", level);
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

            {/* Text formatting */}
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

            {/* Lists */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                    editor.isActive("bulletList") ? "bg-blue-200" : "bg-white"
                }`}
            >
                • List
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                    editor.isActive("orderedList") ? "bg-blue-200" : "bg-white"
                }`}
            >
                1. List
            </button>

            {/* Alignment */}
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                }
                className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                    editor.isActive({ textAlign: "left" })
                        ? "bg-blue-200"
                        : "bg-white"
                }`}
            >
                ⬅
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                }
                className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                    editor.isActive({ textAlign: "center" })
                        ? "bg-blue-200"
                        : "bg-white"
                }`}
            >
                ↔
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                }
                className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                    editor.isActive({ textAlign: "right" })
                        ? "bg-blue-200"
                        : "bg-white"
                }`}
            >
                ➡
            </button>

            {/* Other formatting */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                    editor.isActive("blockquote") ? "bg-blue-200" : "bg-white"
                }`}
            >
                Quote
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`px-2 py-1 border border-gray-300 rounded text-sm ${
                    editor.isActive("codeBlock") ? "bg-blue-200" : "bg-white"
                }`}
            >
                Code
            </button>

            {/* Link */}
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

            {/* Image Upload */}
            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                                alert(
                                    "Kích thước file không được vượt quá 5MB"
                                );
                                return;
                            }
                            if (!file.type.startsWith("image/")) {
                                alert("Vui lòng chọn file hình ảnh");
                                return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                const src = event.target?.result as string;
                                editor.chain().focus().setImage({ src }).run();
                            };
                            reader.readAsDataURL(file);
                        }
                        e.target.value = "";
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="editor-image-upload"
                />
                <button
                    type="button"
                    className="px-2 py-1 border border-gray-300 rounded text-sm bg-white cursor-pointer"
                    onClick={() =>
                        document.getElementById("editor-image-upload")?.click()
                    }
                >
                    📷 Image
                </button>
            </div>

            {/* Image URL */}
            <div>
                <button
                    type="button"
                    onClick={() => {
                        const url = window.prompt("Enter image URL:");
                        if (url) {
                            editor.chain().focus().setImage({ src: url }).run();
                        }
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                >
                    🖼️ URL
                </button>
            </div>
        </div>
    );
};

// Tiptap Editor component
const TiptapEditorComponent = ({ content, onUpdate }: TiptapEditorProps) => {
    const editorRef = useRef<Editor | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            // Heading.configure({
            //     levels: [1, 2, 3],
            // }),
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
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
                allowBase64: true,
                HTMLAttributes: {
                    class: "max-w-full h-auto rounded-lg",
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            console.log("Editor HTML:", html); // Debug
            onUpdate(html);
            editorInstance = editor;
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
            },
            handleClickOn(view, pos, node, nodePos, event) {
                // Nếu click vào link, mở popup để edit thay vì mở link
                if (
                    node.type.name === "text" &&
                    node.marks.some((mark) => mark.type.name === "link")
                ) {
                    event.preventDefault();
                    const linkMark = node.marks.find(
                        (mark) => mark.type.name === "link"
                    );
                    const currentUrl = linkMark?.attrs.href || "";

                    const newUrl = window.prompt("Edit URL:", currentUrl);

                    if (newUrl === null) return true; // Cancelled

                    if (newUrl === "") {
                        // Remove link
                        editor
                            ?.chain()
                            .focus()
                            .setTextSelection(pos)
                            .extendMarkRange("link")
                            .unsetLink()
                            .run();
                    } else {
                        // Update link
                        editor
                            ?.chain()
                            .focus()
                            .setTextSelection(pos)
                            .extendMarkRange("link")
                            .setLink({ href: newUrl })
                            .run();
                    }

                    return true; // Prevent default behavior
                }
                return false;
            },
        },
    });

    // Cập nhật content khi prop content thay đổi
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    // Khởi tạo ref khi editor được tạo
    useEffect(() => {
        if (editor) {
            editorRef.current = editor;
            editorInstance = editor; // Đảm bảo editorInstance luôn được cập nhật
        }
    }, [editor]);

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

// Định nghĩa TiptapEditor như một module với phương thức getEditor
const TiptapEditor = TiptapEditorComponent as React.FC<TiptapEditorProps> & {
    getEditor: () => Editor | null;
};

TiptapEditor.getEditor = () => editorInstance;

export default TiptapEditor;

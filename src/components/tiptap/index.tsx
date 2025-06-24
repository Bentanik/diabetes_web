"use client";

import React, { useRef, useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import useUploadImage from "@/app/admin/blogs/create-blog/hooks/use-upload-image";

interface TiptapEditorProps {
    content: string;
    onUpdate: (content: string) => void;
}

let editorInstance: Editor | null = null;

const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
    const { onSubmit, isPending } = useUploadImage();
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
        null
    );

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
                            onSubmit(
                                { image: file },
                                () => {
                                    e.target.value = "";
                                },
                                (imageId, publicId, publicUrl) => {
                                    console.log("Uploaded URL:", publicUrl);
                                    editor
                                        .chain()
                                        .focus()
                                        .setImage({ src: publicUrl })
                                        .run();
                                    setUploadedImageUrl(publicUrl);
                                }
                            );
                        }
                    }}
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

            {/* Image URL */}
            <button
                type="button"
                onClick={() => {
                    const url = window.prompt("Enter image URL:");
                    if (url) {
                        editor.chain().focus().setImage({ src: url }).run();
                        setUploadedImageUrl(url); // Lưu URL để hiển thị
                    }
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
            >
                🖼️ URL
            </button>
        </div>
    );
};

const TiptapEditorComponent = ({ content, onUpdate }: TiptapEditorProps) => {
    const editorRef = useRef<Editor | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
        null
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
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
                allowBase64: false,
                HTMLAttributes: {
                    class: "max-w-full h-[500px] object-cover rounded-lg",
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            console.log(html);
            onUpdate(html);
            editorInstance = editor;
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
            },
            handleClickOn(view, pos, node, nodePos, event) {
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

                    if (newUrl === null) return true;
                    if (newUrl === "") {
                        editor
                            ?.chain()
                            .focus()
                            .setTextSelection(pos)
                            .extendMarkRange("link")
                            .unsetLink()
                            .run();
                    } else {
                        editor
                            ?.chain()
                            .focus()
                            .setTextSelection(pos)
                            .extendMarkRange("link")
                            .setLink({ href: newUrl })
                            .run();
                    }
                    return true;
                }
                return false;
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
            {uploadedImageUrl && (
                <div className="p-2 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Image URL:{" "}
                        <a
                            href={uploadedImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            {uploadedImageUrl}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};

const TiptapEditor = TiptapEditorComponent as React.FC<TiptapEditorProps> & {
    getEditor: () => Editor | null;
};

TiptapEditor.getEditor = () => editorInstance;

export default TiptapEditor;

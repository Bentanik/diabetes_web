"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FileText, ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";

// Tiptap imports
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

// Toolbar component for Tiptap
const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
            {/* Headers */}
            <select
                onChange={(e) => {
                    const level = parseInt(e.target.value);
                    if (level === 0) {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({
                                level: level as 1 | 2 | 3 | 4 | 5 | 6,
                            })
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
                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
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
                        // Reset input để có thể chọn lại cùng file
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
    );
};

// Định nghĩa kiểu dữ liệu cho form
interface PostFormData {
    title: string;
    content: string;
    contentHtml: string;
    references: string[];
    categoryId: string;
    doctorId: string;
}

export default function CreatePostForm() {
    const form = useForm<PostFormData>({
        defaultValues: {
            title: "",
            content: "",
            contentHtml: "",
            references: [],
            categoryId: "",
            doctorId: "",
        },
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Function to update contentHtml with title + content
    const updateContentHtml = (title: string, editorContent: string) => {
        const titleHtml = title ? `<h1>${title}</h1>` : "";
        const fullHtml = titleHtml + editorContent;
        form.setValue("contentHtml", fullHtml);
    };

    // Tiptap editor configuration
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
            const editorHtml = editor.getHTML();
            const currentTitle = form.getValues("title");
            updateContentHtml(currentTitle, editorHtml);
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
            },
        },
    });

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Kích thước file không được vượt quá 5MB");
                return;
            }
            if (!file.type.startsWith("image/")) {
                alert("Vui lòng chọn file hình ảnh");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleClearImages = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleFormSubmit = (data: PostFormData) => {
        setIsSubmitting(true);
        try {
            if (imageFile !== null) {
                const formData = {
                    ...data,
                    image: imageFile,
                };
                console.log("Post data:", formData);
                handleClearImages();
                // Reset editor
                editor?.commands.clearContent();
            }
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <div className="min-h-screen">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="space-y-8"
                >
                    {/* Image Upload Section */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                            <ImageIcon className="h-5 w-5 text-[#248fca]" />
                            Hình ảnh bài post
                        </Label>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id="image-upload"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex items-center gap-2 h-12 px-6 border-2 border-[#248fca] text-[#248fca] hover:bg-[#248fca] hover:text-white transition-all duration-300"
                                    asChild
                                >
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer"
                                    >
                                        Chọn hình ảnh
                                    </label>
                                </Button>
                            </div>
                            {imagePreview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-20 h-20 rounded-xl border-4 border-[#248fca]/20 overflow-hidden shadow-lg"
                                >
                                    <img
                                        src={imagePreview || "/placeholder.svg"}
                                        alt="Image preview"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">
                            Chấp nhận file JPG, PNG. Kích thước tối đa 5MB.
                        </p>
                    </motion.div>

                    {/* Title */}
                    <motion.div variants={itemVariants}>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                        Tiêu đề *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Nhập tiêu đề bài post"
                                            className="h-12 text-base border-2 focus:border-[#248fca] transition-colors"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                // Update contentHtml when title changes
                                                const editorContent =
                                                    editor?.getHTML() || "";
                                                updateContentHtml(
                                                    e.target.value,
                                                    editorContent
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* Content HTML with Tiptap */}
                    <motion.div variants={itemVariants}>
                        <FormField
                            control={form.control}
                            name="contentHtml"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                        <FileText className="h-5 w-5 text-[#248fca]" />
                                        Nội dung HTML *
                                    </FormLabel>
                                    <FormControl>
                                        <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-[#248fca] transition-colors">
                                            <TiptapToolbar editor={editor} />
                                            <EditorContent
                                                editor={editor}
                                                className="min-h-[300px] max-h-[500px] overflow-y-auto"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* Submit Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-end gap-4 pt-8 border-t-2 border-gray-100"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            className="px-8 h-12 text-base border-2 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                                form.reset();
                                handleClearImages();
                                editor?.commands.clearContent();
                            }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Đang tạo...
                                </div>
                            ) : (
                                "Tạo bài post"
                            )}
                        </Button>
                    </motion.div>
                </form>
            </Form>
        </div>
    );
}

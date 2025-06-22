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
import TiptapEditor from "@/components/tiptap";
import Image from "next/image";

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
                form.reset();
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
                                    <Image
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
                                                // Lấy content từ editor mà không có title
                                                const currentContentHtml =
                                                    form.getValues(
                                                        "contentHtml"
                                                    );
                                                const contentWithoutTitle =
                                                    currentContentHtml.replace(
                                                        /^<h1>.*?<\/h1>/,
                                                        ""
                                                    );
                                                updateContentHtml(
                                                    e.target.value,
                                                    contentWithoutTitle
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
                                        <TiptapEditor
                                            content={field.value.replace(
                                                /^<h1>.*?<\/h1>/,
                                                ""
                                            )} // Chỉ hiển thị content, không có title
                                            onUpdate={(content) => {
                                                // Cập nhật với title hiện tại
                                                updateContentHtml(
                                                    form.getValues("title"),
                                                    content
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

                    {/* Preview Section */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                            <FileText className="h-5 w-5 text-[#248fca]" />
                            Xem trước bài blog
                        </Label>
                        <div className="border-2 border-gray-200 rounded-lg p-4 min-h-[200px] bg-white">
                            {form.watch("contentHtml") ? (
                                <div
                                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none custom-preview"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            form.watch("contentHtml") ||
                                            "<p>Chưa có nội dung</p>",
                                    }}
                                />
                            ) : (
                                <p className="text-gray-500">
                                    Chưa có nội dung để hiển thị
                                </p>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">
                            Xem trước nội dung như khi bài blog được đăng.
                        </p>
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

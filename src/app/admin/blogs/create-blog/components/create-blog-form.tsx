"use client";

import { motion } from "framer-motion";
import { FileText, AlertCircle } from "lucide-react";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, ImageIcon } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import TiptapEditor from "@/components/tiptap";
import Image from "next/image";
import useUploadImage from "@/app/admin/blogs/create-blog/hooks/use-upload-image";
import MultiSelectCategories from "@/app/admin/blogs/create-blog/components/select-category";
import useGetDataCategories from "@/app/admin/blogs/create-blog/hooks/use-get-categories";
import DoctorSelect from "@/app/admin/blogs/create-blog/components/select-doctor";
import useCreateBlog, {
    BlogFormData,
} from "@/app/admin/blogs/create-blog/hooks/use-create-blog";

const extractTextContent = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const images = doc.querySelectorAll("img");
    images.forEach((img) => img.remove());

    const brs = doc.querySelectorAll("br");
    brs.forEach((br) => {
        br.replaceWith(", ");
    });

    const textNodes: string[] = [];
    const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            textNodes.push(node.textContent.trim());
        }
        node.childNodes.forEach((child) => walk(child));
    };
    walk(doc.body);

    return textNodes.filter((text) => text !== "").join(", ");
};

const doctors = [
    {
        Id: "9554b171-acdc-42c3-8dec-5d3aba44ca99",
        value: "tanphat",
        label: "Bs.Lâm Tấn Phát",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b71",
        value: "tanphat1",
        label: "Bs.Lâm Tấn Phát1",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b72",
        value: "tanphat2",
        label: "Bs.Lâm Tấn Phát2",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b73",
        value: "tanphat3",
        label: "Bs.Lâm Tấn Phát3",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b74",
        value: "tanphat4",
        label: "Bs.Lâm Tấn Phát4",
    },
];

export default function CreatePostForm() {
    const { onSubmit: uploadImage, isPending: isUploading } = useUploadImage();
    const { getCategoriesApi, isPending } = useGetDataCategories();
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState<API.TGetCategories>([]);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [content, setContent] = useState("");
    const { form, onSubmit } = useCreateBlog();

    useEffect(() => {
        const handleGetData = async () => {
            try {
                const res = await getCategoriesApi();
                setData(res?.data || []);
            } catch (err) {
                console.log(err);
            }
        };
        handleGetData();
    }, []);

    const extractImageIds = (html: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const images = doc.querySelectorAll("img");
        const imageIds: string[] = [];
        images.forEach((img) => {
            const imageId = img.getAttribute("title");
            if (imageId) {
                imageIds.push(imageId);
            }
        });
        return imageIds;
    };

    const updateContentHtml = (editorContent: string) => {
        form.setValue("contentHtml", editorContent);
        const textContent = extractTextContent(editorContent);
        setContent(textContent);
        const newImageIds = extractImageIds(editorContent);
        setImageIds(newImageIds);
    };

    const handleClearImages = () => {
        setThumbnailUrl(null);
        setImageIds([]);
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

            setLogoFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = (data: BlogFormData) => {
        setIsSubmitting(true);
        try {
            if (logoFile != null) {
                const formData: REQUEST.TCreateBlog = {
                    title: data.title,
                    content: content,
                    contentHtml: data.contentHtml,
                    thumbnail: logoFile,
                    categoryIds: data.categoryIds,
                    images: imageIds,
                    doctorId: data.doctorId,
                };
                onSubmit(formData, handleClearImages);
            }
            setLogoPreview(null);
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
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="space-y-8"
                >
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex justify-between">
                            <div>
                                <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                    <ImageIcon className="h-5 w-5 text-[#248fca]" />
                                    Chọn ảnh đại diện
                                </Label>
                                <div className="flex items-center gap-6 mt-2">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            id="logo-upload"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex items-center gap-2 h-12 px-6 border-2 border-[#248fca] text-[#248fca] hover:bg-[#248fca] hover:text-white transition-all duration-300"
                                            asChild
                                        >
                                            <label
                                                htmlFor="logo-upload"
                                                className="cursor-pointer"
                                            >
                                                <Upload className="h-5 w-5" />
                                                Chọn ảnh
                                            </label>
                                        </Button>
                                    </div>
                                    {logoPreview && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-20 h-20 rounded-xl border-4 border-[#248fca]/20 overflow-hidden shadow-lg"
                                        >
                                            <img
                                                src={
                                                    logoPreview ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Logo preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Chấp nhận file JPG, PNG. Kích thước tối đa
                                    5MB.
                                </p>
                            </div>

                            {/* Categories Multi-Select */}
                            <motion.div variants={itemVariants}>
                                <FormField
                                    control={form.control}
                                    name="categoryIds"
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                <MultiSelectCategories
                                                    control={form.control}
                                                    data={data}
                                                    isPending={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage className="flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                            </FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            {/* Select Doctor with Combobox */}
                            <motion.div variants={itemVariants}>
                                <FormField
                                    control={form.control}
                                    name="doctorId"
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                <DoctorSelect
                                                    control={form.control}
                                                    doctors={doctors}
                                                />
                                            </FormControl>
                                            <FormMessage className="flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                            </FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        </div>
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
                                            onChange={field.onChange}
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
                                        Nội dung bài viết
                                    </FormLabel>
                                    <FormControl>
                                        <TiptapEditor
                                            content={field.value}
                                            onUpdate={(html) => {
                                                updateContentHtml(html); // Update field value
                                                form.trigger("contentHtml");
                                            }}
                                            name="contentHtml"
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
                            className="px-8 h-12 text-base border-2 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => {
                                form.reset();
                                setLogoPreview(null);
                                handleClearImages();
                            }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
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

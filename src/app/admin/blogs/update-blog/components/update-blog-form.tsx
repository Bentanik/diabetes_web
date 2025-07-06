/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion } from "framer-motion";
import { FileText, AlertCircle, ImageIcon, Upload } from "lucide-react";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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
import useUploadImage from "@/app/admin/blogs/update-blog/hooks/use-upload-image";
import MultiSelectCategories from "@/app/admin/blogs/update-blog/components/select-category";
import useGetDataCategories from "@/app/admin/blogs/update-blog/hooks/use-get-categories";
import DoctorSelect from "@/app/admin/blogs/update-blog/components/select-doctor";
import useGetBlog from "@/app/admin/blogs/blog-detail/hooks/use-get-blog";
import useUpdateBlog, {
    BlogFormData,
} from "@/app/admin/blogs/update-blog/hooks/use-update-blog";

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

export default function UpdateBlogForm({ blogId }: REQUEST.BlogId) {
    const { isPending: isUploading } = useUploadImage();
    const { getCategoriesApi, isPending } = useGetDataCategories();
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState<API.TGetCategories>([]);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [content, setContent] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { getBlogApi, isBlogPending } = useGetBlog();
    const [blogData, setBlogData] = useState<API.TGetBlog>();
    const { form, onSubmit } = useUpdateBlog({ blogId });

    console.log(thumbnailUrl);
    console.log(blogData);

    useEffect(() => {
        const handleGetData = async () => {
            try {
                const res = await getCategoriesApi();
                setData(res?.value.data as API.TGetCategories || []);
            } catch (err) {
                console.log(err);
            }
        };
        handleGetData();
    }, []);

    useEffect(() => {
        const handleGetBlogData = async (id: string) => {
            try {
                const res = await getBlogApi({ blogId: id });
                setBlogData(res?.value.data as API.TGetBlog);
            } catch (err) {
                console.log(err);
            }
        };
        handleGetBlogData(blogId);
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
        setLogoFile(null);
        setLogoPreview(null);
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Kích thước file không được vượt quá 5MB");
                event.target.value = ""; // Reset input
                return;
            }
            if (!file.type.startsWith("image/")) {
                alert("Vui lòng chọn file hình ảnh");
                event.target.value = ""; // Reset input
                return;
            }
            console.log("Selected file:", {
                name: file.name,
                size: file.size,
                type: file.type,
            });
            setLogoFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.onerror = () => {
                console.error("Lỗi khi đọc file ảnh");
                alert("Không thể đọc file ảnh, vui lòng thử lại.");
                setLogoFile(null); // Reset nếu lỗi
                event.target.value = "";
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (data: BlogFormData) => {
        if (!onSubmit || typeof onSubmit !== "function") {
            console.error("onSubmit is not a function");
            return;
        }
        setIsSubmitting(true);
        try {
            const formData: REQUEST.TUpdateBlog = {
                title: data.title,
                content: content,
                contentHtml: data.contentHtml,
                thumbnail: logoFile || null,
                categoryIds: data.categoryIds,
                images: imageIds,
                doctorId: data.doctorId,
                isDraft: false,
            };
            onSubmit(formData, () => {
                handleClearImages();
                setIsDialogOpen(false);
                form.reset();
                alert("Cập nhật bài viết thành công!"); // Thông báo thành công
            });
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Có lỗi xảy ra khi cập nhật bài viết.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        try {
            const formData: REQUEST.TUpdateBlog = {
                title: form.getValues("title") || "Draft Blog",
                content: content,
                contentHtml: form.getValues("contentHtml"),
                thumbnail: logoFile, // Allow null
                categoryIds: form.getValues("categoryIds") || [],
                images: imageIds,
                doctorId: form.getValues("doctorId"),
                isDraft: true,
            };
            onSubmit(formData, handleClearImages);
            setIsDialogOpen(false);
            form.reset();
        } catch (error) {
            console.error("Error saving draft:", error);
        }
    };

    // const itemVariants = {
    //     hidden: { opacity: 0, y: 20 },
    //     visible: {
    //         opacity: 1,
    //         y: 0,
    //         transition: { duration: 0.5, ease: "easeOut" },
    //     },
    // };

    return (
        <div className="min-h-screen">
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            {isBlogPending && <div>...Loading</div>}
            <Form {...form}>
                <motion.div className="space-y-4">
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
                                            updateContentHtml(html);
                                            form.trigger("contentHtml");
                                        }}
                                        name="contentHtml"
                                        blogId={blogId}
                                    />
                                </FormControl>
                                <FormMessage className="flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="button"
                        className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Hoàn tất nội dung
                    </Button>
                </motion.div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>
                                Cập nhật thông tin bài viết
                            </DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={form.handleSubmit(handleFormSubmit)}
                            className="space-y-6"
                        >
                            {/* Title */}
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

                            {/* Thumbnail Upload */}
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
                                            <Image
                                                src={
                                                    logoPreview ||
                                                    "/placeholder.svg"
                                                }
                                                width={20}
                                                height={20}
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

                            {/* Select Doctor */}
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

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="px-8 h-12 text-base border-2 hover:bg-gray-50 transition-colors"
                                    onClick={handleCancel}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isUploading}
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
                                            Đang tải lên...
                                        </div>
                                    ) : (
                                        "Tải lên"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </Form>
        </div>
    );
}

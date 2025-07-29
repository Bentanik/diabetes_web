/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion } from "framer-motion";
import {
    FileText,
    AlertCircle,
    ImageIcon,
    Upload,
    Smartphone,
} from "lucide-react";
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
import { useState, useEffect, useCallback } from "react";
import TiptapEditor from "@/components/tiptap";
import useUploadImage from "@/app/admin/blogs/update-blog/hooks/use-upload-image";
import MultiSelectCategories from "@/app/admin/blogs/update-blog/components/select-category";
import DoctorSelect from "@/app/admin/blogs/update-blog/components/select-doctor";
import useUpdateBlog, {
    BlogFormData,
} from "@/app/admin/blogs/update-blog/hooks/use-update-blog";
import { useRouter } from "next/navigation";
import { useGetBlogDetail } from "../../blog-detail/hooks/use-get-blog";
import { useGetCategories } from "../hooks/use-get-categories";

//EXTRACT HTML CONTENT TO ROOT CONTENT
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

export default function UpdateBlogForm({ blogId }: REQUEST.BlogId) {
    const { isPending: isUploading, onSubmit: onSubmitImage } =
        useUploadImage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [content, setContent] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { form, onSubmit } = useUpdateBlog({ blogId });
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null
    );
    const [thumbnailId, setThumbnailId] = useState<string | null>(null);
    const router = useRouter();

    //GET DATA FROM FORM
    const categoryIds = form.watch("categoryIds");
    const doctorId = form.watch("doctorId");
    const title = form.watch("title");

    //HANDLE SUBMIT UPLOAD IMAGES
    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const data = { image: file };

            onSubmitImage(
                data,
                () => {},
                (imageId, publicId, publicUrl) => {
                    form.setValue("thumbnail", imageId);
                    setThumbnailPreview(publicUrl);
                    setThumbnailId(imageId);
                }
            );
        }
    };

    //FETCH API GET BLOG DETAIL
    const { blog_detail, isPending: blogPending } = useGetBlogDetail({
        blogId,
    });

    //FETCH API GET CATEGORIES
    const { categories, isPending: categoriesPending } = useGetCategories();

    useEffect(() => {
        if (blog_detail?.contentHtml) {
            form.setValue("contentHtml", blog_detail.contentHtml);
            setContent(extractTextContent(blog_detail.contentHtml));
            setImageIds(extractImageIds(blog_detail.contentHtml));
        }
    }, [blog_detail, form]);

    //EXTRACT HTML IMG CONTENT TO GET IMAGE IDS
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

    //HANDLE SUBMIT DRAFT POST FORM
    const handleSubmitDraft = useCallback(
        async (formData: REQUEST.TUpdateBlog) => {
            try {
                onSubmit(formData, () => {
                    console.log("Draft saved successfully");
                });
            } catch (error) {
                console.error("Error saving draft:", error);
                throw error;
            }
        },
        [onSubmit]
    );

    //HANDLE SUBMIT SUCCESSFULLY POST FORM
    const handleFormSubmit = async (data: BlogFormData) => {
        if (!onSubmit || typeof onSubmit !== "function") {
            console.error("onSubmit is not a function");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData: REQUEST.TUpdateBlog = {
                title: data.title || null,
                content: content || null,
                contentHtml: data.contentHtml || null,
                thumbnail: thumbnailId || null,
                categoryIds: data.categoryIds || null,
                images: imageIds || null,
                doctorId: data.doctorId || null,
                isDraft: false,
            };
            onSubmit(formData, () => {
                setIsDialogOpen(false);
                form.reset();
                setTimeout(() => {
                    router.push("/admin/blogs");
                }, 2000);
            });
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Có lỗi xảy ra khi cập nhật bài viết.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        form.setValue("title", "");
        form.setValue("categoryIds", []);
        form.setValue("doctorId", "");
        setThumbnailPreview(null);
        setThumbnailId(null);
        setImageIds([]);

        setIsDialogOpen(false);
    };

    return (
        <div className="min-h-screen">
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <Form {...form}>
                <motion.div className="space-y-4">
                    <div className="flex gap-10">
                        <div className="flex-2 h-[600px]">
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
                                                onSubmitDraft={
                                                    handleSubmitDraft
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1 relative flex justify-center">
                            <div className="">
                                <div className="flex justify-center font-semibold text-lg items-center gap-2">
                                    <Smartphone className="h-5 w-5 text-[#248fca]" />
                                    Xem trước trên mobile
                                </div>
                                <div className="relative inline-block mt-10">
                                    {/* Phone Frame Image */}
                                    <Image
                                        src="/images/phone.png"
                                        alt="phone frame"
                                        width={385}
                                        height={667}
                                        className="mx-auto"
                                    />
                                    {/* Screen Content */}
                                    <div
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-lg overflow-auto wrap-break-word"
                                        style={{
                                            width: "340px",
                                            height: "600px",
                                        }}
                                    >
                                        <div
                                            className="prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    form.getValues(
                                                        "contentHtml"
                                                    ) || "",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="button"
                        className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl mt-10 cursor-pointer"
                        onClick={() => setIsDialogOpen(true)}
                        disabled={!content}
                    >
                        Hoàn tất nội dung
                    </Button>
                </motion.div>

                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            handleCancel();
                        }
                        setIsDialogOpen(open);
                    }}
                >
                    <DialogContent className="sm:max-w-[600px] h-[750px] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                Hoàn thiện thông tin bài viết
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
                                            onChange={handleImageChange}
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
                                    {thumbnailPreview && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-20 h-20 rounded-xl border-4 border-[#248fca]/20 overflow-hidden shadow-lg"
                                        >
                                            <Image
                                                src={
                                                    thumbnailPreview ||
                                                    "/placeholder.svg"
                                                }
                                                width={20}
                                                height={20}
                                                alt="Logo preview"
                                                className="w-full h-full"
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
                                                data={categories}
                                                isPending={categoriesPending}
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
                                            />
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="mt-20">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="px-8 h-12 text-base border-2 hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={handleCancel}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        isSubmitting ||
                                        isUploading ||
                                        !thumbnailId ||
                                        !categoryIds ||
                                        !doctorId ||
                                        !title
                                    }
                                    className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full "
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

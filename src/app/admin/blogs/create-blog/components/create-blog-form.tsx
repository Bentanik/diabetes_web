"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useGetDataCategories from "@/app/admin/blogs/create-blog/hooks/use-get-categories";

const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
];

interface PostFormData {
    title: string;
    content: string;
    // Định nghĩa content cho danh mục
    contentHtml: string;
    // Định dạng HTML cho nội dung
    references: string[];
    // Mảng chứa các tham chiếu
    categoryId: string;
    // ID của danh mục được chọn
    doctorId: string;
    // ID của bác sĩ được chọn
    thumbnail_url?: string;
    // URL của ảnh thumbnail, có thể không bắt buộc
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
            thumbnail_url: "",
        },
    });
    const { onSubmit: uploadImage, isPending: isUploading } = useUploadImage();
    const { getCategoriesApi } = useGetDataCategories();
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [data, setData] = useState<API.TGetCategories>([]);

    useEffect(() => {
        handleGetData();
    }, []);

    const handleGetData = async () => {
        try {
            const res = await getCategoriesApi();
            setData(res?.value.data || []);
        } catch (err) {}
    };

    const updateContentHtml = (editorContent: string) => {
        form.setValue("contentHtml", editorContent);
    };

    const handleClearImages = () => {
        setThumbnailUrl(null);
        form.setValue("thumbnail_url", "");
    };

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(
                { image: file },
                () => {
                    e.target.value = "";
                },
                (imageId, publicId, publicUrl) => {
                    setThumbnailUrl(publicUrl);
                    form.setValue("thumbnail_url", publicUrl);
                }
            );
        }
    };

    const handleFormSubmit = (data: PostFormData) => {
        setIsSubmitting(true);
        try {
            console.log("Post data:", data);
            handleClearImages();
            form.reset();
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

                    {/* Thumbnail Upload */}
                    <motion.div variants={itemVariants}>
                        <FormField
                            control={form.control}
                            name="thumbnail_url"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                        Ảnh đại diện
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            disabled={isUploading}
                                            className="h-12 text-base border-2 focus:border-[#248fca] transition-colors"
                                        />
                                    </FormControl>
                                    {thumbnailUrl && (
                                        <div className="mt-2">
                                            <Image
                                                src={thumbnailUrl}
                                                alt="Thumbnail Preview"
                                                width={200}
                                                height={200}
                                                className="rounded-lg object-cover"
                                            />
                                            <p className="text-sm text-gray-600 mt-1">
                                                Thumbnail URL:{" "}
                                                <a
                                                    href={thumbnailUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline"
                                                >
                                                    {thumbnailUrl}
                                                </a>
                                            </p>
                                        </div>
                                    )}
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
                                            onUpdate={updateContentHtml}
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

                    {/* Select Doctor and Category */}
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-between gap-4 pt-8 border-t-2 border-gray-100"
                    >
                        {/* Categories Select */}
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chọn danh mục</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={data.length === 0} // Disable Select if no categories
                                    >
                                        <SelectTrigger className="w-[280px]">
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-40">
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Danh mục
                                                </SelectLabel>
                                                {data.length > 0 ? (
                                                    data.map((category) => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={category.id}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem
                                                        value="no-categories"
                                                        disabled
                                                    >
                                                        Không có danh mục
                                                    </SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Select Doctor */}
                        <div>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-[200px] justify-between"
                                    >
                                        {value
                                            ? frameworks.find(
                                                  (framework) =>
                                                      framework.value === value
                                              )?.label
                                            : "Select framework..."}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search framework..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                No framework found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {frameworks.map((framework) => (
                                                    <CommandItem
                                                        key={framework.value}
                                                        value={framework.value}
                                                        onSelect={(
                                                            currentValue
                                                        ) => {
                                                            setValue(
                                                                currentValue ===
                                                                    value
                                                                    ? ""
                                                                    : currentValue
                                                            );
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        {framework.label}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                value ===
                                                                    framework.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
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

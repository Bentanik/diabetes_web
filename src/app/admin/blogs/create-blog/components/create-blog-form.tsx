"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FileText, ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Upload } from "lucide-react";
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
import React, { useState } from "react";
import TiptapEditor from "@/components/tiptap";
import Image from "next/image";

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
];

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
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    // Function to update contentHtml with only editor content
    const updateContentHtml = (editorContent: string) => {
        form.setValue("contentHtml", editorContent);
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

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Kích thước file không được vượt quá 5MB");
                return;
            }

            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Vui lòng chọn file hình ảnh");
                return;
            }

            setLogoFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
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
                            Logo bệnh viện
                        </Label>
                        <div className="flex items-center gap-6">
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
                                        Chọn logo
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
                                        src={logoPreview || "/placeholder.svg"}
                                        alt="Logo preview"
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
                                            onUpdate={(content) => {
                                                updateContentHtml(content);
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

                    {/* Select Doctor and Category */}
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-between gap-4 pt-8 border-t-2 border-gray-100"
                    >
                        {/* Select Doctor */}
                        <div className="">
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
                        {/* Select Category */}
                        {/* <div className="">
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
                        </div> */}
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

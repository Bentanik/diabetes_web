"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Check,
    ChevronsUpDown,
    Upload,
    ImageIcon,
    Stethoscope,
    ListTree,
} from "lucide-react";
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

const doctors = [
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b79",
        value: "tanphat",
        label: "Bs.Lâm Tấn Phát",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b79",
        value: "tanphat1",
        label: "Bs.Lâm Tấn Phát1",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b79",
        value: "tanphat2",
        label: "Bs.Lâm Tấn Phát2",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b79",
        value: "tanphat3",
        label: "Bs.Lâm Tấn Phát3",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b79",
        value: "tanphat4",
        label: "Bs.Lâm Tấn Phát4",
    },
];

interface PostFormData {
    title: string;
    content: string;
    contentHtml: string;
    references: string[];
    categoryId: string;
    doctorId: string;
    thumbnail_url?: string;
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
    const { getCategoriesApi, isPending } = useGetDataCategories();
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [data, setData] = useState<API.TGetCategories>([]);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

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

    const updateContentHtml = (editorContent: string) => {
        form.setValue("contentHtml", editorContent);
    };

    const handleClearImages = () => {
        setThumbnailUrl(null);
        form.setValue("thumbnail_url", "");
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
                            {/* Categories Select */}
                            <div>
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                <ListTree className="h-5 w-5 text-[#248fca]" />
                                                Chọn thể loại
                                            </Label>
                                            <div className="mt-2">
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                    disabled={isPending} // Disable Select if no categories
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
                                                                data.map(
                                                                    (
                                                                        category
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                category.id
                                                                            }
                                                                            value={
                                                                                category.id
                                                                            }
                                                                        >
                                                                            {
                                                                                category.name
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )
                                                            ) : (
                                                                <SelectItem
                                                                    value="no-categories"
                                                                    disabled
                                                                >
                                                                    Không có
                                                                    danh mục
                                                                </SelectItem>
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Select Doctor */}
                            <div>
                                <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                    <Stethoscope className="h-5 w-5 text-[#248fca]" />
                                    Chọn bác sĩ
                                </Label>
                                <div className="mt-4">
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-[200px] justify-between"
                                            >
                                                {value
                                                    ? doctors.find(
                                                          (doctor) =>
                                                              doctor.value ===
                                                              value
                                                      )?.label
                                                    : "Lựa chọn bác sĩ"}
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
                                                        {doctors.map(
                                                            (doctor) => (
                                                                <CommandItem
                                                                    key={
                                                                        doctor.value
                                                                    }
                                                                    value={
                                                                        doctor.value
                                                                    }
                                                                    onSelect={(
                                                                        currentValue
                                                                    ) => {
                                                                        setValue(
                                                                            currentValue ===
                                                                                value
                                                                                ? ""
                                                                                : currentValue
                                                                        );
                                                                        setOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        doctor.label
                                                                    }
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            value ===
                                                                                doctor.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
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

"use client";

import React from "react";
import EditDoctor from "./edit-doctor";
import { motion } from "framer-motion";
import {
    AlertCircle,
    ImageIcon,
    Upload,
    Smartphone,
    BadgeCheck,
    CircleUserRound,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import {
    ChevronDownIcon,
    Phone,
    UserPen,
    Award,
    VenusAndMars,
    CalendarDays,
    Info,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import { useState, useEffect, useCallback } from "react";
import useUploadImage from "@/app/admin/blogs/update-blog/hooks/use-upload-image";
import useUpdateBlog, {
    BlogFormData,
} from "@/app/admin/blogs/update-blog/hooks/use-update-blog";
import { useRouter } from "next/navigation";

export default function CreateDoctorForm({ blogId }: REQUEST.BlogId) {
    const { form, onSubmit } = useUpdateBlog({ blogId });
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ Thêm state để lưu contentHtml và trigger re-render
    const [currentContentHtml, setCurrentContentHtml] = useState("");

    const handleSubmit = () => {
        console.log("Đã submit thành công");
    };

    const handleImageChange = () => {
        console.log("Đã submit thành công");
    };

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

    // ✅ Cập nhật logic để đồng bộ cả form và state
    const updateContentHtml = useCallback(
        (editorContent: string) => {
            // Cập nhật form value
            form.setValue("contentHtml", editorContent, {
                shouldValidate: true,
            });

            // Cập nhật state để trigger re-render
            setCurrentContentHtml(editorContent);

            // Trigger form validation
            form.trigger("contentHtml");
        },
        [form]
    );

    // ✅ Đồng bộ state khi form value thay đổi
    useEffect(() => {
        const formValue = form.getValues("contentHtml");
        if (formValue !== currentContentHtml) {
            setCurrentContentHtml(formValue || "");
        }
    }, [form.watch("contentHtml"), currentContentHtml]);

    return (
        <div className="min-h-screen">
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex gap-10">
                        <div className="flex-2">
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

                            <div className="flex gap-[10%] mt-10">
                                {/* Họ và tên */}
                                <div className="flex-1">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <UserPen className="h-5 w-5 text-[#248fca]" />
                                                    Họ và tên
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập họ và tên bác sĩ"
                                                        className="h-12 text-base border-2 focus:border-[#248fca] transition-colors"
                                                        onChange={
                                                            field.onChange
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
                                <div className="flex-1">
                                    {/*Số điện thoại */}
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <Phone className="h-5 w-5 text-[#248fca]" />
                                                    Số điện thoại
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập số điện thoại của bác sĩ"
                                                        className="h-12 text-base border-2 focus:border-[#248fca] transition-colors"
                                                        onChange={
                                                            field.onChange
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
                            </div>

                            <div className="flex gap-[10%] mt-10">
                                {/*Số năm kinh nghiệm */}
                                <div className="flex-1">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <Award className="h-5 w-5 text-[#248fca]" />
                                                    Năm kinh nghiệm
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập số năm kinh nghiệm của bác sĩ"
                                                        className="h-12 text-base border-2 focus:border-[#248fca] transition-colors"
                                                        onChange={
                                                            field.onChange
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
                                {/* Giới tính */}
                                <div className="flex flex-1 gap-[5%]">
                                    <div className="flex-1">
                                        <FormField
                                            control={form.control}
                                            name="categoryIds"
                                            render={() => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div>
                                                            <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-2">
                                                                <VenusAndMars className="h-5 w-5 text-[#248fca]" />
                                                                Giới tính
                                                            </FormLabel>
                                                            <Select>
                                                                <SelectTrigger className="w-[250px] min-h-[50px]">
                                                                    <SelectValue placeholder="Chọn giới tính" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Chọn
                                                                            giới
                                                                            tính
                                                                        </SelectLabel>
                                                                        <SelectItem value="blueberry">
                                                                            Nam
                                                                        </SelectItem>
                                                                        <SelectItem value="apple">
                                                                            Nữ
                                                                        </SelectItem>
                                                                        <SelectItem value="banana">
                                                                            Khác
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="flex items-center gap-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                    </FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Ngày sinh */}
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="categoryIds"
                                            render={() => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div>
                                                            <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-2">
                                                                <CalendarDays className="h-5 w-5 text-[#248fca]" />
                                                                Ngày sinh
                                                            </FormLabel>
                                                            <Popover
                                                                open={open}
                                                                onOpenChange={
                                                                    setOpen
                                                                }
                                                            >
                                                                <PopoverTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        id="date"
                                                                        className="w-[250px] h-[50px] justify-between font-normal"
                                                                    >
                                                                        {date ? (
                                                                            date.toLocaleDateString()
                                                                        ) : (
                                                                            <div className="text-[#626874]">
                                                                                Chọn
                                                                                ngày
                                                                                sinh
                                                                            </div>
                                                                        )}
                                                                        <ChevronDownIcon />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className="w-auto overflow-hidden p-0"
                                                                    align="start"
                                                                >
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={
                                                                            date
                                                                        }
                                                                        captionLayout="dropdown"
                                                                        onSelect={(
                                                                            date
                                                                        ) => {
                                                                            setDate(
                                                                                date
                                                                            );
                                                                            setOpen(
                                                                                false
                                                                            );
                                                                        }}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="flex items-center gap-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                    </FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex">
                                <div className="flex-1">
                                    <FormField
                                        control={form.control}
                                        name="contentHtml"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <Info className="h-5 w-5 text-[#248fca]" />
                                                    Thông tin bổ sung
                                                </FormLabel>
                                                <FormControl>
                                                    <EditDoctor
                                                        content={field.value}
                                                        onUpdate={
                                                            updateContentHtml
                                                        }
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
                                                <div>
                                                    {/* Header */}
                                                    <div>
                                                        <div className="flex gap-5 leading-5">
                                                            <Image
                                                                src="/images/default_user.png"
                                                                alt="avatar"
                                                                width={100}
                                                                height={100}
                                                                className="rounded-full"
                                                            />
                                                            <div>
                                                                {/* Trình độ */}
                                                                <p className="text-[gray] font-thin text-[0.9rem]">
                                                                    PGS. TS. BS
                                                                </p>
                                                                <h2 className="font-medium text-[1.2rem]">
                                                                    Lâm Việt
                                                                    Trung
                                                                </h2>
                                                                <div className="flex gap-1 items-center">
                                                                    <BadgeCheck
                                                                        width={
                                                                            15
                                                                        }
                                                                        color="#0066ff"
                                                                    />
                                                                    <p className="text-[#0066ff] text-[0.9rem]">
                                                                        Bác sĩ
                                                                    </p>
                                                                </div>
                                                                <p className=" text-[0.9rem]">
                                                                    <span className="font-medium">
                                                                        25
                                                                    </span>{" "}
                                                                    năm kinh
                                                                    nghiệm
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-thin mt-1 text-[0.9rem]">
                                                            Chuyên khoa:{" "}
                                                            <span className="px-3 py-1 bg-gray-200 rounded-full text-[1rem]">
                                                                Tiêu hóa
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 mt-10">
                                                        <CircleUserRound />
                                                        <p>Giới thiệu bác sĩ</p>
                                                    </div>
                                                    <div
                                                        className="prose prose-sm max-w-none mt-5"
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                currentContentHtml ||
                                                                "",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl mt-10 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2 ">
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
                                    "Tạo bác sĩ"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

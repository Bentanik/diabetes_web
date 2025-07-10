"use client";

import React from "react";
import EditDoctor from "./edit-doctor";
import { motion } from "framer-motion";
import { FileText, AlertCircle, ImageIcon, Upload } from "lucide-react";
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

    const [content, setContent] = useState("");

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

    const updateContentHtml = (editorContent: string) => {
        form.setValue("contentHtml", editorContent);
        const textContent = extractTextContent(editorContent);
        setContent(textContent);
    };
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
                                                                        {date
                                                                            ? date.toLocaleDateString()
                                                                            : "Chọn ngày sinh"}
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

                            <div className="mt-10">
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
                                                    onUpdate={(html) => {
                                                        updateContentHtml(html);
                                                        form.trigger(
                                                            "contentHtml"
                                                        );
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
                            </div>
                            <Button
                                type="submit"
                                className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl mt-10"
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
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

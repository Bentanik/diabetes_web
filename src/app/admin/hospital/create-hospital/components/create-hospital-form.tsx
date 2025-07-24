"use client";

import React from "react";
import EditDoctor from "@/components/editor/editor";
import { motion } from "framer-motion";
import {
    AlertCircle,
    ImageIcon,
    Upload,
    Smartphone,
    BadgeCheck,
    CircleUserRound,
    Eye,
    Trash2,
    X,
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
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import useUploadUserImage from "@/app/hospital/doctor/create-doctor/hooks/use-upload-image";
import useCreateDoctor, {
    DoctorFormData,
} from "@/app/hospital/doctor/create-doctor/hooks/use-create-doctor";
import { useRouter } from "next/navigation";

export default function CreateDoctorForm({ blogId }: REQUEST.BlogId) {
    const { form, onSubmit } = useCreateDoctor();
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [thumbnailPreviews, setThumbnailPreviews] = useState<string[]>([]);
    const [thumbnailIds, setThumbnailIds] = useState<string[]>([]);
    const [avatarPreview, setAvatarPreview] = useState<string>();
    const [avatarId, setAvatarId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isPending: isUploading, onSubmit: onSubmitImage } =
        useUploadUserImage();
    const [currentContentHtml, setCurrentContentHtml] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const router = useRouter();

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        isAvatar: boolean
    ) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const imagesData = Array.from(files).map((file) => ({
                image: file,
            }));

            for (const data of imagesData) {
                await onSubmitImage(
                    data,
                    handleClearImages,
                    (imageId, publicId, publicUrl) => {
                        if (isAvatar) {
                            // Handle single avatar
                            form.setValue("avatarId", imageId);
                            setAvatarPreview(publicUrl);
                            setAvatarId(imageId);
                            // setThumbnailPreviews([]);
                            // setThumbnailIds([]);
                        } else {
                            // Handle multiple thumbnails
                            // form.setValue("images", [
                            //     ...(form.getValues("images") || []),
                            //     imageId,
                            // ]);
                            setThumbnailPreviews((prev) => [
                                ...prev,
                                publicUrl,
                            ]);
                            setThumbnailIds((prev) => [...prev, imageId]);
                        }
                    }
                );
            }
        }
    };

    console.log("avatarURL" + avatarPreview);
    console.log(form.watch("avatarId"));
    // console.log(form.watch("images"));

    const handleClearImages = () => {
        // setThumbnailIds([]);
        // setAvatarId("");
        // setThumbnailPreviews([]);
        // setAvatarPreview("");
    };

    const updateContentHtml = useCallback(
        (editorContent: string) => {
            form.setValue("introduction", editorContent, {
                shouldValidate: true,
            });
            setCurrentContentHtml(editorContent);
            form.trigger("introduction");
        },
        [form]
    );

    useEffect(() => {
        const formValue = form.getValues("introduction");
        if (formValue !== currentContentHtml) {
            setCurrentContentHtml(formValue || "");
        }
    }, [form.watch("introduction"), currentContentHtml]);

    const handleFormSubmit = async (data: DoctorFormData) => {
        if (!onSubmit || typeof onSubmit !== "function") {
            console.error("onSubmit is not a function");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData: REQUEST.TCreateDoctor = {
                phoneNumber: data.phoneNumber || "",
                firstName: data.firstName || "",
                middleName: data.middleName || "",
                lastName: data.lastName || "",
                dateOfBirth: data.dateOfBirth || "",
                gender: typeof data.gender === "number" ? data.gender : 1,
                avatarId: data.avatarId || "",
                numberOfExperiences:
                    typeof data.numberOfExperiences === "number"
                        ? data.numberOfExperiences
                        : 0,
                position: typeof data.position === "number" ? data.position : 1,
                introduction: data.introduction || "",
                // images: data.images?.length ? data.images : [],
            };
            onSubmit(formData, () => {
                handleClearImages();
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

    const removeImage = (index: number) => {
        setThumbnailPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen">
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <div className="flex gap-10">
                        <div className="flex-2">
                            <div className="flex gap-[10%]">
                                {/* Avatar Upload */}
                                <div className="flex-1">
                                    <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                        <ImageIcon className="h-5 w-5 text-[#248fca]" />
                                        Chọn ảnh đại diện
                                    </Label>
                                    <div className="flex items-center gap-6 mt-2">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleImageChange(e, true)
                                                }
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                id="avatar-upload"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex items-center gap-2 h-12 px-6 border-2 border-[#248fca] text-[#248fca] hover:bg-[#248fca] hover:text-white transition-all duration-300"
                                                asChild
                                            >
                                                <label
                                                    htmlFor="avatar-upload"
                                                    className="cursor-pointer"
                                                >
                                                    <Upload className="h-5 w-5" />
                                                    Chọn ảnh
                                                </label>
                                            </Button>
                                        </div>
                                        {avatarPreview && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                className="w-20 h-20 rounded-xl border-4 border-[#248fca]/20 overflow-hidden shadow-lg"
                                            >
                                                <Image
                                                    src={
                                                        avatarPreview ||
                                                        "/placeholder.svg"
                                                    }
                                                    width={80}
                                                    height={80}
                                                    alt="Avatar preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Chấp nhận file JPG, PNG. Kích thước tối
                                        đa 5MB.
                                    </p>
                                </div>

                                {/* Images */}
                                <div className="flex items-center gap-6 mb-4">
                                    {/* Nút upload */}
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) =>
                                                handleImageChange(e, false)
                                            }
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            id="thumbnails-upload"
                                        />
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 h-12 px-6 border-2 border-[#248fca] text-[#248fca] hover:bg-[#248fca] hover:text-white rounded-lg transition-colors duration-300"
                                        >
                                            <Upload className="h-5 w-5" />
                                            Chọn ảnh
                                        </button>
                                    </div>

                                    {/* Ô đếm ảnh và Dialog */}
                                    {thumbnailPreviews.length > 0 && (
                                        <Dialog>
                                            {/* Ô đếm ảnh làm trigger mở dialog */}
                                            <DialogTrigger asChild>
                                                <div className="w-[100px] h-[100px] bg-gray-300 text-gray-800 flex items-center justify-center rounded-lg cursor-pointer">
                                                    <span className="text-xl font-semibold">
                                                        {
                                                            thumbnailPreviews.length
                                                        }
                                                    </span>
                                                </div>
                                            </DialogTrigger>

                                            {/* Nội dung dialog */}
                                            <DialogContent className="sm:max-w-2xl h-[600px]">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Ảnh đã chọn (
                                                        {
                                                            thumbnailPreviews.length
                                                        }
                                                        )
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Bạn có thể xem, xóa hoặc
                                                        đóng dialog.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                {/* Nút xóa tất cả */}
                                                <div className="mb-4">
                                                    <button
                                                        onClick={() =>
                                                            setThumbnailPreviews(
                                                                []
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-600 text-sm"
                                                    >
                                                        Xóa tất cả ảnh
                                                    </button>
                                                </div>

                                                {/* Hiển thị danh sách ảnh */}
                                                <div className="grid grid-cols-3 gap-4  overflow-x-auto">
                                                    {thumbnailPreviews.map(
                                                        (preview, index) => (
                                                            <div
                                                                key={index}
                                                                className="relative group"
                                                            >
                                                                <img
                                                                    src={
                                                                        preview
                                                                    }
                                                                    alt={`Ảnh ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                    className="w-full h-32 object-cover rounded-md cursor-pointer border border-gray-200"
                                                                    onClick={() =>
                                                                        setSelectedImage(
                                                                            preview
                                                                        )
                                                                    }
                                                                />
                                                                <button
                                                                    onClick={() =>
                                                                        removeImage(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="absolute top-1 right-1 bg-white p-1 rounded-full opacity-80 hover:opacity-100 transition"
                                                                    title="Xóa ảnh"
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                                {/* Footer có nút đóng dialog */}
                                                <DialogFooter className="mt-6">
                                                    <DialogClose asChild>
                                                        <Button variant="secondary">
                                                            Đóng
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>

                                <p className="text-sm text-gray-500">
                                    Chấp nhận file JPG, PNG. Kích thước tối đa
                                    5MB mỗi ảnh.
                                </p>

                                {/* Modal xem ảnh lớn */}
                                {selectedImage && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                                        onClick={() => setSelectedImage("")}
                                    >
                                        <div className="relative max-w-4xl max-h-full">
                                            <img
                                                src={selectedImage}
                                                alt="Preview"
                                                className="max-w-full max-h-full object-contain rounded-lg"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                            <button
                                                onClick={() =>
                                                    setSelectedImage("")
                                                }
                                                className="absolute -top-4 -right-4 bg-white hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors duration-200"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-[10%] mt-10">
                                {/* Họ và tên */}
                                <div className="flex-1 flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <UserPen className="h-5 w-5 text-[#248fca]" />
                                                    Họ
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập họ của bác sĩ"
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
                                    <FormField
                                        control={form.control}
                                        name="middleName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <UserPen className="h-5 w-5 text-[#248fca]" />
                                                    Tên đệm
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập tên đệm bác sĩ"
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
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <UserPen className="h-5 w-5 text-[#248fca]" />
                                                    Tên
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập tên bác sĩ"
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
                                    {/* Số điện thoại */}
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
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
                                {/* Số năm kinh nghiệm */}
                                <div className="flex-1">
                                    <FormField
                                        control={form.control}
                                        name="numberOfExperiences"
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
                                            name="gender"
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
                                            name="dateOfBirth"
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
                                        name="introduction"
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
                                            <Image
                                                src="/images/phone.png"
                                                alt="phone frame"
                                                width={385}
                                                height={667}
                                                className="mx-auto"
                                            />
                                            <div
                                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-lg overflow-auto wrap-break-word"
                                                style={{
                                                    width: "340px",
                                                    height: "600px",
                                                }}
                                            >
                                                <div>
                                                    <div>
                                                        <div className="flex gap-5 leading-5">
                                                            <Image
                                                                src={
                                                                    avatarPreview ||
                                                                    "/images/default_user.png"
                                                                }
                                                                alt="avatar"
                                                                width={100}
                                                                height={100}
                                                                className="rounded-full"
                                                            />
                                                            <div>
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

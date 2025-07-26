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
import useUploadUserImage from "@/app/hospitals/doctor/create-doctor/hooks/use-upload-image";
import useCreateDoctor, {
    DoctorFormData,
} from "@/app/hospitals/doctor/create-doctor/hooks/use-create-doctor";
import { useRouter } from "next/navigation";

export default function CreateDoctorForm({ blogId }: REQUEST.BlogId) {
    const { form, onSubmit } = useCreateDoctor();
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isPending: isUploading, onSubmit: onSubmitImage } =
        useUploadUserImage();
    const [currentContentHtml, setCurrentContentHtml] = useState("");
    const router = useRouter();
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null
    );

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            // Convert image to base64 for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload image
            const data = { images: file };
            onSubmitImage(data, (imageId) => {
                form.setValue("avatarId", imageId);
            });
        }
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

    const firstName = form.watch("firstName");
    const middleName = form.watch("middleName");
    const lastName = form.watch("lastName");
    const exp = form.watch("numberOfExperiences");
    const getPosition = (position: number) => {
        switch (position) {
            case 0:
                return "Giám đốc";
            case 1:
                return "Phó Giám đốc";
            case 2:
                return "Trưởng khoa";
            case 3:
                return "Phó trưởng khoa";
            case 4:
                return "Bác sĩ";
            default:
                return "Chức vụ không xác định";
        }
    };

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
                gender: data.gender,
                avatarId: data.avatarId || "",
                numberOfExperiences:
                    typeof data.numberOfExperiences === "number"
                        ? data.numberOfExperiences
                        : 0,
                position: data.position,
                introduction: "Địt mẹ m",
            };
            onSubmit(formData, () => {
                form.reset();
                setTimeout(() => {
                    router.push("/hospitals/doctor");
                }, 2000);
            });
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Có lỗi xảy ra khi cập nhật bài viết.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <div className="flex gap-10">
                        <div className="flex-2">
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
                                <div className="flex-1 flex gap-[15%]">
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
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    e.target
                                                                        .value
                                                                )
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
                                        <FormField
                                            control={form.control}
                                            name="position"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div>
                                                            <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-2">
                                                                <VenusAndMars className="h-5 w-5 text-[#248fca]" />
                                                                Vị trí
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        Number(
                                                                            value
                                                                        )
                                                                    )
                                                                }
                                                                value={field.value?.toString()}
                                                            >
                                                                <SelectTrigger className="w-[250px] min-h-[50px]">
                                                                    <SelectValue placeholder="Chọn vị trí" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Chọn
                                                                            vị
                                                                            trí
                                                                        </SelectLabel>
                                                                        <SelectItem value="0">
                                                                            Giám
                                                                            đốc
                                                                        </SelectItem>
                                                                        <SelectItem value="1">
                                                                            Phó
                                                                            giám
                                                                            đốc
                                                                        </SelectItem>
                                                                        <SelectItem value="2">
                                                                            Trưởng
                                                                            khoa
                                                                        </SelectItem>
                                                                        <SelectItem value="3">
                                                                            Phó
                                                                            trưởng
                                                                            khoa
                                                                        </SelectItem>
                                                                        <SelectItem value="4">
                                                                            Bác
                                                                            sĩ
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
                                </div>
                                {/* Giới tính */}
                                <div className="flex flex-1 gap-[5%]">
                                    <div className="flex-1">
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div>
                                                            <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-2">
                                                                <VenusAndMars className="h-5 w-5 text-[#248fca]" />
                                                                Giới tính
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        Number(
                                                                            value
                                                                        )
                                                                    )
                                                                } // Convert string to number
                                                                value={field.value?.toString()} // Ensure value is string for Select
                                                            >
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
                                                                        <SelectItem value="0">
                                                                            Nam
                                                                        </SelectItem>
                                                                        <SelectItem value="1">
                                                                            Nữ
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
                                            render={({ field }) => (
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
                                                                            selectedDate
                                                                        ) => {
                                                                            setDate(
                                                                                selectedDate
                                                                            );
                                                                            if (
                                                                                selectedDate
                                                                            ) {
                                                                                const offsetDate =
                                                                                    new Date(
                                                                                        selectedDate.getTime() +
                                                                                            7 *
                                                                                                60 *
                                                                                                60 *
                                                                                                1000
                                                                                    );
                                                                                const isoDate =
                                                                                    offsetDate.toISOString();
                                                                                field.onChange(
                                                                                    isoDate
                                                                                );
                                                                            } else {
                                                                                field.onChange(
                                                                                    null
                                                                                );
                                                                            }
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
                                                                    thumbnailPreview ||
                                                                    "/images/default_user.png"
                                                                }
                                                                alt="avatar"
                                                                width={100}
                                                                height={100}
                                                                className="rounded-full"
                                                            />
                                                            <div className="mt-3">
                                                                <div className="font-medium text-[1.2rem] flex gap-1">
                                                                    <span>
                                                                        {firstName ||
                                                                            "Họ"}
                                                                    </span>
                                                                    <span>
                                                                        {middleName ||
                                                                            ""}
                                                                    </span>
                                                                    <span>
                                                                        {lastName ||
                                                                            "Tên"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-1 items-center">
                                                                    <BadgeCheck
                                                                        width={
                                                                            15
                                                                        }
                                                                        color="#0066ff"
                                                                    />
                                                                    <p className="text-[#0066ff] text-[0.9rem]">
                                                                        {getPosition(
                                                                            form.watch(
                                                                                "position"
                                                                            )
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <p className=" text-[0.9rem]">
                                                                    <span className="font-medium">
                                                                        {exp}
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
                                disabled={isSubmitting || !thumbnailPreview}
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

"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, ImageIcon, Mail, Upload } from "lucide-react";
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
import { UserPen, VenusAndMars } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AvatarUpload from "./thumbnail-upload";
import DateOfBirthPicker from "./date-picker";
import HospitalSelect from "./select-hospital";
import useCreateHospitalStaff, {
    HospitalStaffFormData,
} from "../hooks/use-create-hospital-staff";

export default function CreateHospitalStaffForm() {
    const { form, onSubmit, isPending } = useCreateHospitalStaff();
    const router = useRouter();
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [avatarPreview, setAvatarPreview] = useState<string>();

    const handleFormSubmit = async (data: HospitalStaffFormData) => {
        try {
            const formData: REQUEST.TCreateHospitalStaff = {
                email: data.email,
                firstName: data.firstName || "",
                middleName: data.middleName || "",
                lastName: data.lastName || "",
                dateOfBirth: data.dateOfBirth || "",
                gender: data.gender,
                avatarId: data.avatarId || "",
                hospitalId: data.hospitalId,
            };
            onSubmit(formData, () => {
                form.reset();
                setTimeout(() => {
                    router.push("/admin/hospital-staff");
                }, 2000);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="min-h-screen">
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <div className="flex gap-10">
                        <div className="flex-2">
                            {/* Thumbnail Upload */}
                            <AvatarUpload
                                form={form}
                                avatarPreview={avatarPreview}
                                setAvatarPreview={setAvatarPreview}
                                onPendingChange={setIsUploading}
                            />
                            <div className="flex mt-10 gap-[10%]">
                                <div className="flex-1 gap-[10%]">
                                    {/* Họ và tên */}
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem className="mb-5">
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
                                            <FormItem className="mb-5">
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
                                        name="firstName"
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
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="mb-5">
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <Mail className="h-5 w-5 text-[#248fca]" />
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập email của nhân viên"
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

                                    {/* Giới tính */}
                                    <div className="flex">
                                        <div className="flex-1 mb-5">
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
                                                                    }
                                                                    value={field.value?.toString()}
                                                                >
                                                                    <SelectTrigger className="w-[250px] min-h-[px]">
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
                                        <DateOfBirthPicker
                                            control={form.control}
                                            name="dateOfBirth"
                                        />
                                    </div>
                                    {/* Select Doctor */}
                                    <FormField
                                        control={form.control}
                                        name="hospitalId"
                                        render={() => (
                                            <FormItem>
                                                <FormControl>
                                                    <HospitalSelect
                                                        control={form.control}
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

                            <Button
                                type="submit"
                                disabled={
                                    !avatarPreview || isUploading || isPending
                                }
                                className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl mt-10 cursor-pointer"
                            >
                                Tạo nhân viên
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

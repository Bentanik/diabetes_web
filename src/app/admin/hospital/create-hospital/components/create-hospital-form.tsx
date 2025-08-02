"use client";

import React from "react";
import EditDoctor from "@/components/editor/editor";
import { AlertCircle, Globe, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, UserPen, Award, Info } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState, useEffect, useCallback } from "react";
import useCreateHospital, {
    HospitalFormData,
} from "@/app/admin/hospital/create-hospital/hooks/use-create-hospital";
import { useRouter } from "next/navigation";
import useToast from "@/hooks/use-toast";
import MobilePreview from "./mobile-preview";
import ImagesUpload from "./images-upload";
import AvatarUpload from "./thumbnail-upload";

export default function CreateHospitalForm({ hospitalId }: REQUEST.HospitalId) {
    const { form, onSubmit, isPending: submitPending } = useCreateHospital();
    const [avatarPreview, setAvatarPreview] = useState<string>();
    const [currentContentHtml, setCurrentContentHtml] = useState("");
    const router = useRouter();
    const [pendingImages, setPendingImages] = useState<
        { file: File; preview: string }[]
    >([]);
    const [uploadedImages, setUploadedImages] = useState<
        { id: string; preview: string }[]
    >([]);

    const { addToast } = useToast();

    const images = form.watch("images");
    const thumbnail = form.watch("thumbnail");
    const name = form.watch("name");
    const email = form.watch("email");
    const phoneNumber = form.watch("phoneNumber");
    const address = form.watch("address");
    const website = form.watch("website");

    const handleClearImages = () => {
        setAvatarPreview("");
        form.setValue("images", []);
        form.setValue("thumbnail", "");
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

    // Handle Submit Create Hospital
    const handleFormSubmit = async (data: HospitalFormData) => {
        if (pendingImages.length !== 0) {
            addToast({
                type: "error",
                description: "Hãy kiểm tra bạn còn ảnh chưa được upload",
                duration: 5000,
            });
            return;
        }

        if (!onSubmit || typeof onSubmit !== "function") {
            console.error("onSubmit is not a function");
            return;
        }
        try {
            const formData: REQUEST.TCreateHospital = {
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                website: data.website,
                address: data.address,
                introduction: data.introduction,
                thumbnail: data.thumbnail,
                images: data.images,
            };
            onSubmit(formData, () => {
                handleClearImages();
                setPendingImages([]);
                setUploadedImages([]);
                form.reset();
                setTimeout(() => {
                    router.push("/admin/hospital");
                }, 2000);
            });
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return (
        <div className="min-h-screen">
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <div className="flex gap-10">
                        <div className="flex-2">
                            <div className="flex gap-[10%]">
                                {/* Thumbnail Upload */}
                                <AvatarUpload
                                    form={form}
                                    avatarPreview={avatarPreview}
                                    setAvatarPreview={setAvatarPreview}
                                />

                                {/* Images Upload*/}
                                <ImagesUpload
                                    form={form}
                                    pendingImages={pendingImages}
                                    setPendingImages={setPendingImages}
                                    uploadedImages={uploadedImages}
                                    setUploadedImages={setUploadedImages}
                                />
                            </div>

                            <div className="flex gap-[10%] mt-10">
                                {/* Name Input */}
                                <div className="flex-1 flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <UserPen className="h-5 w-5 text-[#248fca]" />
                                                    Tên
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập tên của bệnh viện"
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

                                    {/* Email Input */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <Mail className="h-5 w-5 text-[#248fca]" />
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập email của bệnh viện"
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

                                {/* Phone Number Input */}
                                <div className="flex-1">
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
                                {/* Address Input */}
                                <div className="flex-1">
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <MapPin className="h-5 w-5 text-[#248fca]" />
                                                    Địa chỉ
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập địa chỉ của bệnh viện"
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
                                {/* Website Input */}
                                <div className="flex-1">
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <Globe className="h-5 w-5 text-[#248fca]" />
                                                    Địa chỉ website
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập địa chỉ website của bệnh viện"
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

                            {/* Introduction Editor */}
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
                                                        blogId={hospitalId}
                                                    />
                                                </FormControl>
                                                <FormMessage className="flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Mobile Preview */}
                                <MobilePreview
                                    avatarPreview={avatarPreview}
                                    imagesPreview={uploadedImages}
                                    currentContentHtml={currentContentHtml}
                                    name={name}
                                    email={email}
                                    phone={phoneNumber}
                                    location={address}
                                    website={website}
                                />
                            </div>
                            <Button
                                disabled={
                                    submitPending && !images && !thumbnail
                                }
                                type="submit"
                                className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl mt-10 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                            >
                                {submitPending ? (
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
                                    "Tạo bệnh viện"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

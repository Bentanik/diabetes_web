"use client";

import React, { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AlertCircle, ImageIcon, Plus, Upload } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import useUploadConversationImage from "@/app/hospital/conversation/hooks/use-upload-conversation";
import useUpdateConversation, {
    ConversationFormData,
} from "../hooks/use-update-conversation";
import { useRouter } from "next/navigation";

type UpdateProp = {
    conversationId: string;
};

export default function UpdateConversationDialog({
    conversationId,
}: UpdateProp) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { isPending: isUploading, onSubmit: onSubmitImage } =
        useUploadConversationImage();
    const { form, onSubmit } = useUpdateConversation({ conversationId });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
    const handleCancel = () => {
        console.log("");
    };

    const router = useRouter();

    const handleFormSubmit = async (data: ConversationFormData) => {
        if (!onSubmit || typeof onSubmit !== "function") {
            console.error("onSubmit is not a function");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData: REQUEST.TUpdateConversation = {
                name: data.name || null,
                avatarId: data.avatarId || null,
            };
            await onSubmit(formData, () => {
                setIsDialogOpen(false);
                form.reset();
                console.log("ádasdas");
            });
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Có lỗi xảy ra khi cập nhật bài viết.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
            const data = { files: file };
            onSubmitImage(data, (imageId) => {
                form.setValue("avatarId", imageId);
            });
        }
    };

    return (
        <div>
            <div className="flex gap-2">
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            handleCancel();
                        }
                        setIsDialogOpen(open);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="px-6 py-5 bg-[#248FCA] hover:bg-[#2490cada] cursor-pointer"
                        >
                            <Plus width={20} height={20} color="white" />
                            Cập nhật nhóm chat
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] h-[700px] flex flex-col">
                        <DialogHeader className="flex-shrink-0">
                            <DialogTitle className="text-[1.5rem] text-[#248FCA]">
                                Tạo nhóm chat
                            </DialogTitle>
                            <DialogDescription>
                                Điền đầy đủ nội dung để tạo nhóm chat mới
                            </DialogDescription>
                        </DialogHeader>

                        <FormProvider {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleFormSubmit)}
                                className="flex flex-col flex-1"
                            >
                                <div className="flex-1 space-y-6">
                                    {/* Image upload section */}
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
                                            Chấp nhận file JPG, PNG. Kích thước
                                            tối đa 5MB.
                                        </p>
                                    </div>

                                    {/* Name field */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    Tên nhóm
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập tên nhóm"
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

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        // disabled={isPending}
                                        className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        {/* {isPending
                                            ? "Đang tạo..."
                                            : "Tạo nhóm mới"} */}
                                        Tạo nhóm
                                    </Button>
                                </DialogFooter>
                            </form>
                        </FormProvider>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

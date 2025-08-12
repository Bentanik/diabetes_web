import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, AlertCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import useCreateConversation, {
    ConversationFormData,
} from "../hooks/use-create-conversation";
import useUploadConversationImage from "@/app/hospitals/conversation/hooks/use-upload-conversation";

interface CreateConversationProps {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
}

export default function CreateConversation({
    isDialogOpen,
    setIsDialogOpen,
}: CreateConversationProps) {
    const { isPending: isUploading, onSubmit: onSubmitImage } =
        useUploadConversationImage();
    const { onSubmit, form } = useCreateConversation();
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null
    );

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            const data = { files: file };
            onSubmitImage(data, (imageId) => {
                form.setValue("avatarId", imageId);
            });
        }
    };

    const handleSubmit = async (data: ConversationFormData) => {
        try {
            const conversationData: REQUEST.TCreateConversation = {
                name: data.name,
                avatarId: data.avatarId || null,
            };
            await onSubmit(conversationData, () => setIsDialogOpen(false));
        } catch (err) {
            console.log(err);
        }
    };

    const handleCancel = () => {
        form.setValue("name", "");
        form.setValue("avatarId", "");
        setThumbnailPreview(null);
        setIsDialogOpen(false);
    };

    return (
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
                    Thêm nhóm chat
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
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col flex-1"
                    >
                        <div className="flex-1 space-y-6">
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
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-1">
                                            {/* <AlertCircle className="h-4 w-4" /> */}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isUploading}
                                className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Tạo nhóm mới
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

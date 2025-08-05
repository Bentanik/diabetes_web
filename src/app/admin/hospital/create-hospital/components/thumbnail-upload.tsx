import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import useUploadUserImage from "@/app/hospitals/doctor/create-doctor/hooks/use-upload-image";

interface AvatarUploadProps {
    form: any;
    avatarPreview?: string;
    setAvatarPreview: React.Dispatch<React.SetStateAction<string | undefined>>;
    onPendingChange?: (isPending: boolean) => void;
}

export default function AvatarUpload({
    form,
    avatarPreview,
    setAvatarPreview,
    onPendingChange,
}: AvatarUploadProps) {
    const { onSubmit: onSubmitImage, isPending } = useUploadUserImage();

    useEffect(() => {
        onPendingChange?.(isPending);
    }, [isPending, onPendingChange]);

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            // Convert image to base64 for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload image
            const data = { images: file };
            onSubmitImage(data, (imageId) => {
                form.setValue("thumbnail", imageId as string);
            });
        }
    };

    return (
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
                        <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="h-5 w-5" />
                            Chọn ảnh
                        </label>
                    </Button>
                </div>
                {avatarPreview && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 rounded-xl border-4 border-[#248fca]/20 overflow-hidden shadow-lg"
                    >
                        <Image
                            src={avatarPreview || "/placeholder.svg"}
                            width={20}
                            height={20}
                            alt="Logo preview"
                            className="w-full h-full"
                        />
                    </motion.div>
                )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
                Chấp nhận file JPG, PNG. Kích thước tối đa 5MB.
            </p>
        </div>
    );
}

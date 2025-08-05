"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, Eye, Trash2, X } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import useUploadUserImage from "@/app/hospitals/doctor/create-doctor/hooks/use-upload-image";

interface ImagesUploadProps {
    form: any;
    pendingImages: { file: File; preview: string }[];
    setPendingImages: React.Dispatch<
        React.SetStateAction<{ file: File; preview: string }[]>
    >;
    uploadedImages: { id: string; preview: string }[];
    setUploadedImages: React.Dispatch<
        React.SetStateAction<{ id: string; preview: string }[]>
    >;
}

export default function ImagesUpload({
    form,
    pendingImages,
    setPendingImages,
    uploadedImages,
    setUploadedImages,
}: ImagesUploadProps) {
    const { isPending: isUploading, onSubmit: onSubmitImage } =
        useUploadUserImage();

    const handleImagesChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const newPreviews = await Promise.all(
            files.map(
                (file) =>
                    new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () =>
                            resolve(reader.result as string);
                        reader.onerror = () => reject("Failed to read file");
                        reader.readAsDataURL(file);
                    })
            )
        );

        const newPending = files.map((file, i) => ({
            file,
            preview: newPreviews[i],
        }));
        setPendingImages((prev) => [...prev, ...newPending]);
    };

    const handleUploadAllImages = async () => {
        if (!pendingImages.length) return;
        const files = pendingImages.map((img) => img.file);

        onSubmitImage({ images: files }, (imageIds) => {
            const uploadedIds = Array.isArray(imageIds) ? imageIds : [imageIds];

            const newUploaded = pendingImages.map((img, i) => ({
                id: uploadedIds[i],
                preview: img.preview,
            }));
            setUploadedImages((prev) => [...prev, ...newUploaded]);
            setPendingImages([]);
            const allIds = [...uploadedImages.map((u) => u.id), ...uploadedIds];
            form.setValue("images", allIds);
        });
    };

    const removeImage = (index: number, isUploaded: boolean) => {
        if (isUploaded) {
            const newUploaded = uploadedImages.filter((_, i) => i !== index);
            setUploadedImages(newUploaded);
            const newIds = newUploaded.map((img) => img.id);
            form.setValue("images", newIds);
        } else {
            const newPending = pendingImages.filter((_, i) => i !== index);
            setPendingImages(newPending);
        }
    };

    const clearAll = () => {
        setUploadedImages([]);
        setPendingImages([]);
        form.setValue("images", []);
    };

    return (
        <div className="flex-1">
            <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <ImageIcon className="h-5 w-5 text-[#248fca]" />
                Chọn nhiều ảnh
            </Label>
            <div className="flex items-center gap-6 mt-2">
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="images-upload"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 h-12 px-6 border-2 border-[#248fca] text-[#248fca] hover:bg-[#248fca] hover:text-white transition-all duration-300"
                        asChild
                    >
                        <label
                            htmlFor="images-upload"
                            className="cursor-pointer"
                        >
                            <Upload className="h-5 w-5" />
                            Chọn ảnh
                        </label>
                    </Button>
                </div>

                {(uploadedImages.length > 0 || pendingImages.length > 0) && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-20 h-20 bg-[#248fca]/10 border-2 border-[#248fca] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#248fca]/20 transition-all duration-300"
                            >
                                <div className="text-center">
                                    <Eye className="h-6 w-6 text-[#248fca] mx-auto mb-1" />
                                    <span className="text-sm font-semibold text-[#248fca]">
                                        {uploadedImages.length +
                                            pendingImages.length}
                                    </span>
                                </div>
                            </motion.div>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
                            <DialogHeader>
                                <DialogTitle>
                                    Quản lý ảnh (
                                    {uploadedImages.length +
                                        pendingImages.length}
                                    )
                                </DialogTitle>
                                <DialogDescription>
                                    Xem trước, xóa ảnh hoặc upload ảnh chưa được
                                    tải lên
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex justify-between items-center py-4 border-b">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={clearAll}
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" /> Xóa tất cả
                                </Button>
                                {pendingImages.length > 0 && (
                                    <Button
                                        onClick={handleUploadAllImages}
                                        disabled={isUploading}
                                        className="flex items-center gap-2 bg-[#248fca] hover:bg-[#1e7bb8]"
                                    >
                                        {isUploading ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                />
                                                Đang upload...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />{" "}
                                                Upload {pendingImages.length}{" "}
                                                ảnh
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {/* Uploaded Images */}
                                {uploadedImages.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium mb-2 text-green-600">
                                            Ảnh đã upload
                                        </h4>
                                        <div className="grid grid-cols-4 gap-4">
                                            {uploadedImages.map(
                                                (img, index) => (
                                                    <div
                                                        key={img.id}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={img.preview}
                                                            alt="Uploaded"
                                                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                removeImage(
                                                                    index,
                                                                    true
                                                                )
                                                            }
                                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Pending Images */}
                                {pendingImages.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium mb-2 text-orange-600">
                                            Ảnh chưa upload
                                        </h4>
                                        <div className="grid grid-cols-4 gap-4">
                                            {pendingImages.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={img.preview}
                                                        alt="Pending"
                                                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            removeImage(
                                                                index,
                                                                false
                                                            )
                                                        }
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="border-t pt-4">
                                <DialogClose asChild>
                                    <Button variant="secondary">Đóng</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
                Chấp nhận file JPG, PNG. Kích thước tối đa 5MB mỗi ảnh.
            </p>
        </div>
    );
}

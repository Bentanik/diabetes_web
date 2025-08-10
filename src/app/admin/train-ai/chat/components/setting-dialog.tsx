"use client";

import useCreateKnowlegeBase from "@/app/admin/train-ai/hooks/useCreateKnowlegeBase";
import { Modal } from "@/components/shared/Modal";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import TextAreaComponent from "@/components/textarea";
import { Label } from "@/components/ui/label";
import {
    FolderPlus,
    Loader2,
    Hash,
    Target,
    FileText,
    FileSliders,
} from "lucide-react";
import InputTrainAI from "@/components/input_train_ai";
import { useState } from "react";
import InputSettingAI from "@/components/input-ai-setting";

interface SettingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Component hiển thị modal tạo thư mục kiến thức
 * Bao gồm tên, mô tả, số lượng passages, độ chính xác tìm kiếm, độ dài passage
 */
export default function SettingModal({ isOpen, onClose }: SettingModalProps) {
    const { register, handleSubmit, errors, onSubmit, isCreating, reset } =
        useCreateKnowlegeBase();

    const [searchAccuracy, setSearchAccuracy] = useState([50]);

    const handleClose = () => {
        reset();
        setSearchAccuracy([50]);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="max-w-2xl"
            closeOnBackdrop={!isCreating}
        >
            <div className="relative">
                {/* Header với gradient background */}
                <div className="relative bg-[#248fca] p-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-4"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.3,
                                type: "spring",
                                stiffness: 200,
                            }}
                            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30"
                        >
                            <FileSliders className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl font-bold text-white"
                            >
                                Cấu hình chat AI
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-white/90 text-sm mt-1"
                            >
                                Cấu hình các tính năng cho chat AI
                            </motion.p>
                        </div>
                    </motion.div>
                    {/* Close button custom - disable khi loading */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={!isCreating ? { scale: 1.1 } : {}}
                        whileTap={!isCreating ? { scale: 0.9 } : {}}
                        onClick={!isCreating ? onClose : undefined}
                        disabled={isCreating}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 z-20 ${
                            isCreating
                                ? "text-white/40 cursor-not-allowed"
                                : "hover:bg-white/20 text-white/80 hover:text-white cursor-pointer"
                        }`}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </motion.button>
                </div>

                {/* Form content */}
                <div className="p-6 bg-white max-h-[80vh] overflow-y-auto">
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        // onSubmit={handleSubmit((data) =>
                        //     onSubmit(
                        //         {
                        //             ...data,
                        //             search_accuracy:
                        //                 searchAccuracy[0].toString(),
                        //         },
                        //         handleClose
                        //     )
                        // )}
                        className="space-y-6"
                    >
                        {/* Số lượng passages */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.9 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-[#248fca]" />
                                <Label
                                    htmlFor="number_of_passages"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Số lượng câu trong mỗi passage
                                </Label>
                                <span className="text-red-500 text-sm">*</span>
                            </div>
                            <InputSettingAI
                                type="number"
                                // register={register("number_of_passages")}
                                error=""
                                placeholder="Ví dụ: 5"
                                disabled={isCreating}
                                min="1"
                                max="50"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Số lượng câu sẽ được nhóm thành một passage (từ
                                1-50 câu)
                            </p>
                        </motion.div>

                        {/* Độ chính xác tìm kiếm */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 1.0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-[#248fca]" />
                                <Label className="text-sm font-semibold text-gray-800">
                                    Độ chính xác tìm kiếm
                                </Label>
                                <span className="text-red-500 text-sm">*</span>
                            </div>
                            <div className="space-y-3">
                                <div className="px-4 py-3 bg-gradient-to-r from-[#248fca]/5 to-blue-50 rounded-lg border border-[#248fca]/20">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-gray-600">
                                            Độ chính xác:
                                        </span>
                                        <span className="text-lg font-bold text-[#248fca]">
                                            {searchAccuracy[0]}%
                                        </span>
                                    </div>
                                    <Slider
                                        value={searchAccuracy}
                                        onValueChange={setSearchAccuracy}
                                        max={100}
                                        min={10}
                                        step={1}
                                        disabled={isCreating}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                                        <span>10%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Mức độ chính xác khi tìm kiếm thông tin
                                    trong thư mục (10% - 100%)
                                </p>
                            </div>
                        </motion.div>

                        {/* Độ dài passage */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 1.1 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#248fca]" />
                                <Label
                                    htmlFor="passage_length"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Độ dài tối đa của passage
                                </Label>
                                <span className="text-red-500 text-sm">*</span>
                            </div>
                            <InputSettingAI
                                type="number"
                                // register={register("passage_length")}
                                error=""
                                placeholder="Ví dụ: 1000"
                                disabled={isCreating}
                                min="100"
                                max="5000"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Số ký tự tối đa cho mỗi passage (từ 100-5000 ký
                                tự)
                            </p>
                        </motion.div>

                        {/* Checkbox với performance tối ưu */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.2 }}
                            className="bg-gradient-to-r from-[#248fca]/5 to-blue-50 p-5 rounded-xl border border-[#248fca]/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="useDescriptionForLLMCheck"
                                        className={`text-sm font-semibold text-gray-800 flex items-center gap-2 ${
                                            !isCreating
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed opacity-50"
                                        }`}
                                    >
                                        Chú ý
                                    </Label>
                                    <ul className="space-y-2">
                                        <li className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                                            <span className="text-[#248fca] mt-0.5">
                                                •
                                            </span>
                                            Cấu hình số lượng câu và độ dài
                                            passage phù hợp với loại nội dung.
                                        </li>
                                        <li className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                                            <span className="text-[#248fca] mt-0.5">
                                                •
                                            </span>
                                            Độ chính xác cao hơn sẽ cho kết quả
                                            tìm kiếm chính xác hơn nhưng chậm
                                            hơn.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        {/* Buttons hành động với animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.3 }}
                            className="flex justify-end gap-3 pt-6 border-t border-gray-100"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isCreating}
                                className="cursor-pointer px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreating}
                                className="px-6 py-2.5 bg-gradient-to-r from-[#248fca] to-[#1e7bb8] text-white hover:from-[#1e7bb8] hover:to-[#1565c0] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg cursor-pointer"
                            >
                                {isCreating ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Đang tạo...</span>
                                    </div>
                                ) : (
                                    "Hoàn tất cấu hình"
                                )}
                            </Button>
                        </motion.div>
                    </motion.form>
                </div>
            </div>
        </Modal>
    );
}

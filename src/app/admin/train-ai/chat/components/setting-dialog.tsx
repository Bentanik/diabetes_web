"use client";

import { Modal } from "@/components/shared/Modal";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
    Loader2,
    Hash,
    Target,
    FileSliders,
    RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import InputSettingAI from "@/components/input-ai-setting";
import { useUpdateSettingsService, useGetSettingService } from "@/services/train-ai/services";
import { useQueryClient } from "@tanstack/react-query"; // Thêm import này

interface SettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (settings: { numberOfPassages: number; searchAccuracy: number }) => void;
}

/**
 * Component hiển thị modal cấu hình chat AI
 */
export default function SettingModal({ isOpen, onClose, onSubmit }: SettingModalProps) {
    const [searchAccuracy, setSearchAccuracy] = useState([50]);
    const [numberOfPassages, setNumberOfPassages] = useState(5);
    const [systemPrompt, setSystemPrompt] = useState("");
    const [availableCollections, setAvailableCollections] = useState<string[]>([]);
    
    // Query client để invalidate queries
    const queryClient = useQueryClient();
    
    // Lấy settings hiện tại
    const { data: currentSettings, isLoading: isLoadingSettings, error: settingsError } = useGetSettingService();
    
    // Sử dụng mutation hook
    const updateSettingsMutation = useUpdateSettingsService();
    const isCreating = updateSettingsMutation.isPending;

    // Load giá trị ban đầu khi có data
    useEffect(() => {
        if (currentSettings && isOpen) {
            setNumberOfPassages(currentSettings.number_of_passages || 5);
            setSearchAccuracy([currentSettings.search_accuracy || 50]);
            
            // Auto generate system prompt based on current settings
            setSystemPrompt(`Cấu hình AI với ${currentSettings.number_of_passages || 5} câu/passage và độ chính xác ${currentSettings.search_accuracy || 50}%`);
        }
    }, [currentSettings, isOpen]);

    const handleClose = () => {
        // Reset về giá trị ban đầu từ API hoặc default
        if (currentSettings) {
            setNumberOfPassages(currentSettings.number_of_passages || 5);
            setSearchAccuracy([currentSettings.search_accuracy || 50]);
        } else {
            setSearchAccuracy([50]);
            setNumberOfPassages(5);
        }
        setSystemPrompt("");
        setAvailableCollections([]);
        onClose();
    };
    
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        const localSettings: REQUEST.TUpdateSettingsRequest = {
            number_of_passages: numberOfPassages,
            search_accuracy: searchAccuracy[0]
        };

        try {
            await updateSettingsMutation.mutateAsync(localSettings, {
                onSuccess: () => {
                    // Invalidate và refetch settings query
                    queryClient.invalidateQueries({ 
                        queryKey: ["settings"] 
                    });
                    
                    // Gọi callback local nếu có
                    onSubmit?.({
                        numberOfPassages: numberOfPassages,
                        searchAccuracy: searchAccuracy[0]
                    });
                    
                    // Đóng modal
                    handleClose();
                },
                onError: (error) => {
                    console.error("Lỗi khi cập nhật cấu hình:", error);
                    // Có thể thêm toast notification ở đây
                },
            });
        } catch (error) {
            console.error("Lỗi khi cập nhật cấu hình:", error);
        }
    };

    const handleReset = () => {
        if (currentSettings) {
            setNumberOfPassages(currentSettings.number_of_passages || 5);
            setSearchAccuracy([currentSettings.search_accuracy || 50]);
        }
    };

    // Kiểm tra xem có thay đổi so với settings hiện tại không
    const hasChanges = currentSettings && (
        numberOfPassages !== currentSettings.number_of_passages ||
        searchAccuracy[0] !== currentSettings.search_accuracy
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="max-w-2xl"
            closeOnBackdrop={!isCreating && !isLoadingSettings}
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
                                {isLoadingSettings ? "Đang tải cấu hình..." : "Cấu hình các tính năng cho chat AI"}
                            </motion.p>
                        </div>
                    </motion.div>
                    {/* Close button custom - disable khi loading */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={!isCreating && !isLoadingSettings ? { scale: 1.1 } : {}}
                        whileTap={!isCreating && !isLoadingSettings ? { scale: 0.9 } : {}}
                        onClick={!isCreating && !isLoadingSettings ? onClose : undefined}
                        disabled={isCreating || isLoadingSettings}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 z-20 ${
                            isCreating || isLoadingSettings
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
                    {/* Loading state */}
                    {isLoadingSettings && (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin text-[#248fca]" />
                                <span className="text-gray-600">Đang tải cấu hình hiện tại...</span>
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {settingsError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                            <p className="text-sm text-red-600">
                                Không thể tải cấu hình hiện tại. Sử dụng giá trị mặc định.
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    {!isLoadingSettings && (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* Current settings info */}
                            {currentSettings && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.8 }}
                                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-semibold text-green-800">Cấu hình hiện tại</h4>
                                            <p className="text-xs text-green-600 mt-1">
                                                Lấy {" "}
                                                {currentSettings.number_of_passages} câu, độ chính xác {currentSettings.search_accuracy}%
                                            </p>
                                        </div>
                                        {hasChanges && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleReset}
                                                disabled={isCreating}
                                                className="text-xs border-green-300 text-green-700 hover:bg-green-50"
                                            >
                                                <RefreshCw className="w-3 h-3 mr-1" />
                                                Reset
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* System Prompt - ẩn hoặc tự động generate */}
                            <input 
                                type="hidden" 
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                            />

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
                                        Lấy bao nhiêu câu khi tìm kiếm
                                    </Label>
                                    <span className="text-red-500 text-sm">*</span>
                                    {hasChanges && numberOfPassages !== currentSettings?.number_of_passages && (
                                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                            Đã thay đổi
                                        </span>
                                    )}
                                </div>
                                <InputSettingAI
                                    type="number"
                                    value={numberOfPassages.toString()}
                                    onChange={(e) => setNumberOfPassages(Number(e.target.value) || 1)}
                                    error=""
                                    placeholder="Ví dụ: 5"
                                    disabled={isCreating}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Số lượng câu sẽ được nhóm thành một passage (từ 1-50 câu). 
                                    Hiện tại: <strong>{numberOfPassages} câu</strong>
                                    {currentSettings && (
                                        <span className="ml-2 text-green-600">
                                            (Trước đó: {currentSettings.number_of_passages} câu)
                                        </span>
                                    )}
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
                                    {hasChanges && searchAccuracy[0] !== currentSettings?.search_accuracy && (
                                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                            Đã thay đổi
                                        </span>
                                    )}
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
                                        Mức độ chính xác khi tìm kiếm thông tin trong thư mục (10% - 100%). 
                                        Hiện tại: <strong>{searchAccuracy[0]}%</strong>
                                        {currentSettings && (
                                            <span className="ml-2 text-green-600">
                                                (Trước đó: {currentSettings.search_accuracy}%)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Available Collections - ẩn hoặc tự động */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 1.1 }}
                                className="space-y-3"
                            >
                                <div className="flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-[#248fca]" />
                                    <Label className="text-sm font-semibold text-gray-800">
                                        Thư mục áp dụng (tùy chọn)
                                    </Label>
                                </div>
                                <InputSettingAI
                                    type="text"
                                    value={availableCollections.join(", ")}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setAvailableCollections(
                                            e.target.value
                                                .split(",")
                                                .map((s) => s.trim())
                                                .filter(Boolean)
                                        )
                                    }
                                    error=""
                                    placeholder="Ví dụ: collection1, collection2"
                                    disabled={isCreating}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Danh sách thư mục sẽ áp dụng cấu hình này (để trống sẽ áp dụng mặc định)
                                </p>
                            </motion.div>

                            {/* Thông tin cấu hình */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 1.2 }}
                                className="bg-gradient-to-r from-[#248fca]/5 to-blue-50 p-5 rounded-xl border border-[#248fca]/20"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                            Thông tin cấu hình mới
                                        </Label>
                                        <ul className="space-y-2">
                                            <li className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                                                <span className="text-[#248fca] mt-0.5">•</span>
                                                Số câu/passage: <strong>{numberOfPassages}</strong>
                                            </li>
                                            <li className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                                                <span className="text-[#248fca] mt-0.5">•</span>
                                                Độ chính xác: <strong>{searchAccuracy[0]}%</strong>
                                            </li>
                                            <li className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                                                <span className="text-[#248fca] mt-0.5">•</span>
                                                Thư mục áp dụng: <strong>{availableCollections.length > 0 ? availableCollections.join(", ") : "Mặc định"}</strong>
                                            </li>
                                            {hasChanges && (
                                                <li className="text-xs text-orange-600 leading-relaxed flex items-start gap-2 mt-3 pt-2 border-t border-orange-200">
                                                    <span className="text-orange-500 mt-0.5">⚠</span>
                                                    Có thay đổi so với cấu hình hiện tại
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Error message nếu có */}
                            {updateSettingsMutation.isError && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-50 border border-red-200 rounded-lg"
                                >
                                    <p className="text-sm text-red-600">
                                        Có lỗi xảy ra khi cập nhật cấu hình. Vui lòng thử lại.
                                    </p>
                                </motion.div>
                            )}

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
                                    disabled={isCreating || numberOfPassages < 1 || numberOfPassages > 50 || !hasChanges}
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#248fca] to-[#1e7bb8] text-white hover:from-[#1e7bb8] hover:to-[#1565c0] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg cursor-pointer"
                                >
                                    {isCreating ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Đang lưu cấu hình...</span>
                                        </div>
                                    ) : !hasChanges ? (
                                        "Không có thay đổi"
                                    ) : (
                                        "Hoàn tất cấu hình"
                                    )}
                                </Button>
                            </motion.div>
                        </motion.form>
                    )}
                </div>
            </div>
        </Modal>
    );
}

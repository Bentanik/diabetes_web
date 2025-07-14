"use client"
import { Modal } from "@/components/shared/Modal"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import TextAreaComponent from "@/components/textarea"
import { Label } from "@/components/ui/label"
import { FilePlus } from "lucide-react"
import InputTrainAI from "@/components/input_train_ai"
import useCreateDocument from "@/app/admin/train-ai/[id]/upload/hooks/useCreateDocument"
import { CreateDocumentFormData } from "@/lib/validations/document.schema"

interface CreateDocumentModalProps {
    isOpen: boolean
    onClose: () => void
    uploadedFile: File | null
    handleUploadFile: (data: CreateDocumentFormData, file: File) => void
}

/**
 * Component hiển thị modal tạo tài liệu mới
 * Bao gồm tên, mô tả
 */
export default function CreateDocumentModal({ isOpen, onClose, uploadedFile, handleUploadFile }: CreateDocumentModalProps) {
    // Giả định useCreateKnowlegeBase cung cấp setValue và watch từ react-hook-form
    const { register, handleSubmit, errors, onSubmit, reset } = useCreateDocument()

    const handleClose = () => {
        reset()
        onClose()
    }

    if (!uploadedFile) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="max-w-xl"
            closeOnBackdrop={true}
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
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30"
                        >
                            <FilePlus className="w-7 h-7 text-white" /> {/* Đã đổi icon */}
                        </motion.div>
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl font-bold text-white"
                            >
                                Tạo tài liệu mới
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-white/90 text-sm mt-1"
                            >
                                Cấu hình thông tin và tham số cho tài liệu {uploadedFile?.name}

                            </motion.p>
                        </div>
                    </motion.div>
                    {/* Close button custom - disable khi loading */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
                        disabled={false}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 z-20 hover:bg-white/20 text-white/80 hover:text-white cursor-pointer`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </motion.button>
                </div>
                {/* Form content */}
                <div className="p-6 bg-white">
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        onSubmit={handleSubmit((data) => onSubmit(data, uploadedFile, handleClose, handleUploadFile))}
                        className="space-y-6"
                    >
                        {/* Input tên tài liệu */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-800">
                                    Tiêu đề tài liệu
                                </Label>
                                <span className="text-red-500 text-sm">*</span>
                            </div>
                            <InputTrainAI
                                type="text"
                                register={register("name")}
                                error={errors.name?.message}
                                placeholder="Nhập tiêu tài liệu..." // Đã sửa placeholder
                                disabled={false}
                            />
                        </motion.div>
                        {/* Mô tả */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-2">
                                <Label htmlFor="description" className="text-sm font-semibold text-gray-800">
                                    Mô tả
                                </Label>
                                <span className="text-red-500 text-sm">*</span>
                            </div>
                            <TextAreaComponent
                                title=""
                                register={register("description")}
                                error={errors.description?.message}
                                className="resize-none! border-gray-200 focus-visible:border-[#248fca] focus:ring-[#248fca]/20 min-h-[120px] transition-all duration-200"
                                placeholder="Nhập mô tả cho tài liệu..." // Đã sửa placeholder
                                disabled={false}
                            />
                        </motion.div>
                        {/* Checkbox với performance tối ưu */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.9 }}
                            className="bg-gradient-to-r from-[#248fca]/5 to-blue-50 p-5 rounded-xl border border-[#248fca]/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="useDescriptionForLLMCheck"
                                        className={`text-sm font-semibold text-gray-800 flex items-center gap-2 cursor-pointer`}
                                    >
                                        Chú ý
                                    </Label>
                                    <ul className="space-y-2">
                                        <li className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                                            <span className="text-[#248fca] mt-0.5">•</span>
                                            Tên tài liệu không được trùng với các tài liệu khác trong thư mục. {/* Đã sửa văn bản */}
                                        </li>
                                        <li className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                                            <span className="text-[#248fca] mt-0.5">•</span>
                                            Đặt tên tài liệu và mô tả rõ ràng, phù hợp với mục đích sử dụng. {/* Đã sửa văn bản */}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                        {/* Buttons hành động với animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.0 }}
                            className="flex justify-end gap-3 pt-6 border-t border-gray-100"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={false}
                                className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                className="px-6 py-2.5 bg-gradient-to-r from-[#248fca] to-[#1e7bb8] text-white hover:from-[#1e7bb8] hover:to-[#1565c0] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                            >
                                Tạo tài liệu
                            </Button>
                        </motion.div>
                    </motion.form>
                </div>
            </div>
        </Modal>
    )
}

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircleIcon, Loader2Icon, XIcon, AlertCircleIcon } from "lucide-react"

interface FolderCreateProgressProps {
    isOpen: boolean
    onClose: () => void
    folderName: string
    progress: number
    status: "uploading" | "completed" | "error"
    error?: string
}

export default function FolderCreateProgress({
    isOpen,
    onClose,
    folderName,
    progress,
    status,
    error,
}: FolderCreateProgressProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed inset-0 bg-white/20 backdrop-blur-sm"
                        style={{
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                        }}
                    />

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4 z-10 shadow-2xl border border-gray-100"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={status === "completed" ? { scale: [1, 1.1, 1] } : {}}
                                    className={`p-3 rounded-lg ${status === "completed" ? "bg-blue-100" : status === "error" ? "bg-red-100" : "bg-blue-100"
                                        }`}
                                >
                                    {status === "completed" ? (
                                        <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                                    ) : status === "error" ? (
                                        <AlertCircleIcon className="w-6 h-6 text-red-600" />
                                    ) : (
                                        <Loader2Icon className="w-6 h-6 text-blue-600 animate-spin" />
                                    )}
                                </motion.div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {status === "completed"
                                            ? "Tạo thư mục thành công!"
                                            : status === "error"
                                                ? "Tạo thư mục thất bại"
                                                : "Đang tạo thư mục..."}
                                    </h2>
                                    <p className="text-sm text-gray-600">{folderName}</p>
                                </div>
                            </div>
                            {(status === "completed" || status === "error") && (
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                                >
                                    <XIcon className="w-5 h-5" />
                                </motion.button>
                            )}
                        </div>

                        {/* Progress Section */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-700">
                                    {status === "uploading" ? "Đang tải lên server..." : status === "completed" ? "Hoàn thành" : "Lỗi"}
                                </span>
                                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                <motion.div
                                    className={`h-3 rounded-full transition-colors ${status === "completed" ? "bg-blue-500" : status === "error" ? "bg-red-500" : "bg-blue-500"
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                />
                            </div>

                            {/* Status Message */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-sm p-3 rounded-lg ${status === "completed"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : status === "error"
                                        ? "bg-red-50 text-red-700 border border-red-200"
                                        : "bg-blue-50 text-blue-700 border border-blue-200"
                                    }`}
                            >
                                {status === "uploading" && (
                                    <div className="flex items-center gap-2">
                                        <Loader2Icon className="w-4 h-4 animate-spin" />
                                        <span>Đang tải thư mục &quot;{folderName}&quot; lên server...</span>
                                    </div>
                                )}
                                {status === "completed" && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        <span>Thư mục &quot;{folderName}&quot; đã được tạo thành công!</span>
                                    </div>
                                )}
                                {status === "error" && (
                                    <div className="flex items-center gap-2">
                                        <AlertCircleIcon className="w-4 h-4" />
                                        <span>{error || "Có lỗi xảy ra khi tạo thư mục. Vui lòng thử lại."}</span>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-end gap-3"
                        >
                            {status === "completed" ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Hoàn thành
                                </motion.button>
                            ) : status === "error" ? (
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onClose}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                                    >
                                        Đóng
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                    >
                                        Thử lại
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Loader2Icon className="w-4 h-4 animate-spin" />
                                    Đang xử lý...
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

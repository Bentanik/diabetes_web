"use client"

import { Modal } from "@/components/shared/Modal"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, AlertTriangle, FileText } from "lucide-react"
import useDeleteKnowlegeBase from "@/app/admin/train-ai/hooks/useDeleteKnowlegeBase"

interface DeleteKnowledgeModalProps {
    isOpen: boolean
    onClose: () => void
    folder?: {
        name: string
        description: string
        document_count: number
    }
}

/**
 * Component hiển thị modal xóa thư mục kiến thức
 * Hiển thị thông tin thư mục và số lượng tài liệu sẽ bị xóa
 */
export default function DeleteKnowledgeModal({ isOpen, onClose, folder }: DeleteKnowledgeModalProps) {
    const { onSubmit, isDeleting } = useDeleteKnowlegeBase()

    const handleDelete = () => {
        if (!folder) return
        onSubmit(folder.name, onClose)
    }

    const handleClose = () => {
        if (!isDeleting) {
            onClose()
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="max-w-md"
            closeOnBackdrop={!isDeleting} // Disable close on backdrop khi đang loading
        >
            <div className="relative">
                {/* Header với gradient background đỏ */}
                <div className="relative bg-gradient-to-r from-red-500 to-red-600 p-6">
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
                            <Trash2 className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl font-bold text-white"
                            >
                                Xóa thư mục
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-white/90 text-sm mt-1"
                            >
                                Hành động này không thể hoàn tác
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Close button custom - disable khi loading */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={!isDeleting ? { scale: 1.1 } : {}}
                        whileTap={!isDeleting ? { scale: 0.9 } : {}}
                        onClick={!isDeleting ? handleClose : undefined}
                        disabled={isDeleting}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 z-20 ${isDeleting
                            ? "text-white/40 cursor-not-allowed"
                            : "hover:bg-white/20 text-white/80 hover:text-white cursor-pointer"
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </motion.button>
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Warning message */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 }}
                            className="bg-red-50 border border-red-200 rounded-lg p-4"
                        >
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-red-800 text-sm">Cảnh báo</h3>
                                    <p className="text-red-700 text-sm mt-1">
                                        Bạn có chắc chắn muốn xóa thư mục này? Tất cả dữ liệu sẽ bị mất vĩnh viễn.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Folder info */}
                        {folder && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="bg-gray-50 rounded-lg p-4 space-y-3"
                            >
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Tên thư mục:</h4>
                                    <p className="text-gray-700 font-medium">{folder.name}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Mô tả:</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">{folder.description || "Không có mô tả"}</p>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                                    <FileText className="w-4 h-4 text-red-500" />
                                    <span className="text-sm font-semibold text-red-600">{folder.document_count} tài liệu sẽ bị xóa</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Action buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.9 }}
                            className="flex justify-end gap-3 pt-4 border-t border-gray-100"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isDeleting}
                                className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Không
                            </Button>

                            <Button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                            >
                                {isDeleting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Đang xóa...</span>
                                    </div>
                                ) : (
                                    "Có, xóa ngay"
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </Modal>
    )
}

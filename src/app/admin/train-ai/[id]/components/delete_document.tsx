"use client"

import { Modal } from "@/components/shared/Modal"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, AlertTriangle, FileText } from "lucide-react"
import { getFileIcon } from "@/utils/file"
import { useDeleteDocument } from "@/hooks/use-delete-document"

interface DeleteDocumentModalProps {
    isOpen: boolean
    onClose: () => void
    document: API.TKnowledgeDocument
}

export default function DeleteDocumentModal({ isOpen, onClose, document }: DeleteDocumentModalProps) {
    const { handleDeleteDocument, isPending } = useDeleteDocument()

    const handleDelete = () => {
        if (!document) return
        handleDeleteDocument(document.id || "", onClose)
    }

    const handleClose = () => {
        if (!isPending) {
            onClose()
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="max-w-lg"
            closeOnBackdrop={!isPending}
        >
            <div className="relative overflow-hidden bg-white rounded-xl">
                {/* Header với gradient background */}
                <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 px-6 py-7">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 flex items-center gap-x-4"
                    >
                        {/* Icon container */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                            }}
                            className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg"
                        >
                            <Trash2 className="w-7 h-7 text-white" />
                        </motion.div>

                        {/* Title */}
                        <div className="flex flex-col items-start justify-center">
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className="text-xl font-semibold text-white"
                            >
                                Xóa tài liệu
                            </motion.h2>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                                className="text-white/90 text-sm mt-1"
                            >
                                Hành động này không thể hoàn tác
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Close button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        whileHover={!isPending ? { scale: 1.1 } : {}}
                        whileTap={!isPending ? { scale: 0.9 } : {}}
                        onClick={!isPending ? handleClose : undefined}
                        disabled={isPending}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 z-20 ${isPending
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
                <div className="px-6 py-6 space-y-5">
                    {/* Warning message */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="relative bg-red-50 border border-red-200 rounded-lg p-4 overflow-hidden"
                    >
                        <div className="relative flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-800 text-sm mb-1">
                                    Cảnh báo
                                </h3>
                                <p className="text-red-700 text-sm leading-relaxed">
                                    Bạn có chắc chắn muốn xóa tài liệu này? Dữ liệu sẽ bị mất vĩnh viễn.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Document info */}
                    {document && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                            <h4 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-600" />
                                Thông tin tài liệu
                            </h4>

                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100">
                                {/* File icon */}
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                    {getFileIcon(document.file_type)}
                                </div>

                                {/* File info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate text-base">
                                        {document.file_name}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-gray-500 uppercase font-medium bg-gray-100 px-2 py-1 rounded">
                                            {document.file_type}
                                        </span>
                                        {document.file_size && (
                                            <span className="text-sm text-gray-500">
                                                {(document.file_size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                        className="flex items-center justify-end gap-3"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isPending}
                            className="px-5 py-2.5 h-auto text-sm border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy bỏ
                        </Button>

                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="px-5 py-2.5 h-auto text-sm bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang xóa...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    <span>Xóa tài liệu</span>
                                </div>
                            )}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </Modal>
    )
}

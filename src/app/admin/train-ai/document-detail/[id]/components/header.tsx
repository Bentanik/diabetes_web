"use client"
import { motion } from "framer-motion"
import { ArrowLeftIcon, FileText, Calendar, Clock } from "lucide-react"
import Link from "next/link"

interface DocumentData {
    title: string;
    description: string;
    uploadDate: string;
    lastModified: string;
    category: string;
    status: string;
    confidentiality: string;
    fileSize: string;
    pages: number;
    version: string;
}

interface HeaderProps {
    documentData?: DocumentData;
    documentId?: string;
}

export default function Header({
    documentData,
    documentId,
}: HeaderProps) {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
            style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                    <Link href={`/admin/train-ai`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors mt-1"
                        >
                            <ArrowLeftIcon className="w-4 h-4 text-gray-700" />
                        </motion.button>
                    </Link>

                    <div className="h-8 w-px bg-gray-300 mt-1"></div>

                    <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-[#248fca]/10 rounded-lg mt-1">
                            <FileText className="w-5 h-5 text-[#248fca]" />
                        </div>
                        <div className="flex-1">
                            {documentData ? (
                                <>
                                    <h1 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
                                        {documentData.title}
                                    </h1>
                                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                        {documentData.description}
                                    </p>

                                    {/* Document Metadata */}
                                    <div className="flex items-center gap-6 text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>Tải lên: {documentData.uploadDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            <span>Cập nhật: {documentData.lastModified}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-3 h-3" />
                                            <span>{documentData.fileSize} • {documentData.pages} trang</span>
                                        </div>
                                        {documentId && (
                                            <div className="flex items-center gap-2">
                                                <span>ID: {documentId}</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-lg font-semibold text-[#248fca] mb-1">Chi tiết tài liệu</h1>
                                    <p className="text-sm text-gray-600">Xem và quản lý chi tiết tài liệu</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                    {/* Status Badge */}
                    {documentData && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${documentData.status === 'Đã phê duyệt'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            }`}>
                            {documentData.status}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

"use client";
import { formatFileSize } from "@/utils/file";
import { motion } from "framer-motion";
import {
    ArrowLeftIcon,
    FileText,
    Calendar,
    Clock,
    ArchiveIcon,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
    documentData: API.TDocument;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export default function Header({ documentData }: HeaderProps) {
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
                            {/* {getFileIcon(
                                documentData?.file.file_type || "file"
                            )} */}
                            File
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
                                            <span>
                                                Tải lên:{" "}
                                                {formatDate(
                                                    documentData.updated_at
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                Cập nhật:{" "}
                                                {formatDate(
                                                    documentData.created_at
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-3 h-3" />
                                            <span>
                                                {formatFileSize(
                                                    documentData.file.size_bytes
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <ArchiveIcon className="w-3 h-3" />
                                            <span>
                                                {/* {documentData.file?.file_type?.toUpperCase() ||
                                                    "FILE"} */}
                                                File
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-lg font-semibold text-[#248fca] mb-1">
                                        Chi tiết tài liệu
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Xem và quản lý chi tiết tài liệu
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                    {/* Status Badge */}
                    {documentData && (
                        <span
                            // className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            //     documentData.type === "upload_document"
                            //         ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            //         : "bg-green-100 text-green-700 border-green-200"
                            // }`}
                            className={`px-3 py-1 rounded-full text-xs font-medium border`}
                        >
                            {/* {documentData.type === "upload_document"
                                ? "Chưa được huấn luyện"
                                : "Đã huấn luyện"} */}
                            Đã Huấn luyện
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

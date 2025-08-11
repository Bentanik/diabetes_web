"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    MoreHorizontal,
    Trash2Icon,
    EyeIcon,
    DownloadIcon,
    CalendarIcon,
    ArchiveIcon,
    TrainIcon,
    FileIcon,
} from "lucide-react";

import { formatFileSize, getFileIcon } from "@/utils/file";
import { useTrainDocumentService } from "@/services/train-ai/services";
import { useNotification } from "@/context/notification_context";
import { downloadDocumentAsync } from "@/services/train-ai/api-services";

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

interface DocumentCardProps {
    document: API.TDocument;
    onDelete?: (document: API.TDocument) => void;
    onTrainSuccess?: () => void;
}

export default function DocumentCard({
    document,
    onDelete = () => { },
    onTrainSuccess = () => { }
}: DocumentCardProps) {
    const isUploadDoc = document.type === "upload_document";
    const { mutate: trainDocument, isPending: isTraining } = useTrainDocumentService();
    const { addNotification } = useNotification();

    const handleTrainDocument = () => {
        trainDocument(
            { document_id: document.id },
            {
                onSuccess: () => {
                    addNotification({
                        title: "Thành công",
                        message: "Đã bắt đầu huấn luyện tài liệu",
                        type: "success",
                        duration: 4000,
                        position: "top-right",
                    });
                    onTrainSuccess();
                },
                onError: (error) => {
                    addNotification({
                        title: error.title || "Lỗi huấn luyện",
                        message: error.detail || "Đã xảy ra lỗi khi huấn luyện tài liệu",
                        type: "error",
                        duration: 4000,
                        position: "top-right",
                    });
                },
            }
        );
    };

    const handleDownloadDocument = async (document: API.TDocument) => {
        await downloadDocumentAsync(document.id)
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white py-5 px-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 w-[360px] h-[280px]">
            {/* Header với file type và actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <ArchiveIcon className="w-3 h-3" />
                    <span>{document.file?.file_type?.toUpperCase() || 'FILE'}</span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="text-sm py-2">
                            <EyeIcon className="w-4 h-4 mr-2" />
                            Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-sm py-2"
                            onClick={() => handleDownloadDocument(document)}
                        >
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Tải xuống
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-sm py-2 text-red-600"
                            onClick={() => onDelete(document)}
                        >
                            <Trash2Icon className="w-4 h-4 mr-2" />
                            Xóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-3">
                {/* Title với icon */}
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                        {getFileIcon(document.file?.file_type || 'file')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
                            {document.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FileIcon className="w-3 h-3" />
                            <span>{formatFileSize(document.file?.size_bytes || 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {document.description && (
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {document.description}
                    </p>
                )}

                {/* Độ liên quan tiểu đường */}
                {document.priority_diabetes !== undefined && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Độ liên quan:</span>
                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${document.priority_diabetes >= 0.7 ? 'bg-green-500' :
                                document.priority_diabetes >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                            <span className="text-xs font-medium text-gray-700">
                                {Math.round(document.priority_diabetes * 100)}%
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex flex-col items-start gap-y-4 w-full">
                {isUploadDoc && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        onClick={handleTrainDocument}
                        disabled={isTraining}
                    >
                        <TrainIcon className="w-3 h-3 mr-1" />
                        {isTraining ? "Đang xử lý..." : "Huấn luyện"}
                    </Button>
                )}
                <div className="flex items-center justify-between w-full">
                    {/* Trái: Status + Train button */}

                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className={`${isUploadDoc
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : "bg-green-50 text-green-700 border-green-200"
                                } text-xs font-medium`}
                        >
                            {isUploadDoc ? "Chưa huấn luyện" : "Đã huấn luyện"}
                        </Badge>
                    </div>

                    {/* Phải: Date */}
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{formatDate(document.created_at).split(" ")[1]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
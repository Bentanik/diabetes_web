"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Clock,
    CheckCircle,
    AlertCircle,
    MoreHorizontal,
    HistoryIcon,
    Trash2Icon,
    EyeIcon,
    DownloadIcon,
    Activity,
    CalendarIcon,
    ArchiveIcon,
    TrainIcon,
    FileIcon,
    AlertCircleIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useGetJobDocumentHistoryService } from "@/services/job/services";
import { formatFileSize, getFileIcon } from "@/utils/file";
import { downloadDocumentAsync } from "@/services/train-ai/api-services";
import DeleteDocumentModal from "@/app/admin/train-ai/[id]/upload/components/delete_document";
import { Progress } from "@/components/ui/progress";

const SmartDescription = ({ description }: { description: string }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (textRef.current) {
                const element = textRef.current;
                setIsOverflowing(element.scrollHeight > element.clientHeight);
            }
        };

        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [description]);

    const DescriptionText = (
        <p
            ref={textRef}
            className="text-sm text-gray-600 line-clamp-2 leading-relaxed"
        >
            {description}
        </p>
    );

    if (!isOverflowing) {
        return DescriptionText;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="cursor-help">{DescriptionText}</div>
                </TooltipTrigger>
                <TooltipContent className="max-w-md p-3" side="top">
                    <p className="text-sm leading-relaxed">{description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const getTopicRelevanceBadge = (
    score: number | null | undefined,
    topic: string | null | undefined
) => {
    if (score === null || score === undefined || !topic) {
        return (
            <Badge
                variant="outline"
                className="bg-gray-50 text-gray-600 border-gray-200 text-xs"
            >
                <Activity className="w-3 h-3 mr-1" />
                Liên quan: N/A
            </Badge>
        );
    }
    const percentage = Math.round(score * 100);
    let relevanceLevel = "";
    let badgeClass = "";

    if (score >= 0.7) {
        relevanceLevel = "Cao";
        badgeClass = "bg-green-50 text-green-700 border-green-200";
    } else if (score >= 0.4) {
        relevanceLevel = "Trung bình";
        badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    } else {
        relevanceLevel = "Thấp";
        badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
    }

    return (
        <Badge
            variant="outline"
            className={`${badgeClass} text-xs font-medium`}
        >
            <Activity className="w-3 h-3 mr-1" />
            {`Liên quan: ${topic} (${percentage}% ${relevanceLevel})`}
        </Badge>
    );
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case "completed":
            return (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Hoàn thành
                </Badge>
            );
        case "processing":
            return (
                <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                >
                    <Clock className="w-3 h-3 mr-1" />
                    Đang xử lý
                </Badge>
            );
        case "queued":
            return (
                <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                >
                    <Clock className="w-3 h-3 mr-1" />
                    Đang chờ
                </Badge>
            );
        case "failed":
            return (
                <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Thất bại
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-700 border-gray-200"
                >
                    {status}
                </Badge>
            );
    }
};

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

interface HistoryDocumentItemProps {
    document: API.TJob;
    onDelete: (document: API.TJob) => void;
    onDownload: (document: API.TJob) => void;
}

const HistoryDocumentItem = ({ document, onDelete, onDownload }: HistoryDocumentItemProps) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50/50 hover:border-gray-300 transition-colors">
            <div className="flex gap-4">
                {/* Icon file */}
                <div className="flex-shrink-0 flex items-start mt-1">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                        {getFileIcon(document.file.file_type)}
                    </div>
                </div>

                {/* Nội dung chính */}
                <div className="flex-1 min-w-0 flex flex-col space-y-2">
                    <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-base mb-1 truncate">{document.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <FileIcon className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{document.file.file_name}</span>
                                <span>•</span>
                                <span>{formatFileSize(document.file.file_size_bytes)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex gap-1">
                                {document.is_document_delete && (
                                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                                        Đã xóa
                                    </Badge>
                                )}
                                {document.is_document_duplicate && (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 text-xs">
                                        Đã tồn tại
                                    </Badge>
                                )}

                                {document.status.status === "failed" && (
                                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                                        Thất bại
                                    </Badge>
                                )}
                            </div>
                            {document.status.status === "completed" && !document.is_document_delete && !document.is_document_duplicate && (
                                <div className="flex gap-2 mt-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2.5 text-xs text-[#0d90db] border-[#0d90db]/30 hover:bg-[#0d90db]/5 hover:text-[#0d90db]"
                                    >
                                        <TrainIcon className="w-3 h-3 mr-1" />
                                        Huấn luyện
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2.5 text-xs text-red-600 border-red-300 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => onDelete(document)}
                                    >
                                        <Trash2Icon className="w-3 h-3 mr-1" />
                                        Xóa
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="outline-none">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 w-7 p-0 text-gray-500 border-gray-300 hover:bg-gray-50"
                                            >
                                                <MoreHorizontal className="w-3 h-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem className="text-sm py-2">
                                                <EyeIcon className="w-4 h-4 mr-2" />
                                                Xem chi tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-sm py-2"
                                                onClick={() => onDownload(document)}
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-2" />
                                                Tải xuống
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mô tả nếu có */}
                    {document.description && document.status.status !== "failed" && (
                        <div>
                            <SmartDescription description={document.description} />
                        </div>
                    )}

                    {/* Nếu có lỗi */}
                    {document.status.status === "failed" && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-700 flex items-center gap-2">
                            <AlertCircleIcon className="w-4 h-4" />
                            <span>{document.status.progress_message}</span>
                            {document.status.progress !== undefined && (
                                <span className="ml-auto text-xs font-medium">
                                    Tiến trình lỗi: {document.status.progress}%
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        {document.status.status === "completed" && getStatusBadge(document.status.status)}
                        {document.status.status === "completed" &&
                            !document.is_document_delete &&
                            getTopicRelevanceBadge(document.priority_diabetes, "Đái tháo đường")}
                        {(document.status.status === "processing" || document.status.status === "queued") && (
                            <div className="flex flex-col w-full max-w-xs gap-1">
                                <div className="flex items-center gap-2">
                                    <Progress
                                        value={document.status.progress}
                                        className="h-2 rounded-full flex-1 bg-[#e7f3fa] [&_[data-slot=progress-indicator]]:bg-[#248fca]"
                                    />
                                    {typeof document.status.progress === "number" && (
                                        <span className="text-xs text-gray-500 font-medium min-w-[32px] text-right">
                                            {document.status.progress}%
                                        </span>
                                    )}
                                </div>
                                {document.status.progress_message && (
                                    <span className="text-xs text-[#248fca] font-medium">
                                        {document.status.progress_message}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Thông tin phụ */}
                    <div className="flex gap-4 text-xs text-gray-500 pt-1">
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{formatDate(document.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ArchiveIcon className="w-3 h-3" />
                            <span>{document.file.file_type.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function HistoryUploadFileDisplay() {
    const { data: jobs, isPending, isError } = useGetJobDocumentHistoryService({
        page: 1,
        limit: 3,
        sort_by: "created_at",
        sort_order: "desc",
        search: "",
    });
    const [isDeleteDocumentOpen, setIsDeleteDocumentOpen] = useState(false);
    const [document, setDocument] = useState<API.TJob | null>(null);

    const handleDeleteDocument = (document: API.TJob) => {
        setIsDeleteDocumentOpen(true);
        setDocument(document);
    };

    const handleCloseDeleteDocument = () => {
        setIsDeleteDocumentOpen(false);
        setDocument(null);
    };

    const handleDownloadDocument = async (document: API.TJob) => {
        await downloadDocumentAsync(document.id || "");
    };

    return (
        <Card className="overflow-hidden border border-gray-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.06)] bg-white">
            <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#248fca]/10 text-[#248fca] flex items-center justify-center">
                            <HistoryIcon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-900 font-semibold">Lịch sử tải tài liệu</span>
                            <span className="text-sm text-gray-500">Theo dõi các tài liệu đã tải lên gần đây</span>
                        </div>
                    </div>
                    <Link
                        href={`#`}
                        className="text-sm text-[#248fca] hover:text-[#1f7fb2] transition-colors"
                    >
                        Xem tất cả
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col">
                {isPending ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center space-y-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                                <Clock className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center space-y-3">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 mb-1">Lỗi tải dữ liệu</p>
                                <p className="text-xs text-gray-500">Vui lòng thử lại sau</p>
                            </div>
                        </div>
                    </div>
                ) : jobs && jobs.items.length > 0 ? (
                    <div className="p-4">
                        <div className="space-y-3">
                            {jobs.items.map((document_job: API.TJob, index: number) => (
                                <HistoryDocumentItem
                                    key={document_job.id || index}
                                    document={document_job}
                                    onDelete={handleDeleteDocument}
                                    onDownload={handleDownloadDocument}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto">
                                <HistoryIcon className="w-8 h-8 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 mb-1">Chưa có lịch sử tải nào</p>
                                <p className="text-xs text-gray-500">Lịch sử tải sẽ hiển thị ở đây</p>
                            </div>
                        </div>

                    </div>
                )}
            </CardContent>
            {document && (
                <DeleteDocumentModal
                    isOpen={isDeleteDocumentOpen}
                    onClose={handleCloseDeleteDocument}
                    document={document}
                />
            )}
        </Card>
    );
}

export { HistoryDocumentItem };

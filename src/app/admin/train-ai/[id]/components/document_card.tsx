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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    MoreHorizontal,
    Trash2Icon,
    EyeIcon,
    DownloadIcon,
    Activity,
    CalendarIcon,
    ArchiveIcon,
    TrainIcon,
    FileIcon,
    BotMessageSquareIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { formatFileSize, getFileIcon } from "@/utils/file";

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
    document: API.TDocument;
    onDelete: (document: API.TDocument) => void;
    onDownload: (document: API.TDocument) => void;
}

const HistoryDocumentItem = ({ document, onDelete, onDownload }: HistoryDocumentItemProps) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50/50 hover:border-gray-300 transition-colors">
            <div className="flex gap-4">
                {/* Icon file */}
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                        {getFileIcon(document.file.file_type)}
                    </div>
                </div>

                {/* Nội dung chính */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-base mb-1 truncate">
                                {document.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <FileIcon className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{document.file.hash}</span>
                                <span>•</span>
                                <span>{formatFileSize(document.file.size_bytes)}</span>
                            </div>
                        </div>

                        {/* Action buttons - Moved to right side */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {document.type === "upload_document" && <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-xs text-[#0c96e6] border-[#0c96e6]/5 hover:bg-[#0c96e6]/5 hover:text-[#0c96e6]"
                            >
                                <TrainIcon className="w-3 h-3 mr-1" />
                                Huấn luyện
                            </Button>}
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-xs text-red-600 border-red-300 hover:bg-red-50 hover:text-red-600"
                                onClick={() => onDelete(document)}
                            >
                                <Trash2Icon className="w-3 h-3 mr-1" />
                                Xóa
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-gray-500 border-gray-300 hover:bg-gray-50"
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
                    </div>

                    {/* Description */}
                    {document.description && document.type !== "upload_document" && (
                        <div className="mb-2">
                            <SmartDescription description={document.description} />
                        </div>
                    )}

                    {/* Topic relevance badge */}
                    {document.type === "upload_document" && (
                        <div className="mb-2">
                            {getTopicRelevanceBadge(document.priority_diabetes, "Đái tháo đường")}
                        </div>
                    )}

                    {/* Footer info */}
                    <div className="flex gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{formatDate(document.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ArchiveIcon className="w-3 h-3" />
                            <span>{document.file.file_type.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Badge
                                variant="outline"
                                className={`${document.type === "upload_document" ? "bg-blue-50 text-pink-600 border-pink-200" : "bg-green-50 text-blue-700 border-blue-200"} text-xs font-medium`}
                            >
                                <BotMessageSquareIcon className="w-4 h-4 mr-1" />
                                {document.type === "upload_document" ? "Tài liệu chưa huấn luyện" : "Tài liệu đã huấn luyện"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface DocumentCardProps {
    document: API.TDocument;
}

export default function DocumentCard({ document }: DocumentCardProps) {

    return (
        <div>
            <HistoryDocumentItem document={document} onDelete={() => { }} onDownload={() => { }} />
        </div>
    )
}
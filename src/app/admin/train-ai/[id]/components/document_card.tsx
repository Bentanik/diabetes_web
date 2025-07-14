"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CheckCircleIcon,
    XCircleIcon,
    MoreVerticalIcon,
    DownloadIcon,
    EyeIcon,
    TrashIcon,
    EditIcon,
    FileIcon,
    ClockIcon,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { getFileIcon } from "@/utils/file" // Giả định đã có
// import { formatFileSize } from "@/utils/file" // Giả định đã có
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { downloadDocumentAsync } from "@/services/train-ai/api-services"
import { getFileIcon } from "@/utils/file"


// Mock cho formatFileSize nếu bạn chưa có
const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB"
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`
}

type DocumentCardProps = {
    document: API.TKnowledgeBaseDocument
}

const StatusBadge = ({ status }: { status: string }) => {
    let badgeClass = ""
    let icon = null
    let text = ""

    switch (status) {
        case "completed":
            badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200"
            icon = <CheckCircleIcon className="w-3 h-3 mr-1" />
            text = "Hoàn thành"
            break
        case "processing":
        case "queued":
            badgeClass = "bg-blue-50 text-blue-700 border-blue-200"
            icon = <ClockIcon className="w-3 h-3 mr-1" />
            text = "Đang xử lý"
            break
        case "failed":
            badgeClass = "bg-red-50 text-red-700 border-red-200"
            icon = <XCircleIcon className="w-3 h-3 mr-1" />
            text = "Thất bại"
            break
        default:
            badgeClass = "bg-gray-50 text-gray-700 border-gray-200"
            icon = <FileIcon className="w-3 h-3 mr-1" />
            text = status
    }

    return (
        <Badge variant="outline" className={`${badgeClass} text-xs font-medium`}>
            {icon}
            {text}
        </Badge>
    )
}

export default function DocumentCard({ document }: DocumentCardProps) {
    const handleView = () => {
        console.log("View document:", document.id)
    }
    const handleEdit = () => {
        console.log("Edit document:", document.id)
    }
    const handleDownload = async () => {
        // Giả định downloadDocumentAsync nhận document.id
        await downloadDocumentAsync(document.id)
    }
    const handleDelete = () => {
        console.log("Delete document:", document.id)
    }

    return (
        <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#248fca]/30">
            <div className="p-5 flex flex-col gap-y-4">
                {/* Header với icon và actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* File Icon */}
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#248fca]/10 to-[#248fca]/5 rounded-xl border border-[#248fca]/10 flex items-center justify-center">
                            {getFileIcon(document.file_type)}
                        </div>
                        {/* Status Badge - Đặt ngay cạnh icon */}
                        <StatusBadge status={document.status} />
                    </div>
                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-gray-100"
                            >
                                <MoreVerticalIcon className="w-4 h-4 text-gray-600" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={handleView}>
                                <EyeIcon className="w-4 h-4 mr-2" />
                                Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEdit}>
                                <EditIcon className="w-4 h-4 mr-2" />
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownload}>
                                <DownloadIcon className="w-4 h-4 mr-2" />
                                Tải xuống
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Title và File name */}
                <div className="flex flex-col gap-y-1">
                    <h3 className="font-semibold text-gray-900 text-base line-clamp-2 leading-snug">
                        {document.title || document.file_name}
                    </h3>
                    {document.title && document.title !== document.file_name && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FileIcon className="w-3 h-3" />
                            <span className="truncate">{document.file_name}</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {document.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{document.description}</p>
                )}

                {/* Metadata Grid */}
                <div className="space-y-3">
                    {/* File Size & Diabetes Score */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 mb-1">Kích thước</div>
                            <div className="font-semibold text-sm text-gray-900">{formatFileSize(document.file_size)}</div>
                        </div>
                        {document.metadata?.diabetes_score_avg && (
                            <div className="bg-[#248fca]/5 rounded-lg p-3">
                                <div className="text-xs text-gray-500 mb-1">Độ trùng khớp</div>
                                <div className="font-semibold text-sm text-[#248fca]">
                                    {(document.metadata.diabetes_score_avg * 100).toFixed(1)}%
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Updated Time */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <ClockIcon className="w-3 h-3" />
                        <span>
                            Cập nhật{" "}
                            {formatDistanceToNow(new Date(document.updated_at), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

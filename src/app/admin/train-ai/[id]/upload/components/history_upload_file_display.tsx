"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu" // Added DropdownMenu components
import { Clock, CheckCircle, AlertCircle, PlusCircle, MoreHorizontal, HistoryIcon, Trash2Icon, EyeIcon, DownloadIcon } from "lucide-react" // Added MoreHorizontal
import { useGetJobsService } from "@/services/job/services"
import { getFileIcon } from "@/utils/file"
import Link from "next/link"


const getStatusBadge = (status: string) => {
    switch (status) {
        case "completed":
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Hoàn thành
                </Badge>
            )
        case "processing":
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Đang xử lý
                </Badge>
            )
        case "queued":
            return (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Đang chờ
                </Badge>
            )
        case "failed":
            return (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Thất bại
                </Badge>
            )
        default:
            return (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {status}
                </Badge>
            )
    }
}

const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB"
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}

interface HistoryUploadFileDisplayProps {
    kb_name: string
}

export default function HistoryUploadFileDisplay({ kb_name }: HistoryUploadFileDisplayProps) {
    const { jobs, isPending, isJobError } = useGetJobsService({
        page: 1,
        limit: 3,
        sort_by: "created_at",
        sort_order: "desc",
        kb_name: kb_name,
    })

    return (
        <Card className="overflow-hidden border-2 border-gray-200 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg text-[#248fca] flex items-center gap-2">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <HistoryIcon className="w-5 h-5" />
                            <span className="text-lg font-medium">Lịch sử tải tài liệu</span>
                        </div>
                        {/* "Xem tất cả" link can be re-added here if this is a summary card leading to a full history page */}
                        <Link href={`#`} className="text-sm text-[#248fca] hover:text-[#248fca]/80">
                            Xem tất cả
                        </Link>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col">
                {isPending ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto">
                                <Clock className="w-8 h-8 text-gray-400 animate-spin" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium text-gray-900">Đang tải dữ liệu...</h3>
                            </div>
                        </div>
                    </div>
                ) : isJobError ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center mx-auto">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium text-gray-900">Lỗi tải dữ liệu</h3>
                                <p className="text-sm text-gray-500">Vui lòng thử lại sau.</p>
                            </div>
                        </div>
                    </div>
                ) : jobs && jobs.length > 0 ? (
                    <div className="flex-1 px-6 py-2">
                        <div className="space-y-3">
                            {jobs.map((file, index) => (
                                <div
                                    key={file.id || index}
                                    className="group p-4 rounded-lg border border-gray-100 hover:border-[#248fca]/20 hover:bg-[#f8fcff] transition-all duration-200 flex justify-between items-center" // Added items-center
                                >
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        {/* File Icon */}
                                        <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-[#248fca]/20">
                                            {getFileIcon(file.file_type)}
                                        </div>
                                        {/* File Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate text-base mb-1">{file.file_name}</h4>
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(file.status)}
                                                <span className="text-sm text-gray-500">{formatFileSize(file.file_size)}</span>
                                                <span className="text-sm text-gray-500">
                                                    {file.created_at ? `• ${formatDate(file.created_at)}` : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-1 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 px-4 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-white font-medium"
                                        // onClick={() => onView?.(file)} // Add actual view logic
                                        >
                                            <PlusCircle className="w-4 h-4 mr-2" />
                                            Thêm
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 px-4 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 bg-white font-medium"
                                        // onClick={() => onDownload?.(file)} // Add actual download logic
                                        >
                                            <Trash2Icon className="w-4 h-4 mr-2" />
                                            Xóa
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-9 w-9 text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 bg-transparent"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="text-blue-600 cursor-pointer hover:text-blue-600! group"
                                                // onClick={() => onAdd?.(file)} // Add actual add logic
                                                >
                                                    <EyeIcon className="w-4 h-4 mr-2 group-hover:text-blue-600!" /> Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-green-600 cursor-pointer hover:text-green-600! group"
                                                // onClick={() => onDelete?.(file)} // Add actual delete logic
                                                >
                                                    <DownloadIcon className="w-4 h-4 mr-2 group-hover:text-green-600!" /> Tải xuống
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto">
                                <Clock className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium text-gray-900">Chưa có lịch sử tải nào</h3>
                                <p className="text-sm text-gray-500 mb-4">Lịch sử tải sẽ hiển thị ở đây</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

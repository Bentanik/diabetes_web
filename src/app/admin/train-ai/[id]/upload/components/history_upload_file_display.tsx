"use client"

import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Clock,
    CheckCircle,
    AlertCircle,
    PlusCircle,
    MoreHorizontal,
    HistoryIcon,
    Trash2Icon,
    EyeIcon,
    DownloadIcon,
    Activity,
} from "lucide-react"
import { useState } from "react"
import { useGetJobsService } from "@/services/job/services"
import { getFileIcon } from "@/utils/file"

const downloadDocumentAsync = async (documentId: string) => {
    console.log(`Downloading document with ID: ${documentId}`)
    // In a real app, this would trigger an actual download
    alert(`Simulating download for document ID: ${documentId}`)
}

// Mock DeleteDocumentModal component
const DeleteDocumentModal = ({
    isOpen,
    onClose,
    document,
}: { isOpen: boolean; onClose: () => void; document: API.TJob | null }) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Xác nhận xóa tài liệu</h2>
                <p>Bạn có chắc chắn muốn xóa tài liệu &quot;{document?.file_name}?&quot;</p>
                <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            alert(`Deleting document: ${document?.file_name}`)
                            onClose()
                        }}
                    >
                        Xóa
                    </Button>
                </div>
            </div>
        </div>
    )
}

// **MODIFIED**: Function to get topic relevance badge and color
const getTopicRelevanceBadge = (score: number | null | undefined, topic: string | null | undefined) => {
    if (score === null || score === undefined || !topic) {
        return (
            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                <Activity className="w-3 h-3 mr-1" />
                Liên quan: N/A
            </Badge>
        )
    }
    const percentage = Math.round(score * 100)
    let relevanceLevel = ""
    let badgeClass = ""

    if (score >= 0.7) {
        relevanceLevel = "Cao"
        badgeClass = "bg-green-50 text-green-700 border-green-200"
    } else if (score >= 0.4) {
        relevanceLevel = "Trung bình"
        badgeClass = "bg-amber-50 text-amber-700 border-amber-200"
    } else {
        relevanceLevel = "Thấp"
        badgeClass = "bg-blue-50 text-blue-700 border-blue-200"
    }

    return (
        <Badge variant="outline" className={`${badgeClass} text-xs font-medium`}>
            <Activity className="w-3 h-3 mr-1" />
            {`Liên quan: ${topic} (${percentage}% ${relevanceLevel})`}
        </Badge>
    )
}

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
    const [isDeleteDocumentOpen, setIsDeleteDocumentOpen] = useState(false)
    const [document, setDocument] = useState<API.TJob | null>(null)

    const handleDeleteDocument = (document: API.TJob) => {
        setIsDeleteDocumentOpen(true)
        setDocument(document)
    }

    const handleCloseDeleteDocument = () => {
        setIsDeleteDocumentOpen(false)
        setDocument(null)
    }

    const handleDownloadDocument = async (document: API.TJob) => {
        await downloadDocumentAsync(document.document_id || "")
    }

    return (
        <Card className="overflow-hidden border-2 border-gray-200 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg text-[#248fca] flex items-center gap-2">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <HistoryIcon className="w-5 h-5" />
                            <span className="text-lg font-medium">Lịch sử tải tài liệu</span>
                        </div>
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
                                    className="group p-4 rounded-lg border border-gray-100 hover:border-[#248fca]/20 hover:bg-[#f8fcff] transition-all duration-200 flex justify-between items-center"
                                >
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        {/* File Icon */}
                                        <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-[#248fca]/20">
                                            {getFileIcon(file.file_type)}
                                        </div>
                                        {/* File Info */}
                                        <div className="flex-1 min-w-0 flex flex-col gap-y-1">
                                            <h4 className="font-semibold text-gray-900 truncate text-base mb-1">{file.file_name}</h4>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                {getStatusBadge(file.status)}
                                                {file.status === "completed" &&
                                                    file.is_deleted === false &&
                                                    file.is_duplicate === false &&
                                                    getTopicRelevanceBadge(file.diabetes_score_avg, "Đái tháo đường")}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
                                                <span>{formatFileSize(file.file_size)}</span>
                                                <span>{file.created_at ? `Ngày tải ${formatDate(file.created_at)}` : ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    {file.status === "completed" && file.is_deleted === false && file.is_duplicate === false && (
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
                                                onClick={() => {
                                                    handleDeleteDocument(file)
                                                }}
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
                                                        onClick={() => handleDownloadDocument(file)}
                                                    >
                                                        <DownloadIcon className="w-4 h-4 mr-2 group-hover:text-green-600!" /> Tải xuống
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                    {file.is_deleted === true && (
                                        <div className="flex items-center gap-2 pt-1 flex-shrink-0">
                                            <Badge variant="outline" className="bg-gray-50 text-red-600 border-red-200">
                                                Đã xóa
                                            </Badge>
                                        </div>
                                    )}
                                    {file.is_duplicate === true && (
                                        <div className="flex items-center gap-2 pt-1 flex-shrink-0">
                                            <Badge variant="outline" className="bg-gray-50 text-red-600 border-red-200">
                                                Tài liệu đã tồn tại
                                            </Badge>
                                        </div>
                                    )}
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
            {document && (
                <DeleteDocumentModal isOpen={isDeleteDocumentOpen} onClose={handleCloseDeleteDocument} document={document} />
            )}
        </Card>
    )
}

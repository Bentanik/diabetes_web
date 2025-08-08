"use client"

import { Button } from "@/components/ui/button"
import {
    MoreVerticalIcon,
    DownloadIcon,
    EyeIcon,
    TrashIcon,
    EditIcon,
    FileIcon,
    BrainIcon,
    TagIcon,
    TrendingUpIcon,
    CalendarIcon,
    InfoIcon,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { downloadDocumentAsync } from "@/services/train-ai/api-services"
import { formatFileSize, getFileIcon } from "@/utils/file"
import DeleteDocumentModal from "@/app/admin/train-ai/[id]/components/delete_document"
import { useState } from "react"
import useTrainDocument from "@/hooks/use-train"

type DocumentCardProps = {
    document: API.TKnowledgeDocument
}

export default function DocumentCard({ document }: DocumentCardProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const { onSubmit } = useTrainDocument()

    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true)
    }

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }


    const handleView = () => {
        console.log("View document:", document.id)
    }

    const handleEdit = () => {
        console.log("Edit document:", document.id)
    }

    const handleDownload = async () => {
        await downloadDocumentAsync(document.id)
    }

    const handleDelete = () => {
        handleOpenDeleteModal()
    }

    const handleTrain = () => {
        onSubmit(document.id);
    }

    return (
        <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#248fca]/30">

            {/* Main Content */}
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center">
                            {getFileIcon(document.file_type)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Title Row */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                                    {document.title || document.file_name}
                                </h3>
                                {document.title && document.title !== document.file_name && (
                                    <div className="flex items-center gap-1 text-sm text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                        <FileIcon className="w-3.5 h-3.5" />
                                        <span className="truncate max-w-24">{document.file_name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 ml-3">
                                {document.status === "uploaded" && <Button
                                    onClick={handleTrain}
                                    size="sm"
                                    className="bg-[#248fca] hover:bg-[#248fca]/90 text-white px-4 py-2 h-9 text-sm font-medium"
                                >
                                    <BrainIcon className="w-4 h-4 mr-2" />
                                    Huấn luyện
                                </Button>}

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9 p-0 hover:bg-gray-100"
                                        >
                                            <MoreVerticalIcon className="w-4 h-4 text-gray-500" />
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
                                        <DropdownMenuItem
                                            onClick={handleDelete}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Xóa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Description */}
                        {document.description && (
                            <div className="flex items-start gap-2 mb-4">
                                <InfoIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                    {document.description}
                                </p>
                            </div>
                        )}

                        {/* Tags/Categories */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TagIcon className="w-3.5 h-3.5 text-gray-400" />
                                <div className="flex gap-1">
                                    <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full border border-purple-200">
                                        {document.status === "uploaded" ? "Chưa được huấn luyện" : "Đã huấn luyện"}
                                    </span>
                                </div>
                            </div>
                            {/* Metadata */}
                            <div className="flex items-center gap-5 text-sm text-gray-500">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <FileIcon className="w-3.5 h-3.5" />
                                        <span className="font-medium text-gray-700">
                                            {formatFileSize(document.file_size)}
                                        </span>
                                    </div>

                                    {document.metadata?.diabetes_score_avg && (
                                        <div className="flex items-center gap-1">
                                            <TrendingUpIcon className="w-3.5 h-3.5 text-[#248fca]" />
                                            <span className="text-[#248fca] font-medium">
                                                {(document.metadata.diabetes_score_avg * 100).toFixed(1)}% trùng khớp
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <CalendarIcon className="w-3.5 h-3.5" />
                                    <span>
                                        {formatDistanceToNow(new Date(document.updated_at), {
                                            addSuffix: true,
                                            locale: vi,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <DeleteDocumentModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                document={document}
            />
        </div>
    )
}

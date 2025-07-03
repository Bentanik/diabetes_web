"use client"

import type React from "react"
import { FolderIcon, PlusIcon, FileTextIcon, MoreVerticalIcon, EditIcon, TrashIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dropdown } from "@/components/shared/Dropdown"
import FolderCreateProgress from "@/app/admin/train-ai/components/folder_create_progress"
import CreateKnowlegeModal from "@/app/admin/train-ai/components/create_knowlege"
import { useGetKnowledgeBaseListService } from "@/services/train-ai/services"
import { SkeletonFolderGrid } from "@/app/admin/train-ai/components/skeleton_folder_card"

/**
 * Component hiển thị thông tin của một thư mục
 * Bao gồm tên, mô tả, số lượng tài liệu và menu hành động
 */
const FolderCard = ({
    folder,
    onEdit,
    onDelete,
}: {
    folder: API.TKnowledgeBase
    onEdit: (folder: API.TKnowledgeBase) => void
    onDelete: (id: string) => void
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const router = useRouter()

    /**
     * Xử lý click vào thẻ thư mục
     * Chuyển hướng đến trang chi tiết thư mục
     */
    const handleCardClick = (e: React.MouseEvent) => {
        // Ngăn không cho event bubbling nếu click vào dropdown
        if ((e.target as HTMLElement).closest(".dropdown-trigger")) {
            return
        }
        router.push(`/admin/train-ai/${folder.name}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group cursor-pointer"
            onClick={handleCardClick}
        >
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white h-full">
                {/* Header của card */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Icon thư mục với gradient */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <FolderIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{folder.name}</h3>
                            <p className="text-sm text-gray-500">{folder.document_count} tài liệu</p>
                        </div>
                    </div>

                    {/* Menu dropdown */}
                    <div className="dropdown-trigger">
                        <Dropdown
                            isOpen={dropdownOpen}
                            onClose={() => setDropdownOpen(false)}
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setDropdownOpen(!dropdownOpen)
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVerticalIcon className="w-4 h-4" />
                                </Button>
                            }
                        >
                            <div className="py-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onEdit(folder)
                                        setDropdownOpen(false)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <EditIcon className="w-4 h-4" />
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(folder.name)
                                        setDropdownOpen(false)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Xóa
                                </button>
                            </div>
                        </Dropdown>
                    </div>
                </div>

                {/* Mô tả thư mục */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{folder.description}</p>

                {/* Footer với thông tin cập nhật */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Cập nhật {new Date(folder.updated_at).toLocaleString()}</span>
                    <div className="flex items-center gap-1">
                        <FileTextIcon className="w-3 h-3" />
                        <span>{folder.document_count}</span>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

/**
 * Component chính hiển thị danh sách thư mục
 * Bao gồm header với button tạo mới và grid các thư mục
 */
export default function FolderList() {
    const [folderCreationProgress, setFolderCreationProgress] = useState({
        isOpen: false,
        folderName: "",
        progress: 0,
        status: "uploading" as "uploading" | "completed" | "error",
        error: "",
    })

    const handleCloseFolderCreationProgress = () => {
        setFolderCreationProgress((prev) => ({ ...prev, isOpen: false }))
    }

    const { knowledge_bases, isPending } = useGetKnowledgeBaseListService()
    const [createModalOpen, setCreateModalOpen] = useState(false)

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false)
    }

    /**
     * Xử lý chỉnh sửa thư mục
     */
    const handleEditFolder = (folder: API.TKnowledgeBase) => {
        console.log("Chỉnh sửa thư mục:", folder)
    }

    /**
     * Xử lý xóa thư mục
     */
    const handleDeleteFolder = (id: string) => {
        console.log("Xóa thư mục:", id)
    }

    return (
        <div className="space-y-6">
            {/* Header với button tạo thư mục */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Danh sách thư mục</h2>
                </div>
            </div>

            {/* Hiển thị skeleton khi đang loading */}
            {isPending && <SkeletonFolderGrid count={6} />}

            {/* Grid hiển thị các thư mục khi đã load xong */}
            {!isPending && knowledge_bases && knowledge_bases?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {knowledge_bases?.map((folder) => (
                        <FolderCard key={folder.name} folder={folder} onEdit={handleEditFolder} onDelete={handleDeleteFolder} />
                    ))}
                </div>
            )}

            {/* Empty state nếu không có thư mục */}
            {!isPending && knowledge_bases && knowledge_bases?.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thư mục nào</h3>
                    <p className="text-gray-500 mb-6">Tạo thư mục đầu tiên để bắt đầu huấn luyện AI</p>
                    <Button onClick={() => setCreateModalOpen(true)} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                        <PlusIcon className="w-4 h-4" />
                        Tạo thư mục đầu tiên
                    </Button>
                </motion.div>
            )}

            {/* Modal tạo thư mục mới */}
            <CreateKnowlegeModal isOpen={createModalOpen} onClose={handleCloseCreateModal} />

            <FolderCreateProgress
                isOpen={folderCreationProgress.isOpen}
                onClose={handleCloseFolderCreationProgress}
                folderName={folderCreationProgress.folderName}
                progress={folderCreationProgress.progress}
                status={folderCreationProgress.status}
                error={folderCreationProgress.error}
            />
        </div>
    )
}

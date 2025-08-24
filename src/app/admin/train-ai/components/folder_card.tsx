"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dropdown } from "@/components/shared/Dropdown"
import { FolderIcon, MoreVerticalIcon, EditIcon, TrashIcon, FileTextIcon } from "lucide-react"
import { useClickOutside } from "@/hooks/use-click-outside"
import DeleteKnowledgeModal from "@/app/admin/train-ai/components/delete_knowlege"

interface FolderCardProps {
    folder: API.TKnowledge
}

export default function FolderCard({ folder }: FolderCardProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const router = useRouter()

    const dropdownRef = useClickOutside<HTMLDivElement>(() => {
        setDropdownOpen(false)
    }, dropdownOpen)

    /**
     * Xử lý click vào thẻ thư mục
     * Chuyển hướng đến trang chi tiết thư mục
     */
    const handleCardClick = (e: React.MouseEvent) => {
        // Ngăn không cho event bubbling nếu click vào dropdown
        if ((e.target as HTMLElement).closest(".dropdown-trigger")) {
            return
        }
        router.push(`/admin/train-ai/${folder.id}`)
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDeleteModalOpen(true)
        setDropdownOpen(false)
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="group cursor-pointer h-full"
                onClick={handleCardClick}
            >
                <Card className="p-6 hover:shadow-md transition-all duration-300 border border-gray-100 bg-white h-full max-w-[400px] min-h-[200px] rounded-2xl flex flex-col">
                    {/* Header của card */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Icon thư mục với gradient */}
                            <div className="w-12 h-12 bg-gradient-to-br from-[#248fca] to-[#1e7bb8] rounded-xl flex items-center justify-center">
                                <FolderIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3
                                    className="font-semibold text-[#248fca] group-hover:text-[#248fca] transition-colors"
                                    title={folder.name}
                                >
                                    {folder.name}
                                </h3>
                                <p className="text-sm text-gray-500">{folder.stats.document_count} tài liệu</p>
                            </div>
                        </div>
                        {/* Menu dropdown */}
                        <div className="dropdown-trigger" ref={dropdownRef}>
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
                                            setDropdownOpen(false)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 hover:text-[#248fca] hover:cursor-pointer"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2 hover:text-red-600 hover:cursor-pointer"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        Xóa
                                    </button>
                                </div>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Mô tả thư mục - hiển thị 1 dòng, dài thì "..." */}
                    <div className="flex-1 mb-4">
                        <p
                            className="text-sm text-gray-600 leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis"
                            title={folder.description}
                        >
                            {folder.description || "Không có mô tả"}
                        </p>
                    </div>

                    {/* Footer với thông tin cập nhật */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                        <span>Cập nhật {new Date(folder.updated_at).toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                            <FileTextIcon className="w-3 h-3" />
                            <span>{folder.stats.document_count}</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Delete Modal */}
            <DeleteKnowledgeModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                folder={{
                    id: folder.id,
                    name: folder.name,
                    description: folder.description,
                    document_count: folder.stats.document_count,
                }}
            />
        </div>
    )
}

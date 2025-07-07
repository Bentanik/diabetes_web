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
    folder: API.TKnowledgeBase
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
        router.push(`/admin/train-ai/${folder.name}`)
    }

    /**
     * Xử lý mở modal xóa
     */
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDeleteModalOpen(true)
        setDropdownOpen(false)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="group cursor-pointer h-full"
                onClick={handleCardClick}
            >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white h-full flex flex-col">
                    {/* Header của card */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Icon thư mục với gradient */}
                            <div className="w-12 h-12 bg-gradient-to-br from-[#248fca] to-[#1e7bb8] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <FolderIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-[#248fca] transition-colors">
                                    {folder.name}
                                </h3>
                                <p className="text-sm text-gray-500">{folder.document_count} tài liệu</p>
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
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 hover:text-[#248fca]"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 hover:text-[#248fca]"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        Xóa
                                    </button>
                                </div>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Mô tả thư mục - flex-1 để chiếm không gian còn lại */}
                    <div className="flex-1 mb-4">
                        <p
                            className="text-sm text-gray-600 leading-relaxed overflow-hidden text-ellipsis"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                lineHeight: "1.5rem",
                                maxHeight: "4.5rem", // 3 lines * 1.5rem line-height
                            }}
                            title={folder.description} // Tooltip để hiển thị full text khi hover
                        >
                            {folder.description || "Không có mô tả"}
                        </p>
                    </div>

                    {/* Footer với thông tin cập nhật */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                        <span>Cập nhật {new Date(folder.updated_at).toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                            <FileTextIcon className="w-3 h-3" />
                            <span>{folder.document_count}</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Delete Modal */}
            <DeleteKnowledgeModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                folder={{
                    name: folder.name,
                    description: folder.description,
                    document_count: folder.document_count,
                }}
            />
        </>
    )
}

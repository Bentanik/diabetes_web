"use client"

import type React from "react"
import {
    FolderIcon,
    PlusIcon,
    SearchIcon,
    XIcon,
} from "lucide-react"
import { motion } from "framer-motion"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CreateKnowlegeModal from "@/app/admin/train-ai/components/create_knowlege"
import { useGetKnowledgesService } from "@/services/train-ai/services"
import { SkeletonFolderGrid } from "@/app/admin/train-ai/components/skeleton_folder_card"
import Pagination from "@/components/shared/pagination"
import { useDebounce } from "@/hooks/use-debounce"
import FolderCard from "@/app/admin/train-ai/components/folder_card"

const SearchInput = ({
    value,
    onChange,
    onClear,
    placeholder = "Tìm kiếm cơ sở tri thức...",
}: {
    value: string
    onChange: (value: string) => void
    onClear: () => void
    placeholder?: string
}) => {
    return (
        <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 pr-10 border-gray-200 focus:border-[#248fca] 
                border-2 focus-visible:border-[#248fca] rounded-full focus-visible:ring-0 input-auth"
            />
            {value && (
                <button
                    onClick={onClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                >
                    <XIcon className="h-4 w-4 text-gray-400" />
                </button>
            )}
        </div>
    )
}

export default function FolderList() {
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const ITEMS_PER_PAGE = 6

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const { knowledge_bases: data, isPending } = useGetKnowledgesService({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearchTerm,
        sort_by: "updated_at",
        sort_order: "desc",
    })

    console.log("Knowledge Base Data:", data)

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false)
    }

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value)
    }, [])

    const handleClearSearch = useCallback(() => {
        setSearchTerm("")
    }, [])

    const handlePageChange = async (page: number) => {
        setCurrentPage(page)
    }

    const hasData = !isPending && data && data.items && data.items.length > 0
    const isEmpty = !isPending && data && (!data.items || data.items.length === 0)
    const isSearching = debouncedSearchTerm.length > 0

    return (
        <div className="space-y-6">
            {/* Header với search và button tạo cơ sở tri thức */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[#248fca] mb-1">Danh sách cơ sở tri thức</h2>
                    {!isPending && data && data.total !== undefined && (
                        <p className="text-sm text-gray-500">
                            {isSearching ? (
                                <>
                                    Tìm thấy {data.total} kết quả cho &quot;{debouncedSearchTerm}&quot;
                                </>
                            ) : (
                                <>Tổng cộng {data.total} cơ sở tri thức</>
                            )}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search input */}
                    <SearchInput
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onClear={handleClearSearch}
                        placeholder="Tìm kiếm cơ sở tri thức..."
                    />

                    {/* Button tạo cơ sở tri thức mới */}
                    <Button
                        onClick={() => setCreateModalOpen(true)}
                        className="gap-2 bg-[#248fca] text-white hover:bg-[#1e7bb8] shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Tạo cơ sở tri thức mới</span>
                        <span className="sm:hidden">Tạo mới</span>
                    </Button>
                </div>
            </div>

            {/* Hiển thị skeleton khi đang loading */}
            {isPending && <SkeletonFolderGrid count={9} />}

            {/* Grid hiển thị các cơ sở tri thức khi đã load xong */}
            {hasData && (
                <>
                    <div className="relative h-[440px]">
                        {/* Loading overlay khi đang fetch trang mới */}
                        {isPending && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                                <div className="flex items-center gap-2 text-[#248fca]">
                                    <div className="w-5 h-5 border-2 border-[#248fca] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm font-medium">Đang tải...</span>
                                </div>
                            </div>
                        )}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {data.items.map((folder, index) => (
                                <motion.div
                                    key={`${folder.name}-${currentPage}-${debouncedSearchTerm}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <FolderCard folder={folder} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                    {/* Pagination */}
                    {data.total_pages > 1 && (
                        <Pagination
                            currentPage={data.page}
                            totalPages={data.total_pages}
                            totalItems={data.total}
                            perPage={data.limit}
                            hasNext={data.page < data.total_pages}
                            hasPrev={data.page > 1}
                            onPageChange={handlePageChange}
                            isLoading={isPending}
                        />
                    )}
                </>
            )}

            {/* Empty state */}
            {isEmpty && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    {isSearching ? (
                        <>
                            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                            <p className="text-gray-500 mb-6">
                                Không có cơ sở tri thức nào phù hợp với từ khóa &quot;{debouncedSearchTerm}&quot;
                            </p>
                            <Button onClick={handleClearSearch} variant="outline" className="gap-2 bg-transparent">
                                <XIcon className="w-4 h-4" />
                                Xóa bộ lọc
                            </Button>
                        </>
                    ) : (
                        <>
                            <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có cơ sở tri thức nào</h3>
                            <p className="text-gray-500 mb-6">Hãy tạo cơ sở tri thức đầu tiên để bắt đầu quá trình huấn luyện AI.</p>
                            <Button
                                onClick={() => setCreateModalOpen(true)}
                                className="gap-2 bg-[#248fca] text-white hover:bg-[#1e7bb8] shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Tạo cơ sở tri thức đầu tiên
                            </Button>
                        </>
                    )}
                </motion.div>
            )}

            {/* Modal tạo cơ sở tri thức mới */}
            <CreateKnowlegeModal isOpen={createModalOpen} onClose={handleCloseCreateModal} />
        </div>
    )
}

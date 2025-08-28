"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    FileTextIcon,
    SearchIcon,
    XIcon,
    UploadIcon,
} from "lucide-react"
import Link from "next/link"

type DocumentEmptyStateProps = {
    knowledgeBaseId: string
    isSearching: boolean
    searchQuery: string
    onClearSearch: () => void
}

export default function DocumentEmptyState({
    knowledgeBaseId,
    isSearching,
    searchQuery,
    onClearSearch,
}: DocumentEmptyStateProps) {
    const hasFilters = isSearching

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm"
        >
            {hasFilters ? (
                <>
                    <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Không tìm thấy tài liệu
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        {isSearching && (
                            <>
                                Không có tài liệu nào phù hợp với từ khóa &quot;{searchQuery}&quot;
                                và bộ lọc đã chọn
                            </>
                        )}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        {isSearching && (
                            <Button onClick={onClearSearch} variant="outline" className="gap-2">
                                <XIcon className="w-4 h-4" />
                                Xóa tìm kiếm
                            </Button>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <FileTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Chưa có tài liệu nào
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Thư mục này chưa có tài liệu nào. Tải lên tài liệu đầu tiên để bắt đầu huấn luyện AI.
                    </p>
                    <Link href={`/admin/train-ai/${knowledgeBaseId}/upload`}>
                        <Button className="gap-2 bg-[#248fca] text-white hover:bg-[#1e7bb8]">
                            <UploadIcon className="w-4 h-4" />
                            Tải lên tài liệu đầu tiên
                        </Button>
                    </Link>
                </>
            )}
        </motion.div>
    )
}

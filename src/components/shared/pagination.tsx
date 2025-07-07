"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    perPage: number
    hasNext: boolean
    hasPrev: boolean
    onPageChange: (page: number) => void
    isLoading?: boolean
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    perPage,
    hasNext,
    hasPrev,
    onPageChange,
    isLoading = false,
}: PaginationProps) {
    // Tính toán range hiển thị
    const getVisiblePages = () => {
        const delta = 2
        const range = []
        const rangeWithDots = []

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i)
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...")
        } else {
            rangeWithDots.push(1)
        }

        rangeWithDots.push(...range)

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages)
        } else {
            if (totalPages > 1) {
                rangeWithDots.push(totalPages)
            }
        }

        return rangeWithDots
    }

    const visiblePages = getVisiblePages()
    const startItem = (currentPage - 1) * perPage + 1
    const endItem = Math.min(currentPage * perPage, totalItems)

    if (totalPages <= 1) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-white rounded-lg border border-gray-200 transition-opacity duration-200 ${isLoading ? "opacity-50" : "opacity-100"
                }`}
        >
            {/* Thông tin hiển thị */}
            <div className="text-sm text-gray-600">
                Hiển thị <span className="font-medium text-[#248fca]">{startItem}</span> đến{" "}
                <span className="font-medium text-[#248fca]">{endItem}</span> trong tổng số{" "}
                <span className="font-medium text-[#248fca]">{totalItems}</span> mục
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* Previous button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrev || isLoading}
                    className="flex items-center gap-1 px-3 py-2 border-gray-300 hover:border-[#248fca] hover:text-[#248fca] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Trước</span>
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) => {
                        if (page === "...") {
                            return (
                                <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                                    ...
                                </span>
                            )
                        }

                        const pageNumber = page as number
                        const isActive = pageNumber === currentPage

                        return (
                            <motion.button
                                key={pageNumber}
                                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                                onClick={() => !isLoading && onPageChange(pageNumber)}
                                disabled={isLoading}
                                className={`
                  px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 disabled:cursor-not-allowed
                  ${isActive
                                        ? "bg-[#248fca] text-white shadow-lg shadow-[#248fca]/25"
                                        : "text-gray-700 hover:bg-[#248fca]/10 hover:text-[#248fca] border border-transparent hover:border-[#248fca]/20 disabled:hover:bg-transparent disabled:hover:text-gray-700"
                                    }
                `}
                            >
                                {pageNumber}
                            </motion.button>
                        )
                    })}
                </div>

                {/* Next button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNext || isLoading}
                    className="flex items-center gap-1 px-3 py-2 border-gray-300 hover:border-[#248fca] hover:text-[#248fca] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRightIcon className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    )
}

"use client"

import { Input } from "@/components/ui/input"
import {
    SearchIcon,
    XIcon,
    FileTextIcon,
    BrainIcon,
} from "lucide-react"

type DocumentSearchProps = {
    searchTerm: string
    onSearchChange: (value: string) => void
    statusFilter: "all" | "completed" | "failed" | "processing" | "queued"
    onStatusFilterChange: (status: "all" | "completed" | "failed" | "processing" | "queued") => void
    totalCount?: number
    isSearching: boolean
    searchQuery: string
    isTrainingTab?: boolean
}

export default function DocumentSearch({
    searchTerm,
    onSearchChange,
    totalCount,
    isSearching,
    searchQuery,
    isTrainingTab = false
}: DocumentSearchProps) {
    const getTitle = () => {
        return isTrainingTab ? "Công việc huấn luyện" : "Tài liệu trong thư mục"
    }

    const getPlaceholder = () => {
        return isTrainingTab ? "Tìm kiếm công việc huấn luyện..." : "Tìm kiếm tài liệu..."
    }

    const getItemType = () => {
        return isTrainingTab ? "công việc" : "tài liệu"
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[#248fca] mb-1 flex items-center gap-2">
                        {isTrainingTab ? (
                            <BrainIcon className="w-5 h-5 text-[#248fca]" />
                        ) : (
                            <FileTextIcon className="w-5 h-5 text-[#248fca]" />
                        )}
                        {getTitle()}
                    </h2>
                    {totalCount !== undefined && (
                        <p className="text-sm text-gray-500">
                            {isSearching ? (
                                <>
                                    Tìm thấy <span className="font-medium">{totalCount}</span> kết quả cho &quot;{searchQuery}&quot;
                                </>
                            ) : (
                                <>
                                    Tổng cộng <span className="font-medium">{totalCount}</span> {getItemType()}
                                </>
                            )}
                        </p>
                    )}
                </div>
            </div>

            {/* Search và Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder={getPlaceholder()}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-10 border-gray-200 focus:border-[#248fca] 
                        border-2 focus-visible:border-[#248fca] rounded-lg focus-visible:ring-0 input-auth"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                        >
                            <XIcon className="h-4 w-4 text-gray-400" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

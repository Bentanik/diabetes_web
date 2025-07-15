// app/admin/train-ai/[id]/components/document-search.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    SearchIcon,
    XIcon,
    FileTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    FilterIcon,
    BrainIcon,
    ClockIcon,
    LoaderIcon
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

const StatusBadge = ({ status, isTrainingTab }: { status: "all" | "completed" | "failed" | "processing" | "queued", isTrainingTab: boolean }) => {
    if (isTrainingTab) {
        switch (status) {
            case "completed":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Hoàn thành
                    </Badge>
                )
            case "failed":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircleIcon className="w-3 h-3 mr-1" />
                        Thất bại
                    </Badge>
                )
            case "processing":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <LoaderIcon className="w-3 h-3 mr-1" />
                        Đang xử lý
                    </Badge>
                )
            case "queued":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Đang chờ
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        <BrainIcon className="w-3 h-3 mr-1" />
                        Tất cả
                    </Badge>
                )
        }
    } else {
        switch (status) {
            case "completed":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Hoàn thành
                    </Badge>
                )
            case "failed":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircleIcon className="w-3 h-3 mr-1" />
                        Thất bại
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        <FileTextIcon className="w-3 h-3 mr-1" />
                        Tất cả
                    </Badge>
                )
        }
    }
}

export default function DocumentSearch({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
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
                        border-2 focus-visible:border-[#248fca] rounded-lg focus-visible:ring-0"
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

                {/* Status Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 min-w-fit border-gray-200 hover:border-[#248fca]">
                            <FilterIcon className="w-4 h-4" />
                            <StatusBadge status={statusFilter} isTrainingTab={isTrainingTab} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onStatusFilterChange("all")}>
                            {isTrainingTab ? (
                                <BrainIcon className="w-4 h-4 mr-2" />
                            ) : (
                                <FileTextIcon className="w-4 h-4 mr-2" />
                            )}
                            Tất cả trạng thái
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onStatusFilterChange("completed")}>
                            <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                            Hoàn thành
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onStatusFilterChange("failed")}>
                            <XCircleIcon className="w-4 h-4 mr-2 text-red-600" />
                            Thất bại
                        </DropdownMenuItem>

                        {isTrainingTab && (
                            <>
                                <DropdownMenuItem onClick={() => onStatusFilterChange("processing")}>
                                    <LoaderIcon className="w-4 h-4 mr-2 text-blue-600" />
                                    Đang xử lý
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => onStatusFilterChange("queued")}>
                                    <ClockIcon className="w-4 h-4 mr-2 text-yellow-600" />
                                    Đang chờ
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

import React from "react"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ViewMode } from "@/hooks/useStaffFilter"

/**
 * Interface cho props của SearchFilter component
 */
interface SearchFilterProps {
    // Search props
    searchTerm: string
    onSearchTermChange: (term: string) => void
    searchPlaceholder?: string

    // Department filter props
    selectedDepartment: string
    onDepartmentChange: (department: string) => void
    departments: Array<{ name: string }>

    // Status filter props
    selectedStatus: string
    onStatusChange: (status: string) => void

    // View mode props
    viewMode: ViewMode
    onViewModeChange: (mode: ViewMode) => void

    // Optional props
    showViewModeToggle?: boolean
    className?: string
}

/**
 * Component tái sử dụng cho tìm kiếm và lọc dữ liệu nhân viên
 * Bao gồm search bar, department filter, status filter và view mode toggle
 */
export const SearchFilter: React.FC<SearchFilterProps> = ({
    searchTerm,
    onSearchTermChange,
    searchPlaceholder = "Tìm kiếm theo tên, email, khoa...",
    selectedDepartment,
    onDepartmentChange,
    departments,
    selectedStatus,
    onStatusChange,
    viewMode,
    onViewModeChange,
    showViewModeToggle = true,
    className = ""
}) => {
    return (
        <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6 ${className}`}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search và Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-0">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Department Filter */}
                    <select
                        value={selectedDepartment}
                        onChange={(e) => onDepartmentChange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-fit"
                    >
                        <option value="all">Tất cả khoa</option>
                        {departments.map((dept) => (
                            <option key={dept.name} value={dept.name}>
                                {dept.name}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-fit"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Tạm nghỉ</option>
                        <option value="pending">Chờ xác thực</option>
                    </select>
                </div>

                {/* View Mode Toggle */}
                {showViewModeToggle && (
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === "grid" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onViewModeChange("grid")}
                        >
                            Grid
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onViewModeChange("list")}
                        >
                            List
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
} 
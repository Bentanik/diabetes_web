import { useState, useMemo } from "react";
import {
  StaffMember,
  filterStaff,
  getDepartmentStats,
} from "@/utils/statusUtils";

/**
 * Interface cho view mode options
 */
export type ViewMode = "grid" | "list";

/**
 * Interface cho return values của useStaffFilter hook
 */
interface UseStaffFilterReturn {
  // State values
  searchTerm: string;
  selectedDepartment: string;
  selectedStatus: string;
  viewMode: ViewMode;

  // Filtered data
  filteredStaff: StaffMember[];
  departmentStats: Array<{
    name: string;
    totalStaff: number;
    activeStaff: number;
    inactiveStaff: number;
  }>;

  // Setter functions
  setSearchTerm: (term: string) => void;
  setSelectedDepartment: (department: string) => void;
  setSelectedStatus: (status: string) => void;
  setViewMode: (mode: ViewMode) => void;

  // Utility functions
  resetFilters: () => void;
  isEmpty: boolean;
}

/**
 * Custom hook để quản lý filtering và searching cho staff list
 * @param staffData - Danh sách nhân viên ban đầu
 * @returns Các state và functions để quản lý filter
 */
export const useStaffFilter = (
  staffData: StaffMember[]
): UseStaffFilterReturn => {
  // State quản lý các bộ lọc
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Tính toán danh sách nhân viên đã được lọc
  const filteredStaff = useMemo(() => {
    return filterStaff(
      staffData,
      searchTerm,
      selectedDepartment,
      selectedStatus
    );
  }, [staffData, searchTerm, selectedDepartment, selectedStatus]);

  // Tính toán thống kê theo khoa
  const departmentStats = useMemo(() => {
    return getDepartmentStats(staffData);
  }, [staffData]);

  // Function reset tất cả bộ lọc về mặc định
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedStatus("all");
  };

  // Kiểm tra xem có kết quả lọc hay không
  const isEmpty = filteredStaff.length === 0;

  return {
    // State values
    searchTerm,
    selectedDepartment,
    selectedStatus,
    viewMode,

    // Filtered data
    filteredStaff,
    departmentStats,

    // Setter functions
    setSearchTerm,
    setSelectedDepartment,
    setSelectedStatus,
    setViewMode,

    // Utility functions
    resetFilters,
    isEmpty,
  };
};

"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import Header from "./header";
import ConsultationFilter from "./consultation-filter";
import DashboardSummary from "./dashboard-summary";
import ConsultationChart from "./consultation-chart";
import { useConsultationDashboard } from "../hooks/use-consultation-dashboard";

const ManageConsultation = memo(() => {
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("");

    // Hook để lấy dữ liệu dashboard
    const { dashboardData, isLoading, dateRange } =
        useConsultationDashboard({
            selectedYear,
            selectedMonth,
        });

    // Xác định loại thống kê hiện tại - sử dụng useMemo để tối ưu hóa
    const statisticsType = useMemo(() => {
        if (selectedYear && selectedMonth) {
            return "monthly";
        } else if (selectedYear) {
            return "yearly";
        }
        return null;
    }, [selectedYear, selectedMonth]);

    // Tối ưu hóa callback functions để tránh re-render không cần thiết
    const handleYearChange = useCallback((year: string) => {
        setSelectedYear(year);
        setSelectedMonth("");
    }, []);

    const handleMonthChange = useCallback((month: string) => {
        if (month === "year-summary") {
            setSelectedMonth("");
        } else {
            setSelectedMonth(month);
        }
    }, []);

    // Kiểm tra xem có nên hiển thị dashboard content hay không
    const shouldShowDashboard = useMemo(() => {
        return !!selectedYear;
    }, [selectedYear]);

    // Kiểm tra xem có nên hiển thị empty state hay không
    const shouldShowEmptyState = useMemo(() => {
        return !isLoading && !dashboardData && shouldShowDashboard;
    }, [isLoading, dashboardData, shouldShowDashboard]);

    // Tối ưu hóa: Chỉ render khi cần thiết
    if (!shouldShowDashboard) {
        return (
            <div>
                <Header />
                <ConsultationFilter
                    selectedYear={selectedYear}
                    setSelectedYear={handleYearChange}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={handleMonthChange}
                />
            </div>
        );
    }

    return (
        <div>
            <Header />

            {/* Filter Section */}
            <ConsultationFilter
                selectedYear={selectedYear}
                setSelectedYear={handleYearChange}
                selectedMonth={selectedMonth}
                setSelectedMonth={handleMonthChange}
            />

            {/* Dashboard Content */}
            <>
                {/* Summary Cards */}
                <DashboardSummary
                    data={dashboardData}
                    isLoading={isLoading}
                    statisticsType={statisticsType}
                />

                {/* Charts */}
                <ConsultationChart
                    data={dashboardData}
                    isLoading={isLoading}
                    selectedYear={selectedYear}
                    selectedMonth={selectedMonth}
                    statisticsType={statisticsType}
                />

                {/* Empty State khi có năm/tháng nhưng không có dữ liệu */}
                {shouldShowEmptyState && (
                    <div className="bg-white rounded-2xl p-12 border border-gray-200 mb-6 shawdow-hospital">
                        <div className="text-center text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {selectedMonth 
                                    ? `Năm ${selectedYear} tháng ${selectedMonth} không có dữ liệu`
                                    : `Năm ${selectedYear} không có dữ liệu`
                                }
                            </h3>
                            <p className="text-gray-500">
                                Vui lòng chọn khoảng thời gian khác để xem thống kê
                            </p>
                        </div>
                    </div>
                )}
            </>
        </div>
    );
});

ManageConsultation.displayName = "ManageConsultation";

export default ManageConsultation;

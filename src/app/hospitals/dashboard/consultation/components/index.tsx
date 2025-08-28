"use client";

import React, { useState, useEffect } from "react";
import Header from "./header";
import ConsultationFilter from "./consultation-filter";
import DashboardSummary from "./dashboard-summary";
import ConsultationChart from "./consultation-chart";
import { useConsultationDashboardMock } from "../hooks/use-consultation-dashboard-mock";

interface WeekOption {
    label: string;
    value: string;
    dates: string[];
    weekStart: Date;
    weekEnd: Date;
}

export default function ManageConsultation() {
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedWeek, setSelectedWeek] = useState<string>("");
    const [selectedWeekData, setSelectedWeekData] = useState<
        WeekOption | undefined
    >(undefined);

    // Hook để lấy dữ liệu dashboard
    const { dashboardData, isLoading, dateRange } =
        useConsultationDashboardMock({
            doctorId: selectedDoctor,
            selectedYear,
            selectedMonth,
            selectedWeek,
            selectedWeekData,
        });

    // Cập nhật selectedWeekData khi có thay đổi
    useEffect(() => {
        if (selectedYear && selectedMonth && selectedWeek) {
            // Tìm week data tương ứng
            const year = parseInt(selectedYear);
            const month = parseInt(selectedMonth);
            const weekNumber = parseInt(selectedWeek.split("-").pop() || "1");

            // Tạo week data
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);

            let currentWeekStart = new Date(firstDay);
            const dayOfWeek = firstDay.getDay();

            let daysToMonday;
            if (dayOfWeek === 0) {
                daysToMonday = 6;
            } else {
                daysToMonday = dayOfWeek - 1;
            }

            currentWeekStart.setDate(firstDay.getDate() - daysToMonday);

            // Tính đến tuần được chọn
            for (let i = 1; i < weekNumber; i++) {
                currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            }

            const weekEnd = new Date(currentWeekStart);
            weekEnd.setDate(currentWeekStart.getDate() + 6);

            const dates = Array.from({ length: 7 }, (_, index) => {
                const date = new Date(currentWeekStart);
                date.setDate(currentWeekStart.getDate() + index);
                return date.toISOString().split("T")[0];
            });

            setSelectedWeekData({
                label: `Tuần ${weekNumber}`,
                value: selectedWeek,
                dates,
                weekStart: new Date(currentWeekStart),
                weekEnd: new Date(weekEnd),
            });
        } else {
            setSelectedWeekData(undefined);
        }
    }, [selectedYear, selectedMonth, selectedWeek]);

    return (
        <div>
            <Header />

            {/* Filter Section */}
            <ConsultationFilter
                selectedDoctor={selectedDoctor}
                setSelectedDoctor={setSelectedDoctor}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedWeek={selectedWeek}
                setSelectedWeek={setSelectedWeek}
                selectedWeekData={selectedWeekData}
            />

            {/* Dashboard Content */}
            {selectedDoctor && selectedYear && (
                <>
                    {/* Summary Cards */}
                    <DashboardSummary
                        data={dashboardData}
                        isLoading={isLoading}
                    />

                    {/* Charts */}
                    <ConsultationChart
                        data={dashboardData}
                        isLoading={isLoading}
                        selectedYear={selectedYear}
                        selectedMonth={selectedMonth}
                        selectedWeek={selectedWeek}
                    />
                </>
            )}

            {/* Empty State */}
            {(!selectedDoctor || !selectedYear) && (
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2 ">
                            Chưa có dữ liệu để hiển thị
                        </h3>
                        <p className="text-gray-500">
                            Vui lòng chọn bác sĩ và khoảng thời gian để xem
                            thống kê
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

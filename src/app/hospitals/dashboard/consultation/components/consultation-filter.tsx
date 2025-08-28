"use client";

import React from "react";
import { Stethoscope, Calendar, Clock } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface WeekOption {
    label: string;
    value: string;
    dates: string[];
    weekStart: Date;
    weekEnd: Date;
}

interface ConsultationFilterProps {
    selectedDoctor: string;
    setSelectedDoctor: (doctorId: string) => void;
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
    selectedWeek: string;
    setSelectedWeek: (week: string) => void;
    selectedWeekData: WeekOption | undefined;
}

// Mock data cho doctors
const mockDoctors = [
    { id: "1", name: "Bác sĩ Nguyễn Văn A", specialization: "Tim mạch" },
    { id: "2", name: "Bác sĩ Trần Thị B", specialization: "Nội khoa" },
    { id: "3", name: "Bác sĩ Lê Văn C", specialization: "Ngoại khoa" },
    { id: "4", name: "Bác sĩ Phạm Thị D", specialization: "Nhi khoa" },
    { id: "5", name: "Bác sĩ Hoàng Văn E", specialization: "Da liễu" },
    { id: "6", name: "Bác sĩ Mai Viết Vỹ", specialization: "Tổng quát" },
];

const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    const startYear = 2020;
    const endYear = currentYear + 10;

    for (let i = startYear; i <= endYear; i++) {
        years.push({
            value: i.toString(),
            label: `Năm ${i}`,
        });
    }
    return years.reverse();
};

const generateMonthOptions = () => {
    const months = [
        { value: "1", label: "Tháng 1" },
        { value: "2", label: "Tháng 2" },
        { value: "3", label: "Tháng 3" },
        { value: "4", label: "Tháng 4" },
        { value: "5", label: "Tháng 5" },
        { value: "6", label: "Tháng 6" },
        { value: "7", label: "Tháng 7" },
        { value: "8", label: "Tháng 8" },
        { value: "9", label: "Tháng 9" },
        { value: "10", label: "Tháng 10" },
        { value: "11", label: "Tháng 11" },
        { value: "12", label: "Tháng 12" },
    ];
    return months;
};

const generateWeekOptionsForMonth = (year: number, month: number) => {
    const weeks: WeekOption[] = [];
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

    let weekNumber = 1;

    while (currentWeekStart <= lastDay) {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6);

        if (weekEnd >= firstDay && currentWeekStart <= lastDay) {
            const dates = Array.from({ length: 7 }, (_, index) => {
                const date = new Date(currentWeekStart);
                date.setDate(currentWeekStart.getDate() + index);
                return date.toISOString().split("T")[0];
            });

            const weekStartInMonth =
                currentWeekStart < firstDay ? firstDay : currentWeekStart;
            const weekEndInMonth = weekEnd > lastDay ? lastDay : weekEnd;

            const startStr = weekStartInMonth.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
            });
            const endStr = weekEndInMonth.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
            });

            weeks.push({
                label: `Tuần ${weekNumber} (${startStr} - ${endStr})`,
                value: `week-${year}-${month}-${weekNumber}`,
                dates,
                weekStart: new Date(currentWeekStart),
                weekEnd: new Date(weekEnd),
            });
            weekNumber++;
        }

        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    return weeks;
};

export default function ConsultationFilter({
    selectedDoctor,
    setSelectedDoctor,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedWeek,
    setSelectedWeek,
    selectedWeekData,
}: ConsultationFilterProps) {
    const yearOptions = generateYearOptions();
    const monthOptions = generateMonthOptions();
    const weekOptions =
        selectedYear && selectedMonth
            ? [
                  {
                      label: "Thống kê theo tháng",
                      value: "month-summary",
                      dates: [],
                      weekStart: new Date(),
                      weekEnd: new Date(),
                  },
                  ...generateWeekOptionsForMonth(
                      parseInt(selectedYear),
                      parseInt(selectedMonth)
                  ),
              ]
            : [];

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        setSelectedMonth("");
        setSelectedWeek("");
    };

    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
        setSelectedWeek("");
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
            <div className="flex flex-wrap gap-6 items-end">
                {/* Chọn bác sĩ */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Stethoscope className="h-5 w-5 text-[#248FCA]" />
                        <h2 className="text-lg font-semibold text-[#248FCA]">
                            Chọn bác sĩ
                        </h2>
                    </div>
                    <Select
                        value={selectedDoctor}
                        onValueChange={setSelectedDoctor}
                    >
                        <SelectTrigger className="w-[230px] h-10">
                            <SelectValue placeholder="Lựa chọn bác sĩ" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {mockDoctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                    {doctor.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Chọn năm */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-[#248FCA]" />
                        <h2 className="text-lg font-semibold text-[#248FCA]">
                            Chọn năm
                        </h2>
                    </div>
                    <Select
                        value={selectedYear}
                        onValueChange={handleYearChange}
                    >
                        <SelectTrigger className="w-[200px] h-10">
                            <SelectValue placeholder="Chọn năm..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {yearOptions.map((year) => (
                                <SelectItem key={year.value} value={year.value}>
                                    {year.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Chọn tháng */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-[#248FCA]" />
                        <h2 className="text-lg font-semibold text-[#248FCA]">
                            Chọn tháng
                        </h2>
                    </div>
                    <Select
                        value={selectedMonth}
                        onValueChange={handleMonthChange}
                        disabled={!selectedYear}
                    >
                        <SelectTrigger className="w-[200px] h-10">
                            <SelectValue placeholder="Chọn tháng..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {monthOptions.map((month) => (
                                <SelectItem
                                    key={month.value}
                                    value={month.value}
                                >
                                    {month.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Chọn tuần */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-[#248FCA]" />
                        <h2 className="text-lg font-semibold text-[#248FCA]">
                            Chọn tuần
                        </h2>
                    </div>
                    <Select
                        value={selectedWeek}
                        onValueChange={setSelectedWeek}
                        disabled={!selectedYear || !selectedMonth}
                    >
                        <SelectTrigger className="w-[250px] h-10">
                            <SelectValue placeholder="Chọn tuần..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {weekOptions && weekOptions.length > 0 ? (
                                weekOptions.map((week) => (
                                    <SelectItem
                                        key={week.value}
                                        value={week.value}
                                    >
                                        {week.label}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-weeks" disabled>
                                    Không có tuần nào
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

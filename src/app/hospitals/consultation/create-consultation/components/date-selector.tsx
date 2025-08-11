"use client";
import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface WeekOption {
    label: string;
    value: string;
    dates: string[];
    weekStart: Date;
    weekEnd: Date;
}

interface DateSelectorProps {
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
    selectedWeek: string;
    setSelectedWeek: (week: string) => void;
    selectedWeekData: WeekOption | undefined;
}

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
    return years.reverse(); // Đảo ngược để năm gần nhất ở trên
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
    currentWeekStart.setDate(
        firstDay.getDate() - ((firstDay.getDay() + 6) % 7)
    );

    let weekNumber = 1;

    while (currentWeekStart <= lastDay) {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6);

        if (weekEnd >= firstDay && currentWeekStart <= lastDay) {
            const startStr = currentWeekStart.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
            });
            const endStr = weekEnd.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
            });

            weeks.push({
                label: `Tuần ${weekNumber} (${startStr} - ${endStr})`,
                value: `week-${year}-${month}-${weekNumber}`,
                dates: Array.from({ length: 7 }, (_, index) => {
                    const date = new Date(currentWeekStart);
                    date.setDate(currentWeekStart.getDate() + index);
                    return date.toISOString().split("T")[0];
                }),
                weekStart: new Date(currentWeekStart),
                weekEnd: new Date(weekEnd),
            });

            weekNumber++;
        }

        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    return weeks;
};

export default function DateSelector({
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedWeek,
    setSelectedWeek,
    selectedWeekData,
}: DateSelectorProps) {
    const yearOptions = generateYearOptions();
    const monthOptions = generateMonthOptions();
    const weekOptions =
        selectedYear && selectedMonth
            ? generateWeekOptionsForMonth(
                  parseInt(selectedYear),
                  parseInt(selectedMonth)
              )
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
        <>
            {/* Chọn năm */}
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-[#248FCA]" />
                    <h2 className="text-lg font-semibold text-[#248FCA]">
                        Chọn năm
                    </h2>
                </div>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                    <SelectTrigger className="h-12">
                        <SelectValue placeholder="Chọn năm..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px]">
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
                    <SelectTrigger className="h-12">
                        <SelectValue placeholder="Chọn tháng..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px]">
                        {monthOptions.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                                {month.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Chọn tuần */}
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-[#248FCA]" />
                    <h2 className="text-lg font-semibold text-[#248FCA]">
                        Chọn tuần
                    </h2>
                </div>
                <Select
                    value={selectedWeek}
                    onValueChange={setSelectedWeek}
                    disabled={!selectedYear || !selectedMonth}
                >
                    <SelectTrigger className="h-12">
                        <SelectValue placeholder="Chọn tuần..." />
                    </SelectTrigger>
                    <SelectContent>
                        {weekOptions.map((week) => (
                            <SelectItem key={week.value} value={week.value}>
                                {week.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}

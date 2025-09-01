"use client";

import React from "react";
import { Calendar } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ConsultationFilterProps {
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
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
    return years.reverse();
};

const generateMonthOptions = () => {
    const months = [
        { value: "year-summary", label: "Chỉ thống kê theo năm" },
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

export default function ConsultationFilter({
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
}: ConsultationFilterProps) {
    const yearOptions = generateYearOptions();
    const monthOptions = generateMonthOptions();

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        setSelectedMonth("");
    };

    const handleMonthChange = (month: string) => {
        if (month === "year-summary") {
            setSelectedMonth("");
        } else {
            setSelectedMonth(month);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
            <div className="flex flex-wrap gap-6 items-end">
                {/* Chọn năm */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-[#071d34]" />
                        <h2 className="text-lg font-semibold text-[#071d34]">
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
                        <Calendar className="h-5 w-5 text-[#071d34]" />
                        <h2 className="text-lg font-semibold text-[#071d34]">
                            Chọn tháng
                        </h2>
                    </div>
                    <Select
                        value={selectedMonth}
                        onValueChange={handleMonthChange}
                        disabled={!selectedYear}
                    >
                        <SelectTrigger className="w-[250px] h-10">
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
            </div>
        </div>
    );
}

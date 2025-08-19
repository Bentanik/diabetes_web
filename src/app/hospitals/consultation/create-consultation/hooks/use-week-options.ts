"use client";
import { useMemo, useState, useCallback } from "react";

interface WeekOption {
    label: string;
    value: string;
    dates: string[];
    weekStart: Date;
    weekEnd: Date;
}

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const generateWeekOptionsForMonth = (
    year: number,
    month: number
): WeekOption[] => {
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
                    return formatDate(date);
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

export const useWeekOptions = () => {
    const currentDate = new Date();
    const [selectedYear, setSelectedYear] = useState<string>(
        currentDate.getFullYear().toString()
    );
    const [selectedMonth, setSelectedMonth] = useState<string>(
        (currentDate.getMonth() + 1).toString()
    );
    const [selectedWeek, setSelectedWeek] = useState<string>("");

    const weekOptions = useMemo(() => {
        if (!selectedYear || !selectedMonth) return [] as WeekOption[];
        return generateWeekOptionsForMonth(
            parseInt(selectedYear, 10),
            parseInt(selectedMonth, 10)
        );
    }, [selectedYear, selectedMonth]);

    const selectedWeekData = useMemo(() => {
        return weekOptions.find((w) => w.value === selectedWeek);
    }, [weekOptions, selectedWeek]);

    const apiParams = useMemo(() => {
        if (!selectedWeekData) return null;
        return {
            pageSize: 7,
            fromDate: formatDate(selectedWeekData.weekStart),
            toDate: formatDate(selectedWeekData.weekEnd),
        };
    }, [
        selectedWeekData?.weekStart?.getTime(),
        selectedWeekData?.weekEnd?.getTime(),
    ]);

    const handleWeekChange = useCallback((newWeek: string) => {
        setSelectedWeek(newWeek);
    }, []);

    return {
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        selectedWeek,
        setSelectedWeek: handleWeekChange,
        weekOptions,
        selectedWeekData,
        apiParams,
    };
};

export type { WeekOption };

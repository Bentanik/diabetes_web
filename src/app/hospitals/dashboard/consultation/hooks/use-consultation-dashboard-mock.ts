import { useState, useEffect, useMemo } from "react";

interface WeekOption {
    label: string;
    value: string;
    dates: string[];
    weekStart: Date;
    weekEnd: Date;
}

interface UseConsultationDashboardProps {
    doctorId: string;
    selectedYear: string;
    selectedMonth: string;
    selectedWeek: string;
    selectedWeekData: WeekOption | undefined;
}

// Tạo dữ liệu mock cho tất cả 12 tháng
const generateMockDataForMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthData: any = {};

    let weekNumber = 1;
    let currentWeek: any[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month.toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")}`;
        const consultations = Math.floor(Math.random() * 20) + 5; // 5-25 consultations
        const revenue =
            consultations * (Math.floor(Math.random() * 500000) + 2000000); // 2M-2.5M per consultation
        const completed = Math.floor(consultations * 0.8); // 80% completed
        const pending = Math.floor(consultations * 0.15); // 15% pending
        const cancelled = consultations - completed - pending; // remaining cancelled

        currentWeek.push({
            date,
            consultations,
            revenue,
            completed,
            pending,
            cancelled,
        });

        // Tạo tuần mới khi đủ 7 ngày hoặc hết tháng
        if (currentWeek.length === 7 || day === daysInMonth) {
            monthData[`week-${year}-${month}-${weekNumber}`] = currentWeek;
            weekNumber++;
            currentWeek = [];
        }
    }

    return monthData;
};

// Mock data cho consultation với tất cả 12 tháng
const mockConsultationData = {
    "2025": {
        "1": generateMockDataForMonth(2025, 1),
        "2": generateMockDataForMonth(2025, 2),
        "3": generateMockDataForMonth(2025, 3),
        "4": generateMockDataForMonth(2025, 4),
        "5": generateMockDataForMonth(2025, 5),
        "6": generateMockDataForMonth(2025, 6),
        "7": generateMockDataForMonth(2025, 7),
        "8": generateMockDataForMonth(2025, 8),
        "9": generateMockDataForMonth(2025, 9),
        "10": generateMockDataForMonth(2025, 10),
        "11": generateMockDataForMonth(2025, 11),
        "12": generateMockDataForMonth(2025, 12),
    },
};

export const useConsultationDashboardMock = ({
    doctorId,
    selectedYear,
    selectedMonth,
    selectedWeek,
    selectedWeekData,
}: UseConsultationDashboardProps) => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const dateRange = useMemo(() => {
        let fromDate: Date;
        let toDate: Date;

        if (selectedYear && selectedMonth && selectedWeek) {
            // Tuần cụ thể
            if (selectedWeekData) {
                fromDate = selectedWeekData.weekStart;
                toDate = selectedWeekData.weekEnd;
            } else {
                fromDate = new Date(
                    parseInt(selectedYear),
                    parseInt(selectedMonth) - 1,
                    1
                );
                toDate = new Date(
                    parseInt(selectedYear),
                    parseInt(selectedMonth),
                    0
                );
            }
        } else if (selectedYear && selectedMonth) {
            // Tháng cụ thể
            fromDate = new Date(
                parseInt(selectedYear),
                parseInt(selectedMonth) - 1,
                1
            );
            toDate = new Date(
                parseInt(selectedYear),
                parseInt(selectedMonth),
                0
            );
        } else if (selectedYear) {
            // Năm cụ thể
            fromDate = new Date(parseInt(selectedYear), 0, 1);
            toDate = new Date(parseInt(selectedYear), 11, 31);
        } else {
            // Mặc định
            fromDate = new Date();
            toDate = new Date();
        }

        return { fromDate, toDate };
    }, [selectedYear, selectedMonth, selectedWeek, selectedWeekData]);

    useEffect(() => {
        if (!doctorId || !selectedYear) {
            setDashboardData(null);
            return;
        }

        setIsLoading(true);

        // Simulate API call delay
        const timer = setTimeout(() => {
            try {
                let allConsultations: any[] = [];

                if (selectedYear && selectedMonth && selectedWeek) {
                    // Lấy data theo tuần
                    const weekData = (mockConsultationData as any)[
                        selectedYear
                    ]?.[selectedMonth]?.[selectedWeek];
                    if (weekData) {
                        allConsultations = weekData;
                    }
                } else if (selectedYear && selectedMonth) {
                    // Lấy data theo tháng
                    const monthData = (mockConsultationData as any)[
                        selectedYear
                    ]?.[selectedMonth];
                    if (monthData) {
                        Object.values(monthData).forEach((weekData: any) => {
                            allConsultations =
                                allConsultations.concat(weekData);
                        });
                    }
                } else if (selectedYear) {
                    // Lấy data theo năm - tất cả 12 tháng
                    const yearData = (mockConsultationData as any)[
                        selectedYear
                    ];
                    if (yearData) {
                        // Tạo dữ liệu cho từng tháng
                        for (let month = 1; month <= 12; month++) {
                            const monthKey = month.toString();
                            const monthData = yearData[monthKey];
                            if (monthData) {
                                // Tính tổng cho tháng này
                                let monthTotal = {
                                    consultations: 0,
                                    revenue: 0,
                                    completed: 0,
                                    pending: 0,
                                    cancelled: 0,
                                };

                                Object.values(monthData).forEach(
                                    (weekData: any) => {
                                        weekData.forEach((dayData: any) => {
                                            monthTotal.consultations +=
                                                dayData.consultations;
                                            monthTotal.revenue +=
                                                dayData.revenue;
                                            monthTotal.completed +=
                                                dayData.completed;
                                            monthTotal.pending +=
                                                dayData.pending;
                                            monthTotal.cancelled +=
                                                dayData.cancelled;
                                        });
                                    }
                                );

                                // Tạo một record đại diện cho tháng
                                allConsultations.push({
                                    date: `${selectedYear}-${monthKey.padStart(
                                        2,
                                        "0"
                                    )}-01`,
                                    consultations: monthTotal.consultations,
                                    revenue: monthTotal.revenue,
                                    completed: monthTotal.completed,
                                    pending: monthTotal.pending,
                                    cancelled: monthTotal.cancelled,
                                    month: monthKey,
                                });
                            }
                        }
                    }
                }

                if (allConsultations.length === 0) {
                    setDashboardData(null);
                    setIsLoading(false);
                    return;
                }

                // Tính toán các metrics
                const totalConsultations = allConsultations.reduce(
                    (sum, item) => sum + item.consultations,
                    0
                );
                const totalRevenue = allConsultations.reduce(
                    (sum, item) => sum + item.revenue,
                    0
                );
                const completedConsultations = allConsultations.reduce(
                    (sum, item) => sum + item.completed,
                    0
                );
                const pendingConsultations = allConsultations.reduce(
                    (sum, item) => sum + item.pending,
                    0
                );
                const cancelledConsultations = allConsultations.reduce(
                    (sum, item) => sum + item.cancelled,
                    0
                );

                // Xử lý chart data theo period type
                let chartData: Array<{
                    date: string;
                    consultations: number;
                    revenue: number;
                }>;
                if (selectedYear && !selectedMonth && !selectedWeek) {
                    // Năm: hiển thị theo tháng
                    chartData = allConsultations.map((item) => ({
                        date: item.date,
                        consultations: item.consultations,
                        revenue: item.revenue,
                    }));
                } else if (selectedYear && selectedMonth && !selectedWeek) {
                    // Tháng: hiển thị theo tuần
                    const monthData = (mockConsultationData as any)[
                        selectedYear
                    ]?.[selectedMonth];
                    if (monthData) {
                        chartData = Object.entries(monthData).map(
                            ([weekKey, weekData]: [string, any]) => {
                                const weekTotal = weekData.reduce(
                                    (sum: any, dayData: any) => ({
                                        consultations:
                                            sum.consultations +
                                            dayData.consultations,
                                        revenue: sum.revenue + dayData.revenue,
                                    }),
                                    { consultations: 0, revenue: 0 }
                                );

                                return {
                                    date: weekKey,
                                    consultations: weekTotal.consultations,
                                    revenue: weekTotal.revenue,
                                };
                            }
                        );
                    } else {
                        chartData = [];
                    }
                } else {
                    // Tuần: hiển thị theo ngày
                    chartData = allConsultations.map((item) => ({
                        date: item.date,
                        consultations: item.consultations,
                        revenue: item.revenue,
                    }));
                }

                setDashboardData({
                    summary: {
                        totalConsultations,
                        totalRevenue,
                        completedConsultations,
                        pendingConsultations,
                        cancelledConsultations,
                        completionRate:
                            totalConsultations > 0
                                ? (completedConsultations /
                                      totalConsultations) *
                                  100
                                : 0,
                    },
                    chartData,
                    consultationsByDate: {},
                    period: {
                        year: selectedYear,
                        month: selectedMonth,
                        week: selectedWeek,
                        fromDate: dateRange.fromDate,
                        toDate: dateRange.toDate,
                    },
                });
            } catch (error) {
                console.error("Error calculating dashboard data:", error);
                setDashboardData(null);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [doctorId, dateRange, selectedYear, selectedMonth, selectedWeek]);

    return {
        dashboardData,
        isLoading,
        refetch: () => {}, // Mock function
        dateRange,
    };
};

import { useState, useEffect, useMemo } from "react";
import { useGetYearlyStatistic } from "./use-get-yearly-statistic";
import { useGetMonthlyStatistic } from "./use-get-monthly-statistic";

interface UseConsultationDashboardProps {
    selectedYear: string;
    selectedMonth: string;
}

export const useConsultationDashboard = ({
    selectedYear,
    selectedMonth,
}: UseConsultationDashboardProps) => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Sử dụng 2 hook mới với enabled option
    const { 
        yearlyStatistic, 
        isPending: isYearlyPending, 
        isError: isYearlyError,
        refetch: refetchYearly
    } = useGetYearlyStatistic({
        year: parseInt(selectedYear) || 0,
    }, {
        enabled: !!selectedYear && !selectedMonth, // Chỉ gọi khi có năm và không có tháng
    });

    const { 
        monthlyStatistic, 
        isPending: isMonthlyPending, 
        isError: isMonthlyError,
        refetch: refetchMonthly
    } = useGetMonthlyStatistic({
        year: parseInt(selectedYear) || 0,
        month: parseInt(selectedMonth) || 0,
    }, {
        enabled: !!selectedYear && !!selectedMonth, // Chỉ gọi khi có cả năm và tháng
    });

    // Tính toán date range dựa trên selection
    const dateRange = useMemo(() => {
        if (!selectedYear) return null;

        if (selectedYear && selectedMonth) {
            // Nếu chọn tháng: sử dụng ngày đầu và cuối tháng
            const year = parseInt(selectedYear);
            const month = parseInt(selectedMonth);
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);

            return {
                fromDate: firstDay.toISOString().split("T")[0],
                toDate: lastDay.toISOString().split("T")[0],
            };
        } else if (selectedYear) {
            // Nếu chỉ chọn năm: sử dụng ngày đầu và cuối năm
            const year = parseInt(selectedYear);
            const firstDay = new Date(year, 0, 1);
            const lastDay = new Date(year, 11, 31);

            return {
                fromDate: firstDay.toISOString().split("T")[0],
                toDate: lastDay.toISOString().split("T")[0],
            };
        }

        return null;
    }, [selectedYear, selectedMonth]);

    // Transform data từ API response
    const transformApiData = (apiData: any, year: string, month: string) => {
        if (!apiData) return null;

        // Transform based on data structure
        if (apiData.months) {
            // Yearly data
            const chartData = apiData.months.map((monthData: any) => ({
                date: `Tháng ${monthData.month}`,
                consultations: monthData.totalConsultations,
                revenue: monthData.revenue,
            }));

            return {
                summary: {
                    totalConsultations: apiData.totalConsultations,
                    totalRevenue: apiData.totalRevenue,
                    completedConsultations: apiData.totalCompleted,
                    pendingConsultations: apiData.totalConsultations - apiData.totalCompleted - apiData.totalCanceled,
                    cancelledConsultations: apiData.totalCanceled,
                    completionRate: apiData.totalConsultations > 0 ? (apiData.totalCompleted / apiData.totalConsultations) * 100 : 0,
                },
                chartData,
                period: {
                    year,
                    month: "",
                    week: "",
                    fromDate: dateRange?.fromDate || `${year}-01-01`,
                    toDate: dateRange?.toDate || `${year}-12-31`,
                },
            };
        } else if (apiData.days) {
            // Monthly data - hiển thị tất cả các ngày trong tháng
            const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
            const chartData = [];
            
            // Tạo dữ liệu cho tất cả các ngày trong tháng
            for (let day = 1; day <= daysInMonth; day++) {
                const dayData = apiData.days.find((d: any) => d.day === day);
                
                if (dayData) {
                    // Nếu có dữ liệu cho ngày này
                    chartData.push({
                        date: `${day}/${month}`,
                        consultations: dayData.totalConsultations,
                        revenue: dayData.revenue,
                    });
                } else {
                    // Nếu không có dữ liệu, vẫn hiển thị với giá trị 0
                    chartData.push({
                        date: `${day}/${month}`,
                        consultations: 0,
                        revenue: 0,
                    });
                }
            }

            return {
                summary: {
                    totalConsultations: apiData.totalConsultations,
                    totalRevenue: apiData.totalRevenue,
                    completedConsultations: apiData.totalCompleted,
                    pendingConsultations: apiData.totalConsultations - apiData.totalCompleted - apiData.totalCanceled,
                    cancelledConsultations: apiData.totalCanceled,
                    completionRate: apiData.totalConsultations > 0 ? (apiData.totalCompleted / apiData.totalConsultations) * 100 : 0,
                },
                chartData,
                period: {
                    year,
                    month,
                    week: "",
                    fromDate: dateRange?.fromDate || `${year}-${month.toString().padStart(2, '0')}-01`,
                    toDate: dateRange?.toDate || `${year}-${month.toString().padStart(2, '0')}-${daysInMonth}`,
                },
            };
        }

        return null;
    };

    // Xử lý dữ liệu khi có thay đổi
    useEffect(() => {
        if (!selectedYear) {
            setDashboardData(null);
            return;
        }

        setIsLoading(true);

        try {
            let data;
            
            if (selectedYear && selectedMonth) {
                // Thống kê theo tháng
                if (monthlyStatistic && !isMonthlyError) {
                    data = monthlyStatistic;
                }
            } else if (selectedYear) {
                // Thống kê theo năm
                if (yearlyStatistic && !isYearlyError) {
                    data = yearlyStatistic;
                }
            }

            if (data) {
                // Transform data to match expected format
                const transformedData = transformApiData(data, selectedYear, selectedMonth);
                setDashboardData(transformedData);
            } else {
                setDashboardData(null);
            }
        } catch (error) {
            console.error("Error processing statistics:", error);
            setDashboardData(null);
        } finally {
            setIsLoading(false);
        }
    }, [selectedYear, selectedMonth, yearlyStatistic, monthlyStatistic, isYearlyError, isMonthlyError]);

    // Tính toán loading state
    const isLoadingState = isLoading || isYearlyPending || isMonthlyPending;

    // Hàm refetch để gọi lại API khi cần
    const refetch = () => {
        if (selectedYear && selectedMonth) {
            refetchMonthly();
        } else if (selectedYear) {
            refetchYearly();
        }
    };

    return {
        dashboardData,
        isLoading: isLoadingState,
        refetch,
        dateRange,
    };
};

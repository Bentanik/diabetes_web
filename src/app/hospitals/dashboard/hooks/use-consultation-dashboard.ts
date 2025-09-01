import { useState, useEffect, useMemo, useCallback } from "react";
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

    // Transform data từ API response - tối ưu hóa cho yearly data
    const transformApiData = useCallback((apiData: any, year: string, month: string) => {
        if (!apiData) return null;

        // Transform based on data structure
        if (apiData.months) {
            // Yearly data - tối ưu hóa cực đoan cho hiệu suất
            const monthMap = new Map();
            
            // Xử lý dữ liệu months một lần duy nhất và tối ưu hóa
            const months = apiData.months;
            const monthsLength = months.length;
            
            for (let i = 0; i < monthsLength; i++) {
                const monthData = months[i];
                monthMap.set(monthData.month, monthData);
            }

            // Pre-allocate array với kích thước cố định và tối ưu hóa vòng lặp
            const chartData = new Array(12);
            
            // Tạo chart data cho tất cả 12 tháng một cách hiệu quả nhất
            for (let m = 0; m < 12; m++) {
                const monthKey = m + 1;
                const monthData = monthMap.get(monthKey);
                
                chartData[m] = {
                    date: `Tháng ${monthKey}`,
                    consultations: monthData ? monthData.totalConsultations : 0,
                    revenue: monthData ? monthData.revenue : 0,
                };
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
                    month: "",
                    week: "",
                    fromDate: dateRange?.fromDate || `${year}-01-01`,
                    toDate: dateRange?.toDate || `${year}-12-31`,
                },
            };
        } else if (apiData.days) {
            // Monthly data - tối ưu hóa với Map và pre-allocate array
            const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
            const dayMap = new Map();
            
            // Tạo Map cho dữ liệu days để tìm kiếm nhanh hơn
            const days = apiData.days;
            const daysLength = days.length;
            
            for (let i = 0; i < daysLength; i++) {
                const dayData = days[i];
                dayMap.set(dayData.day, dayData);
            }

            // Pre-allocate array với kích thước cố định
            const chartData = new Array(daysInMonth);
            
            // Tạo dữ liệu cho tất cả các ngày trong tháng một cách hiệu quả
            for (let day = 0; day < daysInMonth; day++) {
                const dayKey = day + 1;
                const dayData = dayMap.get(dayKey);
                
                chartData[day] = {
                    date: `${dayKey}/${month}`,
                    consultations: dayData ? dayData.totalConsultations : 0,
                    revenue: dayData ? dayData.revenue : 0,
                };
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
    }, [dateRange]);

    // Xử lý dữ liệu khi có thay đổi - sử dụng useMemo để tối ưu hóa
    const processedData = useMemo(() => {
        if (!selectedYear) return null;

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
                return transformApiData(data, selectedYear, selectedMonth);
            }
            
            return null;
        } catch (error) {
            console.error("Error processing statistics:", error);
            return null;
        }
    }, [selectedYear, selectedMonth, yearlyStatistic, monthlyStatistic, isYearlyError, isMonthlyError, transformApiData]);

    // Cập nhật dashboard data khi processed data thay đổi
    useEffect(() => {
        setDashboardData(processedData);
    }, [processedData]);

    // Tính toán loading state - tối ưu hóa để hiển thị loading ngay lập tức
    const isLoadingState = useMemo(() => {
        if (selectedYear && selectedMonth) {
            return isMonthlyPending;
        } else if (selectedYear) {
            return isYearlyPending;
        }
        return false;
    }, [selectedYear, selectedMonth, isYearlyPending, isMonthlyPending]);

    // Hàm refetch để gọi lại API khi cần
    const refetch = useCallback(() => {
        if (selectedYear && selectedMonth) {
            refetchMonthly();
        } else if (selectedYear) {
            refetchYearly();
        }
    }, [selectedYear, selectedMonth, refetchMonthly, refetchYearly]);

    return {
        dashboardData,
        isLoading: isLoadingState,
        refetch,
        dateRange,
    };
};

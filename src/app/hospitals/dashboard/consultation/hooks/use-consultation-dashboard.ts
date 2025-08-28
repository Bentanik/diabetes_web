// import { useState, useEffect, useMemo } from "react";
// import { useGetConsultationsCursor } from "@/app/hospitals/consultation/create-consultation/hooks/use-get-consultation";

// interface WeekOption {
//     label: string;
//     value: string;
//     dates: string[];
//     weekStart: Date;
//     weekEnd: Date;
// }

// interface UseConsultationDashboardProps {
//     doctorId: string;
//     selectedYear: string;
//     selectedMonth: string;
//     selectedWeek: string;
//     selectedWeekData: WeekOption | undefined;
// }

// export const useConsultationDashboard = ({
//     doctorId,
//     selectedYear,
//     selectedMonth,
//     selectedWeek,
//     selectedWeekData,
// }: UseConsultationDashboardProps) => {
//     const [dashboardData, setDashboardData] = useState<any>(null);
//     const [isLoading, setIsLoading] = useState(false);

//     // Tính toán date range dựa trên selection
//     const dateRange = useMemo(() => {
//         if (!selectedYear) return null;

//         if (selectedYear && selectedMonth && selectedWeek && selectedWeekData) {
//             // Nếu chọn tuần: sử dụng ngày bắt đầu và kết thúc của tuần
//             return {
//                 fromDate: selectedWeekData.weekStart
//                     .toISOString()
//                     .split("T")[0],
//                 toDate: selectedWeekData.weekEnd.toISOString().split("T")[0],
//             };
//         } else if (selectedYear && selectedMonth) {
//             // Nếu chọn tháng: sử dụng ngày đầu và cuối tháng
//             const year = parseInt(selectedYear);
//             const month = parseInt(selectedMonth);
//             const firstDay = new Date(year, month - 1, 1);
//             const lastDay = new Date(year, month, 0);

//             return {
//                 fromDate: firstDay.toISOString().split("T")[0],
//                 toDate: lastDay.toISOString().split("T")[0],
//             };
//         } else if (selectedYear) {
//             // Nếu chỉ chọn năm: sử dụng ngày đầu và cuối năm
//             const year = parseInt(selectedYear);
//             const firstDay = new Date(year, 0, 1);
//             const lastDay = new Date(year, 11, 31);

//             return {
//                 fromDate: firstDay.toISOString().split("T")[0],
//                 toDate: lastDay.toISOString().split("T")[0],
//             };
//         }

//         return null;
//     }, [selectedYear, selectedMonth, selectedWeek, selectedWeekData]);

//     // Gọi API khi có thay đổi
//     const {
//         data: consultationData,
//         isLoading: isConsultationLoading,
//         refetch,
//     } = useGetConsultationsCursor(
//         { doctorId },
//         {
//             pageSize: 100, // Lấy nhiều data để tính toán dashboard
//             fromDate: dateRange?.fromDate || "",
//             toDate: dateRange?.toDate || "",
//         }
//     );

//     // Tính toán dashboard data
//     useEffect(() => {
//         if (!consultationData?.pages || !dateRange) {
//             setDashboardData(null);
//             return;
//         }

//         setIsLoading(true);

//         try {
//             const allConsultations = consultationData.pages.flatMap(
//                 (page) => page.data?.items ?? []
//             );

//             // Tính toán các metrics
//             const totalConsultations = allConsultations.length;
//             let totalRevenue = 0;
//             let completedConsultations = 0;
//             let pendingConsultations = 0;
//             let cancelledConsultations = 0;

//             // Giả sử mỗi consultation có giá 500,000 VND (có thể thay đổi theo business logic)
//             const consultationPrice = 500000;

//             allConsultations.forEach((consultationByDate) => {
//                 consultationByDate.consultationTemplates.forEach((template) => {
//                     // Tính revenue
//                     totalRevenue += consultationPrice;

//                     // Tính status counts
//                     switch (template.status) {
//                         case 1: // Completed
//                             completedConsultations++;
//                             break;
//                         case 2: // Pending
//                             pendingConsultations++;
//                             break;
//                         case 3: // Cancelled
//                             cancelledConsultations++;
//                             break;
//                         default:
//                             pendingConsultations++;
//                     }
//                 });
//             });

//             // Tính toán theo thời gian
//             const consultationsByDate = allConsultations.reduce(
//                 (acc, consultation) => {
//                     const date = consultation.date;
//                     if (!acc[date]) {
//                         acc[date] = {
//                             date,
//                             count: 0,
//                             revenue: 0,
//                         };
//                     }
//                     acc[date].count +=
//                         consultation.consultationTemplates.length;
//                     acc[date].revenue +=
//                         consultation.consultationTemplates.length *
//                         consultationPrice;
//                     return acc;
//                 },
//                 {} as Record<
//                     string,
//                     { date: string; count: number; revenue: number }
//                 >
//             );

//             const chartData = Object.values(consultationsByDate).map(
//                 (item) => ({
//                     date: item.date,
//                     consultations: item.count,
//                     revenue: item.revenue,
//                 })
//             );

//             setDashboardData({
//                 summary: {
//                     totalConsultations,
//                     totalRevenue,
//                     completedConsultations,
//                     pendingConsultations,
//                     cancelledConsultations,
//                     completionRate:
//                         totalConsultations > 0
//                             ? (completedConsultations / totalConsultations) *
//                               100
//                             : 0,
//                 },
//                 chartData,
//                 consultationsByDate,
//                 period: {
//                     year: selectedYear,
//                     month: selectedMonth,
//                     week: selectedWeek,
//                     fromDate: dateRange.fromDate,
//                     toDate: dateRange.toDate,
//                 },
//             });
//         } catch (error) {
//             console.error("Error calculating dashboard data:", error);
//             setDashboardData(null);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [
//         consultationData,
//         dateRange,
//         selectedYear,
//         selectedMonth,
//         selectedWeek,
//     ]);

//     // Refetch khi có thay đổi
//     useEffect(() => {
//         if (doctorId && dateRange) {
//             refetch();
//         }
//     }, [doctorId, dateRange, refetch]);

//     return {
//         dashboardData,
//         isLoading: isLoading || isConsultationLoading,
//         refetch,
//         dateRange,
//     };
// };

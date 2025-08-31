import { getMonthlyStatistics } from "@/services/dashboard/api-services";
import { useQuery } from "@tanstack/react-query";

export const GET_MONTHLY_STATISTIC_QUERY_KEY = "monthly-statistic";

export const useGetMonthlyStatistic = (params: REQUEST.MonthlyDashboardParams, options?: { enabled?: boolean }) => {
    const {
        data: monthlyStatistic,
        isPending,
        isError,
        error,
        refetch,
    } = useQuery<
        TResponseData<API.TGetMonthlyStatistics>,
        TMeta,
        API.TGetMonthlyStatistics
    >({
        queryKey: [GET_MONTHLY_STATISTIC_QUERY_KEY, params],
        queryFn: async () => {
            const res = await getMonthlyStatistics(params);
            if (res.data == null) {
                throw new Error("No data returned from get monthly statistic");
            }
            return res as TResponseData<API.TGetMonthlyStatistics>;
        },
        select: (data) => data.data ?? {
            month: 0,
            totalRevenue: 0,
            totalConsultations: 0,
            totalCompleted: 0,
            totalCanceled: 0,
            days: [],
        },
        staleTime: 0, // Luôn coi data là stale để gọi lại API mỗi lần
        gcTime: 0, // Không giữ cache để đảm bảo gọi API mới
        refetchOnWindowFocus: false, // Tắt refetch khi focus window
        refetchOnMount: true, // Luôn gọi lại khi mount
        refetchOnReconnect: true, // Gọi lại khi reconnect
        enabled: options?.enabled ?? true,
    });
    return { monthlyStatistic, isPending, isError, error, refetch };
};

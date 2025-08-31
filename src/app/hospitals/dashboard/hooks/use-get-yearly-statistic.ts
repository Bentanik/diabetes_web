import { getYearlyStatistics } from "@/services/dashboard/api-services";
import { useQuery } from "@tanstack/react-query";

export const GET_YEARLY_STATISTIC_QUERY_KEY = "yearly-statistic";

export const useGetYearlyStatistic = (params: REQUEST.YearlyDashboardParams, options?: { enabled?: boolean }) => {
    const {
        data: yearlyStatistic,
        isPending,
        isError,
        error,
        refetch,
    } = useQuery<
        TResponseData<API.TGetYearlyStatistics>,
        TMeta,
        API.TGetYearlyStatistics
    >({
        queryKey: [GET_YEARLY_STATISTIC_QUERY_KEY, params],
        queryFn: async () => {
            const res = await getYearlyStatistics(params);
            if (res.data == null) {
                throw new Error("No data returned from get yearly statistic");
            }
            return res as TResponseData<API.TGetYearlyStatistics>;
        },
        select: (data) => data.data ?? {
            year: 0,
            totalRevenue: 0,
            totalConsultations: 0,
            totalCompleted: 0,
            totalCanceled: 0,
            months: [],
        },
        staleTime: 0, // Luôn coi data là stale để gọi lại API mỗi lần
        gcTime: 0, // Không giữ cache để đảm bảo gọi API mới
        refetchOnWindowFocus: false, // Tắt refetch khi focus window
        refetchOnMount: true, // Luôn gọi lại khi mount
        refetchOnReconnect: true, // Gọi lại khi reconnect
        enabled: options?.enabled ?? true,
    });
    return { yearlyStatistic, isPending, isError, error, refetch };
};

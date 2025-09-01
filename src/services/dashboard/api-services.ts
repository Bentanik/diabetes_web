import API_ENDPOINTS from "@/services/dashboard/api-path";
import request from "@/services/interceptor";


export const getYearlyStatistics = async ({
    year,
}: REQUEST.YearlyDashboardParams) => {
    const params: Record<string, string | number> = {
        year,
    };

    const response = await request<TResponseData<API.TGetYearlyStatistics>>(
        API_ENDPOINTS.YEAR_DASHBOARD,
        {
            method: "GET",
            params,
        }
    );

    return response.data;
};

export const getMonthlyStatistics = async ({
    year,
    month,
}: REQUEST.MonthlyDashboardParams) => {
    const params: Record<string, string | number> = {
        year,
        month,
    };
    const response = await request<TResponseData<API.TGetMonthlyStatistics>>(
        API_ENDPOINTS.MONTH_DASHBOARD,
        {
            method: "GET",
            params,
        }
    );

    return response.data;
};

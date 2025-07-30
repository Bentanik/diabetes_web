import { getHospitals } from "@/services/hospital/api-services";
import { TMeta, TResponseData } from "@/typings";
import { useQuery } from "@tanstack/react-query";

export const GET_HOSPITALS_QUERY_KEY = "hospitals";

export const useGetHospitals = (params: REQUEST.GetHospitalsParams) => {
    const {
        data: hospitals,
        isPending,
        isError,
        error,
    } = useQuery<TResponseData<API.TGetHospitals>, TMeta, API.TGetHospitals>({
        queryKey: [GET_HOSPITALS_QUERY_KEY, params],
        queryFn: async () => {
            const res = await getHospitals(params);
            if (res.data == null) {
                throw new Error("No data returned from getConversations");
            }
            return res as TResponseData<API.TGetHospitals>;
        },

        select: (data) =>
            data.data ?? {
                items: [],
                pageIndex: 0,
                pageSize: 0,
                totalCount: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { hospitals, isPending, isError, error };
};

import { getDoctors } from "@/services/hospital/api-services";
import { useQuery } from "@tanstack/react-query";

export const GET_DOCTORS_QUERY_KEY = "doctors";

export const useGetDoctors = (params: REQUEST.GetDoctorsParams) => {
    const {
        data: doctors,
        isPending,
        isError,
        error,
    } = useQuery<TResponseData<API.TGetDoctors>, TMeta, API.TGetDoctors>({
        queryKey: [GET_DOCTORS_QUERY_KEY, params],
        queryFn: async () => {
            const res = await getDoctors(params);
            if (res.data == null) {
                throw new Error("No data returned from get doctors");
            }
            return res as TResponseData<API.TGetDoctors>;
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

    return { doctors, isPending, isError, error };
};

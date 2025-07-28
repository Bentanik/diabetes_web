import { getDoctors } from "@/services/doctor/api-services";
import { TMeta, TResponseData } from "@/typings";
import { useQuery } from "@tanstack/react-query";

export const GET_DOCTORS_CURSOR_QUERY_KEY = "doctors";

export const useGetDoctors = (params: REQUEST.GetDoctorsCursorParams) => {
    const {
        data: doctors,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetDoctorsCursor>,
        TMeta,
        API.TGetDoctorsCursor
    >({
        queryKey: [GET_DOCTORS_CURSOR_QUERY_KEY, params],
        queryFn: async () => {
            const res = await getDoctors(params);
            if (res.data == null) {
                throw new Error("No data returned from getConversations");
            }
            return res as TResponseData<API.TGetDoctorsCursor>;
        },

        select: (data) =>
            data.data ?? {
                items: [],
                pageSize: 10,
                nextCursor: "",
                hasNextPage: false,
            },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { doctors, isPending, isError, error };
};

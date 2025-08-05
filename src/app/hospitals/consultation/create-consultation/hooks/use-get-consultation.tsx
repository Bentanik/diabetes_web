import { getConsultations } from "@/services/consultation/api-services";
import { useQuery } from "@tanstack/react-query";

export const GET_CONSULTATIONS_QUERY_KEY = "consultations";

export const useGetConsultations = ({ doctorId }: REQUEST.DoctorId) => {
    const {
        data: consultations,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetConsultations>,
        TMeta,
        API.TGetConsultations
    >({
        queryKey: [GET_CONSULTATIONS_QUERY_KEY, doctorId],
        queryFn: async () => {
            const res = await getConsultations({ doctorId });
            if (res.data == null) {
                throw new Error("No data returned from get consultation");
            }
            return res as TResponseData<API.TGetConsultations>;
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

    return { consultations, isPending, isError, error };
};

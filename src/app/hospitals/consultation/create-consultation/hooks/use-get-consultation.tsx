import { getConsultationsCursor } from "@/services/consultation/api-services";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";

export const GET_CONSULTATIONS_QUERY_KEY = "consultations";

export const useGetConsultationsCursor = (
    { doctorId }: REQUEST.DoctorId,
    params: REQUEST.GetConsultationsCursorParams
) => {
    const { pageSize, fromDate, toDate } = params;

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery<
        TResponseData<API.TGetConsultations>,
        TMeta,
        InfiniteData<TResponseData<API.TGetConsultations>>,
        [string, string, REQUEST.GetConsultationsCursorParams]
    >({
        queryKey: [GET_CONSULTATIONS_QUERY_KEY, doctorId, params],
        queryFn: async ({ pageParam = "" }) => {
            const res = await getConsultationsCursor(
                { doctorId },
                {
                    pageSize,
                    fromDate,
                    toDate,
                    cursor: pageParam as string,
                }
            );
            return res;
        },
        initialPageParam: "",
        getNextPageParam: (lastPage) =>
            lastPage.data?.hasNextPage ? lastPage.data.nextCursor : undefined,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    return {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    };
};

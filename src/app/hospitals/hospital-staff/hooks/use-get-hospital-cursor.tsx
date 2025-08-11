import { getHospitalsCursor } from "@/services/hospital/api-services";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";

export const GET_HOSPITALS_CURSOR_QUERY_KEY = "hospitals_cursor";

export const useGetHospitalsCursor = (
    params: REQUEST.GetHospitalsCursorParams
) => {
    const { search, pageSize, sortBy, sortDirection } = params;

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<
        TResponseData<API.TGetHospitalsCursor>,
        TMeta,
        InfiniteData<TResponseData<API.TGetHospitalsCursor>>,
        [string, REQUEST.GetHospitalsCursorParams]
    >({
        queryKey: [GET_HOSPITALS_CURSOR_QUERY_KEY, params],
        queryFn: async ({ pageParam = "" }) => {
            const res = await getHospitalsCursor({
                search,
                pageSize,
                sortBy,
                sortDirection,
                cursor: pageParam as string,
            });
            return res;
        },
        initialPageParam: "",
        getNextPageParam: (lastPage) =>
            lastPage.data?.hasNextPage ? lastPage.data.nextCursor : undefined,
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
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
    };
};

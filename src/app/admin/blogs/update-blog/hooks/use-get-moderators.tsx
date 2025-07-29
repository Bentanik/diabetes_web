import { getModerators } from "@/services/moderator/api-services";
import { TMeta, TResponseData } from "@/typings";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";

export const GET_MODERATORS_CURSOR_QUERY_KEY = "moderators";

export const useGetModerators = (params: REQUEST.GetModeratorsCursorParams) => {
    const { search, gender, pageSize, sortBy, sortDirection } = params;

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<
        TResponseData<API.TGetModeratorsCursor>,
        TMeta,
        InfiniteData<TResponseData<API.TGetModeratorsCursor>>,
        [string, REQUEST.GetModeratorsCursorParams]
    >({
        queryKey: [GET_MODERATORS_CURSOR_QUERY_KEY, params],
        queryFn: async ({ pageParam = "" }) => {
            const res = await getModerators({
                search,
                gender,
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

import { getDoctors } from "@/services/doctor/api-services";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";

export const GET_DOCTORS_CURSOR_QUERY_KEY = "doctors";

export const useGetDoctors = (params: REQUEST.GetDoctorsCursorParams) => {
    const { search, gender, pageSize, position, sortBy, sortDirection } =
        params;

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<
        TResponseData<API.TGetDoctorsCursor>,
        TMeta,
        InfiniteData<TResponseData<API.TGetDoctorsCursor>>,
        [string, REQUEST.GetDoctorsCursorParams]
    >({
        queryKey: [GET_DOCTORS_CURSOR_QUERY_KEY, params],
        queryFn: async ({ pageParam = "" }) => {
            const res = await getDoctors({
                search,
                gender,
                pageSize,
                position,
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

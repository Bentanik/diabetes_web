import { getAllBlogs } from "@/services/blog/api-services";
import { useQuery } from "@tanstack/react-query";

export const GET_POSTS_QUERY_KEY = "blogs";

export const useGetBlogs = (params: REQUEST.BlogRequestParam) => {
    const {
        data: blogs,
        isPending,
        isError,
        error,
    } = useQuery<TResponseData<API.TGetBlogs>, TMeta, API.TGetBlogs>({
        queryKey: [GET_POSTS_QUERY_KEY, params],
        queryFn: async () => {
            const res = await getAllBlogs(params);
            if (res.data == null) {
                throw new Error("No data returned from getConversations");
            }
            return res as TResponseData<API.TGetBlogs>;
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

    return { blogs, isPending, isError, error };
};

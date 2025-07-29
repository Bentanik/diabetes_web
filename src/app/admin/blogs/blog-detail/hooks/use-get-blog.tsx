import { getBlog } from "@/services/blog/api-services";
import { TMeta, TResponseData } from "@/typings";
import { useQuery } from "@tanstack/react-query";

export const BLOG_DETAIL_QUERY_KEY = "blog_detail";

export const useGetBlogDetail = (params: REQUEST.BlogId) => {
    const {
        data: blog_detail,
        isPending,
        isError,
        error,
    } = useQuery<TResponseData<API.TGetBlog>, TMeta, API.TGetBlog | null>({
        queryKey: [BLOG_DETAIL_QUERY_KEY, params],
        queryFn: async () => {
            const res = await getBlog(params);
            if (res.data == null) {
                throw new Error("No data returned from get blog");
            }
            return res as TResponseData<API.TGetBlog>;
        },
        select: (data) => data.data,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { blog_detail, isPending, isError, error };
};

import { getCategories } from "@/services/category/api-services";
import { useQuery } from "@tanstack/react-query";

export const GET_CATEGORIES_QUERY_KEY = "categories";

export const useGetCategories = () => {
    const {
        data: categories,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetCategories>,
        TMeta,
        API.TGetCategories | null
    >({
        queryKey: [GET_CATEGORIES_QUERY_KEY],
        queryFn: async () => {
            const res = await getCategories();
            if (res.data == null) {
                throw new Error("No data returned from get categories");
            }
            return res as TResponseData<API.TGetCategories>;
        },
        select: (data) => data.data,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { categories, isPending, isError, error };
};

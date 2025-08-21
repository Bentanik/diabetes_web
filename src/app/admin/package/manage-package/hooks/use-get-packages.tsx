import { getPackages } from "@/services/package/api-services";
import { useQuery } from "@tanstack/react-query";

export const GET_PACKAGES_QUERY_KEY = "packages";

export const useGetPackages = (params: REQUEST.GetPackageParams) => {
    const {
        data: packages,
        isPending,
        isError,
        error,
    } = useQuery<TResponseData<API.TGetPackages>, TMeta, API.TGetPackages>({
        queryKey: [GET_PACKAGES_QUERY_KEY, params],
        queryFn: async () => {
            const res = await getPackages(params);
            if (res.data == null) {
                throw new Error("No data returned from get packages");
            }
            return res as TResponseData<API.TGetPackages>;
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

    return { packages, isPending, isError, error };
};

import API_ENDPOINTS from "@/services/package/api-path";
import request from "@/services/interceptor";

export const createPackageAsync = async (body: REQUEST.TCreatePackage) => {
    const response = await request<TResponse>(API_ENDPOINTS.CREATE_PACKAGE, {
        method: "POST",
        data: body,
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const getPackages = async ({
    search = "",
    pageIndex = 1,
    pageSize = 10,
    sortBy = "",
    sortDirection,
    isActive = true,
}: REQUEST.GetPackageParams) => {
    const params: Record<string, string | number | boolean> = {};
    params.pageIndex = pageIndex;
    params.pageSize = pageSize;

    if (search && search.trim() !== "") {
        params.search = search.trim();
    }
    if (sortBy && sortBy.trim() !== "") {
        params.sortBy = sortBy.trim();
    }
    if (sortDirection !== undefined) {
        params.sortDirection = sortDirection;
    }
    if (isActive !== undefined) {
        params.isActive = isActive;
    }
    const response = await request<TResponseData<API.TGetPackages>>(
        API_ENDPOINTS.GET_PACKAGES,
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : [],
        }
    );
    return response.data;
};

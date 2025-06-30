import API_ENDPOINTS from "@/services/blog/api-path";
import request from "@/services/interceptor";

export const createBlogAsync = async (body: FormData) => {
    const response = await request<TResponse>(API_ENDPOINTS.POST, {
        method: "POST",
        data: body,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getBlog = async ({ blogId }: REQUEST.BlogId) => {
    const response = await request<TResponseData<API.TGetBlog>>(
        API_ENDPOINTS.GET_POST,
        {
            method: "GET",
            params: { id: blogId },
        }
    );
    return response.data;
};

export const getAllBlogs = async ({
    searchContent = "",
    categoryIds = [],
    status,
    moderatorId = "",
    doctorId = "",
    isAdmin,
    pageIndex = 1,
    pageSize = 10,
    sortType = "",
    isSortAsc,
}: REQUEST.BlogRequestParam) => {
    const params: Record<string, any> = {};
    params.pageIndex = pageIndex;
    params.pageSize = pageSize;

    if (isAdmin !== undefined) {
        params.isAdmin = isAdmin;
    }
    if (searchContent && searchContent.trim() !== "") {
        params.searchContent = searchContent.trim();
    }
    if (categoryIds && categoryIds.length > 0) {
        params.categoryIds = categoryIds.join(",");
    }
    if (status !== undefined && status !== null) {
        params.status = status;
    }
    if (moderatorId && moderatorId.trim() !== "") {
        params.moderatorId = moderatorId.trim();
    }
    if (doctorId && doctorId.trim() !== "") {
        params.doctorId = doctorId.trim();
    }
    if (sortType && sortType.trim() !== "") {
        params.sortType = sortType.trim();
    }
    if (isSortAsc !== undefined) {
        params.isSortAsc = isSortAsc;
    }
    const response = await request<TResponseData<API.TGetBlogs>>(
        API_ENDPOINTS.GET_POSTS,
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : undefined,
        }
    );
    return response.data;
};

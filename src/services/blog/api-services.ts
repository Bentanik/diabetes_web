import API_ENDPOINTS from "@/services/blog/api-path";
import request from "@/services/interceptor";

export const createBlogAsync = async () => {
    const response = await request<TResponseData<API.TGetBlogId>>(
        API_ENDPOINTS.CREATE_POST,
        {
            method: "POST",
        }
    );
    return response.data;
};

export const deletePostAsync = async ({ blogId }: REQUEST.BlogId) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.DELETE_POST(blogId),
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

export const updateBlogAsync = async (
    { blogId }: REQUEST.BlogId,
    body: REQUEST.TUpdateBlog
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.UPDATE_POST(blogId),
        {
            method: "PUT",
            data: body,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

export const reviewBlogAsync = async (
    { blogId }: REQUEST.BlogId,
    body: { isApproved: boolean; reasonRejected: string }
) => {
    // Kiểm tra blogId hợp lệ
    if (!blogId) {
        throw new Error("blogId là bắt buộc");
    }

    try {
        const response = await request<TResponse>(
            API_ENDPOINTS.REVIEW_POST(blogId),
            {
                method: "PUT",
                data: body,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getBlog = async ({ blogId }: REQUEST.BlogId) => {
    const response = await request<TResponseData<API.TGetBlog>>(
        API_ENDPOINTS.GET_POST(blogId),
        {
            method: "GET",
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
    pageIndex = 1,
    pageSize = 10,
    sortType = "",
    isSortAsc,
}: REQUEST.BlogRequestParam) => {
    const params: Record<string, string | number | boolean> = {};
    params.pageIndex = pageIndex;
    params.pageSize = pageSize;

    if (searchContent && searchContent.trim() !== "") {
        params.searchContent = searchContent.trim();
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

    // Tạo query string thủ công
    let queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
        .join("&");

    // Xử lý categoryIds riêng biệt
    if (categoryIds && categoryIds.length > 0) {
        const categoryQuery = categoryIds
            .map((id) => `categoryIds=${encodeURIComponent(id)}`)
            .join("&");
        queryString = queryString
            ? `${queryString}&${categoryQuery}`
            : categoryQuery;
    }

    const response = await request<TResponseData<API.TGetBlogs>>(
        `${API_ENDPOINTS.GET_POSTS}?${queryString}`,
        {
            method: "GET",
        }
    );
    return response.data;
};

// export const getAllBlogs = async ({
//     searchContent = "",
//     categoryIds = [],
//     status,
//     moderatorId = "",
//     doctorId = "",
//     pageIndex = 1,
//     pageSize = 10,
//     sortType = "",
//     isSortAsc,
// }: REQUEST.BlogRequestParam) => {
//     const params: Record<
//         string,
//         string | number | boolean | string[] | undefined
//     > = {};
//     params.pageIndex = pageIndex;
//     params.pageSize = pageSize;

//     if (searchContent && searchContent.trim() !== "") {
//         params.searchContent = searchContent.trim();
//     }
//     if (status !== undefined && status !== null) {
//         params.status = status;
//     }
//     if (moderatorId && moderatorId.trim() !== "") {
//         params.moderatorId = moderatorId.trim();
//     }
//     if (doctorId && doctorId.trim() !== "") {
//         params.doctorId = doctorId.trim();
//     }
//     if (sortType && sortType.trim() !== "") {
//         params.sortType = sortType.trim();
//     }
//     if (isSortAsc !== undefined) {
//         params.isSortAsc = isSortAsc;
//     }
//     if (categoryIds && categoryIds.length > 0) {
//         categoryIds.forEach((id, index) => {
//             params[`CategoryIds[${index}]`] = id;
//         });
//     }

//     const response = await request<TResponseData<API.TGetBlogs>>(
//         API_ENDPOINTS.GET_POSTS,
//         {
//             method: "GET",
//             params: Object.keys(params).length > 0 ? params : undefined,
//         }
//     );
//     return response.data;
// };

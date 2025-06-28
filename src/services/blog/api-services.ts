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

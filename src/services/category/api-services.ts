import API_ENDPOINTS from "@/services/category/api-path";
import request from "@/services/interceptor";

export const getCategories = async () => {
    const response = await request<TResponse<API.TGetCategories>>(
        API_ENDPOINTS.GET_CATEGORIES_SYSTEM,
        {
            method: "GET",
        }
    );
    console.log("CategoryResponse" + response.data);
    return response.data;
};

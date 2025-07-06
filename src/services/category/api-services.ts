import API_ENDPOINTS from "@/services/category/api-path";
import request from "@/services/interceptor";

export const getCategories = async () => {
    const response = await request<TResponseData<API.TGetCategories>>(
        API_ENDPOINTS.CATEGORY,
        {
            method: "GET",
        }
    );
    console.log("CategoryResponse" + response.data);
    return response.data;
};

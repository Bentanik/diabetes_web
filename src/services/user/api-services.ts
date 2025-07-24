import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/user/api-path";
import { TResponseData } from "@/typings";

export const uploadImageUserAsync = async (body: FormData) => {
    const response = await request<TResponseData<API.TUploadImageUserResponse>>(
        API_ENDPOINTS.USER_MEDIA,
        {
            method: "POST",
            data: body,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

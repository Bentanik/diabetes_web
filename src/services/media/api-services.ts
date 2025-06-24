import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/media/api-path";

export const UploadImageAsync = async (body: FormData) => {
    const response = await request<{ value: API.TUploadImageResponse }>(
        API_ENDPOINTS.MEDIA,
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

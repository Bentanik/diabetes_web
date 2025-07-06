import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/media/api-path";

export const uploadImageAsync = async (body: FormData) => {
    const response = await request<TResponseData<API.TUploadImageResponse>>(
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

export const deleteImageAsync = async (body: REQUEST.TDeleteImage) => {
    const response = await request<TResponse>(API_ENDPOINTS.DELETE_IMAGE, {
        method: "DELETE",
        data: body,
    });
    return response.data;
};

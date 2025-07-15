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

export const uploadImageConversationAsync = async (body: FormData) => {
    const response = await request<
        TResponseData<API.TUploadConversationImageResponse>
    >(API_ENDPOINTS.CONVERSATION_MEDIA, {
        method: "POST",
        data: body,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

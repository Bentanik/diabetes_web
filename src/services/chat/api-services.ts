import API_ENDPOINTS from "@/services/chat/api-path";
import request from "@/services/interceptor";
import { TResponse } from "@/typings";

export const getChatHistoryAsync = async (
    session_id: string,
    limit: number = 20,
    skip: number = 0
) => {
    const response = await request<TResponse<API.TChatHistory>>(
        API_ENDPOINTS.CHAT_HISTORY,
        {
            method: "GET",
            params: {
                session_id,
                limit,
                skip,
            },
        }
    );

    return response.data;
};

export const sendMessageAsync = async (data: REQUEST.TSendMessage) => {
    const response = await request<TResponse<API.TChatMessageResponse>>(
        API_ENDPOINTS.CHAT,
        {
            method: "POST",
            data,
        }
    );

    return response.data;
};

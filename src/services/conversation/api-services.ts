import API_ENDPOINTS from "@/services/conversation/api-path";
import request from "@/services/interceptor";

export const getConversations = async () => {
    const response = await request<TResponseData<API.TGetConversations>>(
        API_ENDPOINTS.CONVERSATION,
        {
            method: "GET",
        }
    );
    return response.data;
};

export const createConversationAsync = async (
    body: REQUEST.TCreateConversation
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.CREATE_CONVERSATION,
        {
            method: "POST",
            data: body,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

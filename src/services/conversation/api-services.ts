import API_ENDPOINTS from "@/services/conversation/api-path";
import request from "@/services/interceptor";
import { TResponse, TResponseData } from "@/typings";

export const createConversationAsync = async (
    body: REQUEST.TCreateConversation
) => {
    const response = await request<TResponseData<API.ConversationId>>(
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

export const addMembersAsync = async (
    { conversationId }: REQUEST.ConversationId,
    body: REQUEST.AddMembers
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.ADD_MEMBERS(conversationId),
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

export const deleteConversationAsync = async ({
    conversationId,
}: REQUEST.ConversationId) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.DELETE_CONVERSATION(conversationId),
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

export const deleteParticipantAsync = async (
    { conversationId }: REQUEST.ConversationId,
    body: REQUEST.DeleteParticipant
) => {
    const params: Record<
        string,
        string | number | boolean | string[] | undefined
    > = {};

    if (body.participantId && body.participantId.trim() !== "") {
        params.participantId = body.participantId.trim();
    }

    const response = await request<TResponse>(
        API_ENDPOINTS.DELETE_PARTICIPANT(conversationId),
        {
            method: "DELETE",
            data: body,
            params: Object.keys(params).length > 0 ? params : [],
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

export const addDoctorAsync = async (
    { conversationId }: REQUEST.ConversationId,
    body: REQUEST.AddDoctor
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.ADD_DOCTOR(conversationId),
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

export const updateConversationAsync = async (
    { conversationId }: REQUEST.ConversationId,
    body: REQUEST.TUpdateConversation
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.UPDATE_CONVERSATION(conversationId),
        {
            method: "PATCH",
            data: body,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

export const addStaffAsync = async (
    { conversationId }: REQUEST.ConversationId,
    body: REQUEST.AddStaff
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.ADD_STAFF(conversationId),
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

export const getUserAvailable = async (
    { conversationId }: REQUEST.ConversationId,
    {
        role,
        pageIndex = 1,
        pageSize = 10,
        search = "",
    }: REQUEST.UserAvailableRequestParam
) => {
    const params: Record<
        string,
        string | number | boolean | string[] | undefined
    > = {};
    params.pageIndex = pageIndex;
    params.pageSize = pageSize;

    if (search && search.trim() !== "") {
        params.search = search.trim();
    }
    if (role !== undefined && role !== null) {
        params.role = role;
    }
    const response = await request<TResponseData<API.TGetUserAvailable>>(
        API_ENDPOINTS.GET_AVAILABLE_USERS(conversationId),
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : undefined,
        }
    );
    return response.data;
};

export const getConversations = async ({
    pageIndex = 1,
    pageSize = 10,
    sortBy = "date",
    direction = 1,
    search = "",
}: REQUEST.ConversationsParams) => {
    const params: Record<
        string,
        string | number | boolean | string[] | undefined
    > = {};
    params.pageIndex = pageIndex;
    params.pageSize = pageSize;

    if (search && search.trim() !== "") {
        params.search = search.trim();
    }
    if (sortBy && sortBy.trim() !== "") {
        params.sortBy = sortBy.trim();
    }
    if (direction !== undefined) {
        params.direction = direction;
    }
    const response = await request<TResponseData<API.TGetConversations>>(
        API_ENDPOINTS.GET_CONVERSATIONS,
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : [],
        }
    );
    return response.data;
};

export const getConversationDetail = async (
    { conversationId }: REQUEST.ConversationId,
    {
        pageIndex = 1,
        pageSize = 10,
        sortBy = "name",
        direction = 1,
        search = "",
    }: REQUEST.ConversationsParams
) => {
    const params: Record<
        string,
        string | number | boolean | string[] | undefined
    > = {};
    params.pageIndex = pageIndex;
    params.pageSize = pageSize;

    if (search && search.trim() !== "") {
        params.search = search.trim();
    }
    if (sortBy && sortBy.trim() !== "") {
        params.sortBy = sortBy.trim();
    }
    if (direction !== undefined) {
        params.direction = direction;
    }
    const response = await request<TResponseData<API.TGetConversationDetail>>(
        API_ENDPOINTS.GET_CONVERSATION(conversationId),
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : [],
        }
    );
    return response.data;
};

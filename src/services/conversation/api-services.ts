import API_ENDPOINTS from "@/services/conversation/api-path";
import request from "@/services/interceptor";

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
    groupId: string,
    body: REQUEST.AddMembers
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.ADD_MEMBERS(groupId),
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

export const deleteConversationAsync = async (groupId: string) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.DELETE_CONVERSATION(groupId),
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

export const addDoctorAsync = async (
    groupId: string,
    body: REQUEST.AddDoctor
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.ADD_DOCTOR(groupId),
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

export const addStaffAsync = async (
    groupId: string,
    body: REQUEST.AddStaff
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.ADD_STAFF(groupId),
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

export const getUserAvailable = async ({
    conversationId = " ",
    role,
    pageIndex = 1,
    pageSize = 10,
    sortType = "",
    isSortDesc,
    search = "",
}: REQUEST.UserAvailableRequestParam) => {
    const params: Record<
        string,
        string | number | boolean | string[] | undefined
    > = {};
    params.pageIndex = pageIndex;
    params.pageSize = pageSize;

    if (search && search.trim() !== "") {
        params.searchContent = search.trim();
    }
    if (role !== undefined && role !== null) {
        params.role = role;
    }
    if (conversationId && conversationId.trim() !== "") {
        params.conversationId = conversationId.trim();
    }
    if (sortType && sortType.trim() !== "") {
        params.sortType = sortType.trim();
    }
    if (isSortDesc !== undefined) {
        params.isSortAsc = isSortDesc;
    }
    const response = await request<TResponseData<API.TGetUserAvailable>>(
        API_ENDPOINTS.GET_AVAILABLE_USERS,
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
    groupId: string,
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
        API_ENDPOINTS.GET_CONVERSATION(groupId),
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : undefined,
        }
    );
    return response.data;
};

import { getConversations } from "@/services/conversation/api-services";
import { TMeta, TResponseData } from "@/typings";
import { useQuery } from "@tanstack/react-query";

export const GET_CONVERSATIONS_QUERY_KEY = "conversations";

export const useGetConversations = (params: REQUEST.ConversationsParams) => {
    const {
        data: conversations,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetConversations>,
        TMeta,
        API.TGetConversations
    >({
        queryKey: [GET_CONVERSATIONS_QUERY_KEY, params],
        queryFn: async () => {
            const res = await getConversations(params);
            if (res.data == null) {
                throw new Error("No data returned from getConversations");
            }
            return res as TResponseData<API.TGetConversations>;
        },
        select: (data) =>
            data.data ?? {
                items: [],
                pageIndex: 0,
                pageSize: 0,
                totalCount: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { conversations, isPending, isError, error };
};

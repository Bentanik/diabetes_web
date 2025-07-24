import { useQuery } from "@tanstack/react-query";
import { getConversationDetail } from "@/services/conversation/api-services";
import { TMeta, TResponseData } from "@/typings";

export const CONVERSATION_DETAIL_QUERY_KEY = "conversation_detail";

export const useGetConversationDetail = (
    { conversationId }: REQUEST.ConversationId,
    params: REQUEST.ConversationsParams
) => {
    const {
        data: conversation_detail,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetConversationDetail>,
        TMeta,
        API.TGetConversationDetail
    >({
        queryKey: [CONVERSATION_DETAIL_QUERY_KEY, params, conversationId],
        queryFn: async () => {
            const res = await getConversationDetail({ conversationId }, params);
            if (res.data == null) {
                throw new Error("No data returned from getConversations");
            }
            return res as TResponseData<API.TGetConversationDetail>;
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

    return { conversation_detail, isPending, isError, error };
};

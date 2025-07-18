import { useQuery } from "@tanstack/react-query";
import { getConversationDetail } from "@/services/conversation/api-services";

export const useGetConversationDetail = (
    { conversationId }: REQUEST.ConversationId,
    params: REQUEST.ConversationsParams
) => {
    const {
        data: conversationDetail,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetConversationDetail>,
        TMeta,
        API.TGetConversationDetail
    >({
        queryKey: ["GET_CONVERSATION", params, conversationId],
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

    return { conversationDetail, isPending, isError, error };
};

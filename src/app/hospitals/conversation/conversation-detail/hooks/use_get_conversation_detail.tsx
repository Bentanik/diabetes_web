import { useQuery } from "@tanstack/react-query";
import { getConversation } from "@/services/conversation/api-services";

export const CONVERSATION_QUERY_KEY = "conversation";

export const useGetConversation = ({
    conversationId,
}: REQUEST.ConversationId) => {
    const {
        data: conversation,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetConversation>,
        TMeta,
        API.TGetConversation | null
    >({
        queryKey: [CONVERSATION_QUERY_KEY, conversationId],
        queryFn: async () => {
            const res = await getConversation({ conversationId });
            if (res.data == null) {
                throw new Error(
                    "No data returned from get conversation detail"
                );
            }
            return res as TResponseData<API.TGetConversation>;
        },
        select: (data) => data.data,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { conversation, isPending, isError, error };
};

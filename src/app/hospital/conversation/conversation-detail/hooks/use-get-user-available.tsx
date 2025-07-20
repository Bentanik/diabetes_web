import { getUserAvailable } from "@/services/conversation/api-services";
import { TMeta, TResponseData } from "@/typings";
import { useQuery } from "@tanstack/react-query";

export const USER_AVAILABLE_QUERY_KEY = "user_available";

export const useGetUserAvailable = (
    { conversationId }: REQUEST.ConversationId,
    params: REQUEST.UserAvailableRequestParam
) => {
    const {
        data: user_available,
        isPending,
        isError,
        error,
    } = useQuery<
        TResponseData<API.TGetUserAvailable>,
        TMeta,
        API.TGetUserAvailable
    >({
        queryKey: [USER_AVAILABLE_QUERY_KEY, params, conversationId],
        queryFn: async () => {
            const res = await getUserAvailable({ conversationId }, params);
            if (res.data == null) {
                throw new Error("No data returned from getConversations");
            }
            return res as TResponseData<API.TGetUserAvailable>;
        },
        select: (data) =>
            data.data ?? {
                items: [],
                pageIndex: 0,
                pageSize: 0,
                totalCount: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { user_available, isPending, isError, error };
};

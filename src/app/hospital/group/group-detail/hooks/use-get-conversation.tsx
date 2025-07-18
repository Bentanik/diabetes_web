import { useQuery } from "@tanstack/react-query";
import { getConversationDetail } from "@/services/conversation/api-services";
import { useBackdrop } from "@/context/backdrop_context";

export default function useGetConversationDetail(
    groupId: string,
    params: REQUEST.ConversationsParams
) {
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["conversationDetail", groupId, params],
        queryFn: async () => {
            showBackdrop();
            try {
                const res = await getConversationDetail(groupId, params);
                if (res.data != null) {
                    return res as TResponseData<API.TGetConversationDetail>;
                } else {
                    throw new Error("Fail to fetch application");
                }
            } finally {
                hideBackdrop();
            }
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { conversationDetail: data?.data?.items, isPending, isError, error };
}

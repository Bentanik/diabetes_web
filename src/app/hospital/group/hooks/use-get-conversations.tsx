import useToast from "@/hooks/use-toast";
import { getConversations } from "@/services/conversation/api-services";
import { useQuery } from "@tanstack/react-query";

export const useGetConversations = (params: REQUEST.ConversationsParams) => {
    const {
        data: conversations,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ["GetConversations", params],
        queryFn: async () => {
            try {
                const res = await getConversations(params);
                if (res.data != null) {
                    return res as TResponseData<API.TGetConversations>;
                }
            } catch {}
        },
        select: (data) => {
            if (!data?.data) {
                return [];
            }
            return data.data.items || [];
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { conversations, isPending, isError, error };
};

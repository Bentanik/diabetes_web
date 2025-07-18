import { useBackdrop } from "@/context/backdrop_context";
import { useServiceDeleteConversation } from "@/services/conversation/services";
import { useQueryClient } from "@tanstack/react-query";
import { GET_CONVERSATIONS_QUERY_KEY } from "@/app/hospital/conversation/hooks/use-get-conversations";

export default function useDeleteConversation({
    conversationId,
}: REQUEST.ConversationId) {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useServiceDeleteConversation({
        conversationId,
    });
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const onSubmit = (onLoadData: () => void) => {
        showBackdrop();
        mutate(undefined, {
            onSuccess: async () => {
                onLoadData();
                hideBackdrop();
                await queryClient.invalidateQueries({
                    queryKey: [GET_CONVERSATIONS_QUERY_KEY],
                });
            },
            onError: () => {
                hideBackdrop();
            },
        });
    };

    return {
        onSubmit,
        isPending,
    };
}

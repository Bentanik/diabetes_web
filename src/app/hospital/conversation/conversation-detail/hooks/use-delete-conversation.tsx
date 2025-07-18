import { useBackdrop } from "@/context/backdrop_context";
import { useServiceDeleteConversation } from "@/services/conversation/services";

export default function useDeleteConversation({
    conversationId,
}: REQUEST.ConversationId) {
    const { mutate, isPending } = useServiceDeleteConversation({
        conversationId,
    });
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const onSubmit = (onLoadData: () => void) => {
        showBackdrop();
        mutate(undefined, {
            onSuccess: () => {
                onLoadData();
                hideBackdrop();
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

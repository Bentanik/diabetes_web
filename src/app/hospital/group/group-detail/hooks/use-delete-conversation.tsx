import { useBackdrop } from "@/context/backdrop_context";
import { useServiceDeleteConversation } from "@/services/conversation/services";

export default function useDeleteConversation(groupId: string) {
    const { mutate, isPending } = useServiceDeleteConversation(groupId);
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

"use client";

import { useBackdrop } from "@/context/backdrop_context";
import { useServiceDeleteParticipant } from "@/services/conversation/services";
import { useQueryClient } from "@tanstack/react-query";
import { CONVERSATION_DETAIL_QUERY_KEY } from "./use-get-conversation";

export default function useDeleteParticipant({
    conversationId,
}: REQUEST.ConversationId) {
    const { mutate, isPending } = useServiceDeleteParticipant({
        conversationId,
    });
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = (
        data: REQUEST.DeleteParticipant,
        onLoadData: () => void
    ) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async (res) => {
                hideBackdrop();
                onLoadData();
                console.log("API Success:", res);
                await queryClient.invalidateQueries({
                    queryKey: [CONVERSATION_DETAIL_QUERY_KEY],
                });
            },
            onError: (err) => {
                hideBackdrop();
                console.log("API Fail:", err);
            },
        });
    };
    return {
        onSubmit,
        isPending,
    };
}

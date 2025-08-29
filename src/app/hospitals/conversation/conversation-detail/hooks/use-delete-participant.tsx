"use client";

import { useBackdrop } from "@/context/backdrop_context";
import { useServiceDeleteParticipant } from "@/services/conversation/services";
import { useQueryClient } from "@tanstack/react-query";
import { CONVERSATION_DETAIL_QUERY_KEY } from "./use-get-conversation";
import { GET_CONVERSATIONS_QUERY_KEY } from "../../hooks/use-get-conversations";

export default function useDeleteParticipant(
    { conversationId }: REQUEST.ConversationId,
    { memberId }: REQUEST.MemberId
) {
    const { mutate, isPending } = useServiceDeleteParticipant(
        {
            conversationId,
        },
        { memberId }
    );
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = () => {
        showBackdrop();
        mutate(undefined, {
            onSuccess: async (res) => {
                hideBackdrop();
                console.log("API Success:", res);
                await queryClient.invalidateQueries({
                    queryKey: [CONVERSATION_DETAIL_QUERY_KEY],
                });
                await queryClient.invalidateQueries({
                    queryKey: [GET_CONVERSATIONS_QUERY_KEY],
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

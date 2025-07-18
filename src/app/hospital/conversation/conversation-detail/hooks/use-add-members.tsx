"use client";

import { useBackdrop } from "@/context/backdrop_context";
import { useServiceAddMembers } from "@/services/conversation/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CONVERSATION_DETAIL_QUERY_KEY } from "./use-get-conversation";
import { useQueryClient } from "@tanstack/react-query";

export const addMembersSchema = z.object({
    userIds: z.array(z.string()).min(1, "Phải chọn ít nhất 1 thành viên"),
});

export type AddMembersFormData = z.infer<typeof addMembersSchema>;

export default function useAddMembers({
    conversationId,
}: REQUEST.ConversationId) {
    const form = useForm<AddMembersFormData>({
        resolver: zodResolver(addMembersSchema),
        defaultValues: {
            userIds: [],
        },
    });

    const { mutate, isPending } = useServiceAddMembers({ conversationId });
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = (data: REQUEST.AddMembers) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async (res) => {
                hideBackdrop();
                console.log("API Success:", res);
                await queryClient.invalidateQueries({
                    queryKey: [CONVERSATION_DETAIL_QUERY_KEY],
                });
                form.reset();
            },
            onError: (err) => {
                hideBackdrop();
                console.log("API Fail:", err);
            },
        });
    };
    return {
        onSubmit,
        form,
        isPending,
    };
}

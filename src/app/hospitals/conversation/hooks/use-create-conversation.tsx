import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateConversation } from "@/services/conversation/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { GET_CONVERSATIONS_QUERY_KEY } from "./use-get-conversations";

export const createConversationSchema = z.object({
    name: z
        .string()
        .min(1, "Phải nhập tên nhóm")
        .max(100, "Tên nhóm không được quá 100 kí tự"),

    avatarId: z.string(),
});

export type ConversationFormData = z.infer<typeof createConversationSchema>;

export default function useCreateConversation() {
    const form = useForm<ConversationFormData>({
        resolver: zodResolver(createConversationSchema),
        defaultValues: {
            name: "",
            avatarId: "",
        },
    });

    const { mutate, isPending } = useServiceCreateConversation();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = (
        data: REQUEST.TCreateConversation,
        onLoadData: () => void
    ) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async (res) => {
                hideBackdrop();
                onLoadData();
                await queryClient.invalidateQueries({
                    queryKey: [GET_CONVERSATIONS_QUERY_KEY],
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

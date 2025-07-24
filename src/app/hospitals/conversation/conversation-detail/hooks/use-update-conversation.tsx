import { useBackdrop } from "@/context/backdrop_context";
import { useServiceUpdateConversation } from "@/services/conversation/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { GET_CONVERSATIONS_QUERY_KEY } from "../../hooks/use-get-conversations";

export const updateConversationSchema = z.object({
    name: z
        .string()
        .min(1, "Phải nhập tên nhóm")
        .max(100, "Tên nhóm không được quá 100 kí tự"),

    avatarId: z.string(),
});

export type ConversationFormData = z.infer<typeof updateConversationSchema>;

export default function useUpdateConversation({
    conversationId,
}: REQUEST.ConversationId) {
    const form = useForm<ConversationFormData>({
        resolver: zodResolver(updateConversationSchema),
        defaultValues: {
            name: "",
            avatarId: "",
        },
    });

    const router = useRouter();

    const { mutate, isPending } = useServiceUpdateConversation({
        conversationId,
    });
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = (
        data: REQUEST.TUpdateConversation,
        onLoadData: () => void
    ) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async (res) => {
                hideBackdrop();
                onLoadData;
                await queryClient.invalidateQueries({
                    queryKey: [GET_CONVERSATIONS_QUERY_KEY],
                });
                form.reset();
                setTimeout(() => {
                    router.push("/hospital/conversation");
                }, 500);
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

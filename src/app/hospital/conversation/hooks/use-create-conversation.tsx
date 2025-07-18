import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateConversation } from "@/services/conversation/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

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

    const router = useRouter();

    const { mutate, isPending } = useServiceCreateConversation();
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const onSubmit = (data: REQUEST.TCreateConversation) => {
        showBackdrop();
        mutate(data, {
            onSuccess: (res) => {
                hideBackdrop();
                console.log("API Success:", res);
                const conversationId = res.data?.conversationId;
                if (conversationId) {
                    router.push(
                        `/hospital/group/group-detail/${conversationId}`
                    );
                }
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

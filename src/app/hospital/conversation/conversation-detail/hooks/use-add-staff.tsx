import { useBackdrop } from "@/context/backdrop_context";
import { useServiceAddStaff } from "@/services/conversation/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CONVERSATION_DETAIL_QUERY_KEY } from "./use-get-conversation";

import { z } from "zod";

export const addStaffSchema = z.object({
    adminId: z.string().trim().min(1, "Phải chọn nhân viên để thêm vào"),
});

export type AddStaffFormData = z.infer<typeof addStaffSchema>;

export default function useAddStaff({
    conversationId,
}: REQUEST.ConversationId) {
    const form = useForm<AddStaffFormData>({
        resolver: zodResolver(addStaffSchema),
        defaultValues: {
            adminId: "",
        },
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useServiceAddStaff({ conversationId });
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const onSubmit = (data: REQUEST.AddStaff) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async (res) => {
                hideBackdrop();
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

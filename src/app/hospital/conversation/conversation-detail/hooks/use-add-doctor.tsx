import { useBackdrop } from "@/context/backdrop_context";
import { useServiceAddDoctor } from "@/services/conversation/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CONVERSATION_DETAIL_QUERY_KEY } from "./use-get-conversation";

export const addDoctorSchema = z.object({
    doctorId: z.string().trim().min(1, "Phải chọn bác sĩ để thêm vào"),
});

export type AddDoctorFormData = z.infer<typeof addDoctorSchema>;

export default function useAddDoctor({
    conversationId,
}: REQUEST.ConversationId) {
    const form = useForm<AddDoctorFormData>({
        resolver: zodResolver(addDoctorSchema),
        defaultValues: {
            doctorId: "",
        },
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useServiceAddDoctor({ conversationId });
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const onSubmit = (data: REQUEST.AddDoctor) => {
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

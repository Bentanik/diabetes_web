import { useBackdrop } from "@/context/backdrop_context";
import { useServiceAddDoctor } from "@/services/conversation/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

    const { mutate, isPending } = useServiceAddDoctor({ conversationId });
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const onSubmit = (data: REQUEST.AddDoctor) => {
        showBackdrop();
        mutate(data, {
            onSuccess: (res) => {
                hideBackdrop();
                console.log("API Success:", res);
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

import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateConsultation } from "@/services/consultation/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const consultationSchema = z.object({
    timeTemplates: z
        .array(
            z.object({
                date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
                    message: "Ngày phải có định dạng YYYY-MM-DD",
                }),
                times: z
                    .array(
                        z.object({
                            start: z
                                .string()
                                .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
                                    message:
                                        "Thời gian bắt đầu phải có định dạng HH:mm (00:00-23:59)",
                                }),
                            end: z
                                .string()
                                .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
                                    message:
                                        "Thời gian kết thúc phải có định dạng HH:mm (00:00-23:59)",
                                }),
                        })
                    )
                    .min(1, "Phải có ít nhất một khoảng thời gian"),
            })
        )
        .min(1, "Phải có ít nhất một template thời gian"),
});

export type ConsultationFormData = z.infer<typeof consultationSchema>;

export default function useCreateConsultation({ doctorId }: REQUEST.DoctorId) {
    const form = useForm<ConsultationFormData>({
        resolver: zodResolver(consultationSchema),
        defaultValues: {
            timeTemplates: [],
        },
    });

    const { mutate, isPending } = useServiceCreateConsultation({ doctorId });
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = (data: ConsultationFormData, onLoadData: () => void) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async () => {
                hideBackdrop();
                onLoadData();
                // await queryClient.invalidateQueries({
                //     queryKey: [GET_DOCTORS_QUERY_KEY],
                // });
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

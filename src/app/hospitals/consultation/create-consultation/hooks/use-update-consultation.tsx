import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBackdrop } from "@/context/backdrop_context";
import { useServiceUpdateConsultation } from "@/services/consultation/services";
import { zodResolver } from "@hookform/resolvers/zod";
import useToast from "@/hooks/use-toast";
import { GET_CONSULTATIONS_QUERY_KEY } from "./use-get-consultation";

export const timeRangeSchema = z.object({
    start: z.string().nonempty("Thời gian bắt đầu không được để trống"),
    end: z.string().nonempty("Thời gian kết thúc không được để trống"),
});

export const upsertTimeTemplateSchema = z.object({
    timeTemplateId: z.string().nullable(),
    date: z.string().nonempty("Ngày không được để trống"),
    timeRange: timeRangeSchema,
});

export const updateTimeTemplateSchema = z.object({
    status: z.number().min(0, "Trạng thái không hợp lệ"),
    upsertTimeTemplates: z
        .array(upsertTimeTemplateSchema)
        .min(1, "Phải có ít nhất một mẫu thời gian"),
    templateIdsToDelete: z.array(z.string()),
});

export type TimeTemplateFormData = z.infer<typeof updateTimeTemplateSchema>;

export default function useUpdateConsultation({ doctorId }: REQUEST.DoctorId) {
    const form = useForm<TimeTemplateFormData>({
        resolver: zodResolver(updateTimeTemplateSchema),
        defaultValues: {
            status: 0,
            upsertTimeTemplates: [],
            templateIdsToDelete: [],
        },
    });

    const { mutate, isPending } = useServiceUpdateConsultation({ doctorId });
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    const onSubmit = (data: TimeTemplateFormData) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: [GET_CONSULTATIONS_QUERY_KEY],
                });
                hideBackdrop();
                form.reset();
                addToast({
                    type: "success",
                    description: "Cập nhật cuộc tư vấn thành công",
                    duration: 5000,
                });
            },
            onError: (err) => {
                hideBackdrop();
                addToast({
                    type: "error",
                    description: err.title || "Cập nhật cuộc tư vấn thất bại",
                    duration: 5000,
                });
            },
        });
    };

    return {
        onSubmit,
        form,
        isPendingUpdate: isPending,
    };
}

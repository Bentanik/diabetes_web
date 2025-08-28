import useToast from "@/hooks/use-toast";
import {
    createConsultationAsync,
    updateConsultationAsync,
} from "@/services/consultation/api-services";
import { useMutation } from "@tanstack/react-query";

export const useServiceCreateConsultation = ({
    doctorId,
}: REQUEST.DoctorId) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TCreateConsultation>({
        mutationFn: async (data: REQUEST.TCreateConsultation) => {
            const response = await createConsultationAsync(
                { doctorId },
                {
                    timeTemplates: data.timeTemplates,
                }
            );
            return response as TResponse;
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Tạo cuộc tư vấn thành công",
                duration: 2000,
            });
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Tạo cuộc tư vấn thất bại!",
                duration: 2000,
            });
        },
    });
};

export const useServiceUpdateConsultation = ({
    doctorId,
}: REQUEST.DoctorId) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TUpdateTimeTemplateRequest>({
        mutationFn: async (data: REQUEST.TUpdateTimeTemplateRequest) => {
            return await updateConsultationAsync({ doctorId }, data);
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Cập nhật cuộc tư vấn thành công",
                duration: 2000,
            });
        },
        onError: (err) => {
            addToast({
                type: "error",
                description: err.title,
                duration: 2000,
            });
        },
    });
};

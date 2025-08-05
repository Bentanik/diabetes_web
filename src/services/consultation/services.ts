import useToast from "@/hooks/use-toast";
import { createConsultationAsync } from "@/services/consultation/api-services";
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
                duration: 5000,
            });
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Tạo cuộc tư vấn thất bại!",
                duration: 5000,
            });
        },
    });
};

import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createDoctorAsync } from "./api-services";

export const useServiceCreateDoctor = () => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TCreateDoctor>({
        mutationFn: async (data: REQUEST.TCreateDoctor) => {
            return await createDoctorAsync(data);
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Tạo bác sĩ thành công",
                duration: 5000,
            });
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Tạo bác sĩ thất bại! Hãy thử lại",
                duration: 5000,
            });
        },
    });
};

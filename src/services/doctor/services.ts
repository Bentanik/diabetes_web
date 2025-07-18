import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createDoctorAsync } from "./api-services";
import { TMeta, TResponse } from "@/typings";

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
        onError: (err) => {
            // const errorMessages = err.errors
            //     .flat()
            //     .map((e) => e.message)
            //     .join(", ");

            addToast({
                type: "error",
                description: err.title,
                duration: 5000,
            });
        },
    });
};

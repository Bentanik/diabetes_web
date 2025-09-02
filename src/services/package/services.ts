import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createPackageAsync } from "./api-services";

export const useServiceCreatePackage = () => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TCreatePackage>({
        mutationFn: async (data: REQUEST.TCreatePackage) => {
            const response = await createPackageAsync({
                name: data.name,
                description: data.description,
                price: data.price,
                sessions: data.sessions,
                durations: data.durations,
            });
            return response as TResponse;
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Tạo gói tư vấn thành công",
                duration: 5000,
            });
        },
    });
};

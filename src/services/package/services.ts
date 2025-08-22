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
                durationInMonths: data.durationInMonths,
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

        // onError: (error: TMeta) => {
        //     error.errors?.forEach((error) => {
        //         console.log(error);

        //         if (error.code === "hospital_error_01") {
        //             addToast({
        //                 type: "error",
        //                 description:
        //                     "Số điện thoại không được trùng. Vui lòng nhập lại !",
        //                 duration: 5000,
        //             });
        //         }
        //         if (error.code === "hospital_error_02") {
        //             addToast({
        //                 type: "error",
        //                 description:
        //                     "Email  không được trùng. Vui lòng nhập lại !",
        //                 duration: 5000,
        //             });
        //         }
        //     });
        // },
    });
};

import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createHospitalStaffAsync } from "./api-services";

export const useServiceCreateHospitalStaff = () => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TCreateHospitalStaff>({
        mutationFn: async (data: REQUEST.TCreateHospitalStaff) => {
            const response = await createHospitalStaffAsync({
                email: data.email,
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                avatarId: data.avatarId,
            });
            return response as TResponse;
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Thêm nhân viên thành công thành công",
                duration: 5000,
            });
        },

        onError: (error: TMeta) => {
            error.errors?.forEach((error) => {
                console.log(error);

                if (error.code === "hospital_staff_error_02") {
                    addToast({
                        type: "error",
                        description:
                            "Email không được trùng. Vui lòng nhập lại !",
                        duration: 5000,
                    });
                }
            });
        },
    });
};

import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createDoctorAsync, createHospitalAsync } from "./api-services";

export const useServiceCreateDoctor = () => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TCreateDoctor>({
        mutationFn: async (data: REQUEST.TCreateDoctor) => {
            const response = await createDoctorAsync({
                phoneNumber: data.phoneNumber,
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                avatarId: data.avatarId,
                numberOfExperiences: data.numberOfExperiences,
                position: data.position,
                introduction: data.introduction,
            });
            return response as TResponse;
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Thêm bác sĩ thành công thành công",
                duration: 5000,
            });
        },

        onError: (error: TMeta) => {
            error.errors?.forEach((error) => {
                console.log(error);

                if (error.code === "doctor_error_01") {
                    addToast({
                        type: "error",
                        description:
                            "Số điện thoại không được trùng. Vui lòng nhập lại !",
                        duration: 5000,
                    });
                }
            });
        },
    });
};

export const useServiceCreateHospital = () => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TCreateHospital>({
        mutationFn: async (data: REQUEST.TCreateHospital) => {
            const response = await createHospitalAsync({
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                website: data.website,
                address: data.address,
                introduction: data.introduction,
                thumbnail: data.thumbnail,
                images: data.images,
            });
            return response as TResponse;
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Thêm bệnh viện thành công",
                duration: 5000,
            });
        },

        onError: (error: TMeta) => {
            error.errors?.forEach((error) => {
                console.log(error);

                if (error.code === "hospital_error_01") {
                    addToast({
                        type: "error",
                        description:
                            "Số điện thoại không được trùng. Vui lòng nhập lại !",
                        duration: 5000,
                    });
                }
                if (error.code === "hospital_error_02") {
                    addToast({
                        type: "error",
                        description:
                            "Email  không được trùng. Vui lòng nhập lại !",
                        duration: 5000,
                    });
                }
            });
        },
    });
};

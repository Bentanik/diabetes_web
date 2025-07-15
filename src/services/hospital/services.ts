import useToast from "@/hooks/use-toast";
import { createHospitalAsync } from "@/services/hospital/api-services";
import { useMutation } from "@tanstack/react-query";

export const useServiceCreateHospital = () => {
    const { addToast } = useToast();
    return useMutation<TResponse, TMeta, REQUEST.TCreateHospital>({
        mutationFn: async (data: REQUEST.TCreateHospital) => {
            const formData = new FormData();
            formData.append("Name", data.name);
            formData.append("Address", data.address);
            formData.append("ContactNumber", data.contactNumber);
            formData.append(
                "EstablishedDate",
                data.establishedDate.toISOString()
            );
            formData.append("Description", data.description);
            formData.append("Email", data.email);
            formData.append("Logo", data.logo);

            return await createHospitalAsync(formData);
        },
        onSuccess: (data) => {
            addToast({
                type: "success",
                description: data.value.message,
                duration: 5000,
            });
        },
        onError: (err) => {
            const errorMessages = err.errors
                .flat()
                .map((e) => e.message)
                .join(", ");

            addToast({
                type: "error",
                description: errorMessages,
                duration: 5000,
            });
        },
    });
};

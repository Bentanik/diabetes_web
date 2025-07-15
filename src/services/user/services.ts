import useToast from "@/hooks/use-toast";
import { uploadImageUserAsync } from "@/services/user/api-services";
import { useMutation } from "@tanstack/react-query";

export default function useUploadImageService() {
    const { addToast } = useToast();
    return useMutation<
        TResponseData<API.TUploadImageUserResponse>,
        TMeta,
        REQUEST.TUploadUserImage
    >({
        mutationFn: async (data: REQUEST.TUploadUserImage) => {
            const formData = new FormData();
            formData.append("Image", data.image);
            return await uploadImageUserAsync(formData);
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Tải ảnh thành công ",
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
}

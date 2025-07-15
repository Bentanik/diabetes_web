import useToast from "@/hooks/use-toast";
import {
    uploadImageAsync,
    uploadImageConversationAsync,
} from "@/services/media/api-services";
import { useMutation } from "@tanstack/react-query";

export function useUploadImageService() {
    const { addToast } = useToast();
    return useMutation<
        TResponseData<API.TUploadImageResponse>,
        TMeta,
        REQUEST.TUploadImage
    >({
        mutationFn: async (data: REQUEST.TUploadImage) => {
            const formData = new FormData();
            formData.append("Image", data.image);
            return await uploadImageAsync(formData);
        },
        onSuccess: () => {
            // addToast({
            //     type: "success",
            //     description: "Tải ảnh thành công ",
            //     duration: 5000,
            // });
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

export function useUploadImageConversationService() {
    const { addToast } = useToast();
    return useMutation<
        TResponseData<API.TUploadConversationImageResponse>,
        TMeta,
        REQUEST.TUploadConversationImage
    >({
        mutationFn: async (data: REQUEST.TUploadConversationImage) => {
            const formData = new FormData();
            formData.append("File", data.files);
            return await uploadImageConversationAsync(formData);
        },
    });
}

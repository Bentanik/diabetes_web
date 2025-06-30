import useToast from "@/hooks/use-toast";
import {
    deleteImageAsync,
    uploadImageAsync,
} from "@/services/media/api-services";
import { useMutation } from "@tanstack/react-query";

export default function useUploadImageService() {
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
        onSuccess: (res) => {
            addToast({
                type: "success",
                description: res.message,
                duration: 5000,
            });
        },
    });
}

export const useDeleteImageService = () => {
    const { addToast } = useToast();
    return useMutation<TResponse, TMeta, REQUEST.TDeleteImage>({
        mutationFn: deleteImageAsync,
        onSuccess: () => {
            addToast(
                {
                    type: "success",
                    description: "Xóa ảnh thành công",
                    duration: 5000,
                },
                false
            );
        },
        onError: () => {
            addToast({
                type: "error",
                description: "Please try again!",
                duration: 5000,
            });
        },
    });
};

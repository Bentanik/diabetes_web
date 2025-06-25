import useToast from "@/hooks/use-toast";
import { UploadImageAsync } from "@/services/media/api-services";
import { useMutation } from "@tanstack/react-query";

export default function services() {
    const { addToast } = useToast();
    return useMutation<
        TResponseData<API.TUploadImageResponse>,
        TMeta,
        REQUEST.TUploadImage
    >({
        mutationFn: async (data: REQUEST.TUploadImage) => {
            const formData = new FormData();
            formData.append("Image", data.image);
            return await UploadImageAsync(formData);
        },
        onSuccess: (res) => {
            addToast({
                type: "success",
                description: res.value.message,
                duration: 5000,
            });
        },
    });
}

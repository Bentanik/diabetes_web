import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadImageAsync } from "@/services/media/api-services";
import useToast from "@/hooks/use-toast";

export const imageSchema = z.object({
    image: z
        .any()
        .refine((file) => file instanceof File, {
            message: "Vui lòng chọn một ảnh",
        })
        .refine((file) => file?.size <= 5 * 1024 * 1024, {
            message: "Ảnh không được lớn hơn 5MB",
        })
        .refine((file) => file?.type?.startsWith("image/"), {
            message: "Chỉ chấp nhận định dạng ảnh",
        }),
});

export type ImageFormData = z.infer<typeof imageSchema>;

export default function useUploadImage() {
    const { addToast } = useToast();

    const form = useForm<ImageFormData>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            image: undefined,
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: ImageFormData) => {
            const formData = new FormData();
            formData.append("Image", data.image);
            const response = await uploadImageAsync(formData);
            console.log("Raw response from UploadImageAsync:", response); // Log raw response
            return response;
        },
        onSuccess: (res) => {
            console.log("Upload image response in onSuccess:", res);
            addToast({
                type: "success",
                description: "Tải ảnh lên thành công",
                duration: 5000,
            });
        },
        onError: (error) => {
            console.error("Upload error details:", error);
            addToast({
                type: "error",
                description:
                    "Failed to upload image: " +
                    (error.message || "Unknown error"),
                duration: 5000,
            });
        },
    });

    const onSubmit = (
        data: ImageFormData,
        clearImage: () => void,
        onImageUploaded: (
            imageId: string,
            publicId: string,
            publicUrl: string
        ) => void
    ) => {
        mutate(data, {
            onSuccess: (res) => {
                // Validate response data
                if (
                    res &&
                    res.value.data &&
                    res.value.data.imageId &&
                    res.value.data.publicId &&
                    res.value.data.publicUrl
                ) {
                    const { imageId, publicId, publicUrl } = res.value.data as API.TUploadImageResponse;
                    console.log("Validated upload data:", {
                        imageId,
                        publicId,
                        publicUrl,
                    });
                    onImageUploaded(imageId, publicId, publicUrl); // Call callback first
                    form.reset();
                    clearImage();
                } else {
                    console.error("Invalid response data:", res);
                    addToast({
                        type: "error",
                        description: "Dữ liệu phản hồi không hợp lệ",
                        duration: 5000,
                    });
                }
            },
            onError: (error) => {
                console.error("Mutation error details:", error);
                addToast({
                    type: "error",
                    description:
                        "Failed to upload image: " +
                        (error.message || "Unknown error"),
                    duration: 5000,
                });
            },
        });
    };

    return {
        onSubmit,
        form,
        isPending,
    };
}

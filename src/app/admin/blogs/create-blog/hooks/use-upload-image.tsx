import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadImageAsync } from "@/services/media/api-services";
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
            return await UploadImageAsync(formData);
        },
        onSuccess: (res) => {
            console.log("Upload image response:", res);
            addToast({
                type: "success",
                description: "Tải ảnh lên thành công",
                duration: 5000,
            });
        },
        onError: (error) => {
            console.error("Upload error:", error);
            addToast({
                type: "error",
                description: "Failed to upload image: " + error.message,
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
                const { imageId, publicId, publicUrl } = res.value.data;
                form.reset();
                clearImage();
                onImageUploaded(imageId, publicId, publicUrl);
            },
            onError: (error) => {
                console.error("Mutation error:", error);
                addToast({
                    type: "error",
                    description: "Failed to upload image: " + error.message,
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

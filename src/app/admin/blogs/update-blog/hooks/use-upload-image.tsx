import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadImageAsync } from "@/services/media/api-services";
import useToast from "@/hooks/use-toast";

// Define schema for image validation
export const imageSchema = z.object({
    image: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "Ảnh không được lớn hơn 5MB",
        })
        .refine((file) => file.type.startsWith("image/"), {
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
        mutationFn: async (
            data: ImageFormData
        ): Promise<API.TUploadImageResponse[number]> => {
            const formData = new FormData();
            formData.append("image", data.image);
            const response = await uploadImageAsync(formData);
            if (
                !response.data ||
                !Array.isArray(response.data) ||
                response.data.length === 0
            ) {
                throw new Error("Không nhận được dữ liệu hợp lệ từ server");
            }
            return response.data[0];
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Tải ảnh lên thành công",
                duration: 5000,
            });
        },
        onError: (error: Error) => {
            console.error("Upload error:", error);
            addToast({
                type: "error",
                description:
                    "Tải ảnh thất bại: " +
                    (error.message || "Lỗi không xác định"),
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
            onSuccess: (res: API.TUploadImageResponse[number]) => {
                // Validate response data
                if (res?.imageId && res?.publicId && res?.publicUrl) {
                    onImageUploaded(res.imageId, res.publicId, res.publicUrl);
                    form.reset();
                    clearImage();
                } else {
                    addToast({
                        type: "error",
                        description: "Dữ liệu phản hồi không hợp lệ",
                        duration: 5000,
                    });
                }
            },
            onError: (error: Error) => {
                console.error("Mutation error:", error);
                addToast({
                    type: "error",
                    description:
                        "Tải ảnh thất bại: " +
                        (error.message || "Lỗi không xác định"),
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

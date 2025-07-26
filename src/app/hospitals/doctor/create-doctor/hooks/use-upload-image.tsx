import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadImageUserAsync } from "@/services/user/api-services";
import useToast from "@/hooks/use-toast";

// Define schema for image validation
export const imageSchema = z.object({
    images: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "Ảnh không được lớn hơn 5MB",
        })
        .refine((file) => file.type.startsWith("image/"), {
            message: "Chỉ chấp nhận định dạng ảnh",
        }),
});

export type ImageUserFormData = z.infer<typeof imageSchema>;

export default function useUploadUserImage() {
    const { addToast } = useToast();

    const form = useForm<ImageUserFormData>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            images: undefined,
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (
            data: ImageUserFormData
        ): Promise<API.TUploadImageUserResponse[number]> => {
            const formData = new FormData();
            formData.append("Images", data.images);
            const response = await uploadImageUserAsync(formData);
            if (
                !response.data ||
                !Array.isArray(response.data) ||
                response.data.length === 0
            ) {
                throw new Error("Không nhận được dữ liệu hợp lệ từ server");
            }
            return response.data[0];
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
        data: ImageUserFormData,
        onImageUploaded: (imageId: string) => void
    ) => {
        mutate(data, {
            onSuccess: (res: API.TUploadImageUserResponse[number]) => {
                // Validate response data
                if (res?.imageId && res?.publicId && res?.publicUrl) {
                    onImageUploaded(res.imageId);
                    form.reset();
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

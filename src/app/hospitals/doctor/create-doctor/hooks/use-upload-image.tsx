import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadImageUserAsync } from "@/services/user/api-services";
import useToast from "@/hooks/use-toast";

// Define schema for image validation - support both single and multiple files
export const imageSchema = z.object({
    images: z.union([
        // Single file
        z
            .instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
                message: "Ảnh không được lớn hơn 5MB",
            })
            .refine((file) => file.type.startsWith("image/"), {
                message: "Chỉ chấp nhận định dạng ảnh",
            }),
        // Multiple files
        z
            .array(z.instanceof(File))
            .min(1, { message: "Vui lòng chọn ít nhất 1 ảnh" })
            .refine(
                (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
                { message: "Mỗi ảnh không được lớn hơn 5MB" }
            )
            .refine(
                (files) =>
                    files.every((file) => file.type.startsWith("image/")),
                { message: "Chỉ chấp nhận định dạng ảnh" }
            ),
    ]),
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
        ): Promise<API.TUploadImageUserResponse> => {
            const formData = new FormData();

            // Handle both single file and multiple files
            if (Array.isArray(data.images)) {
                // Multiple files
                data.images.forEach((file) => {
                    formData.append("Images", file);
                });
            } else {
                // Single file
                formData.append("Images", data.images);
            }

            const response = await uploadImageUserAsync(formData);
            if (
                !response.data ||
                !Array.isArray(response.data) ||
                response.data.length === 0
            ) {
                throw new Error("Không nhận được dữ liệu hợp lệ từ server");
            }
            return response.data;
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
        onImageUploaded: (imageIds: string | string[]) => void
    ) => {
        mutate(data, {
            onSuccess: (res: API.TUploadImageUserResponse) => {
                // Validate response data
                const validImages = res.filter(
                    (item) => item?.imageId && item?.publicId && item?.publicUrl
                );

                if (validImages.length > 0) {
                    const imageIds = validImages.map((item) => item.imageId);

                    // Return single ID for single file, array for multiple files
                    if (Array.isArray(data.images)) {
                        onImageUploaded(imageIds);
                    } else {
                        onImageUploaded(imageIds[0]);
                    }

                    form.reset();

                    addToast({
                        type: "success",
                        description: `Tải lên thành công ${validImages.length} ảnh`,
                        duration: 3000,
                    });
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

import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadImageConversationAsync } from "@/services/media/api-services";
import useToast from "@/hooks/use-toast";

// Define schema for image validation
export const imageSchema = z.object({
    files: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "Ảnh không được lớn hơn 5MB",
        })
        .refine((file) => file.type.startsWith("image/"), {
            message: "Chỉ chấp nhận định dạng ảnh",
        }),
});

export type ImageConversationFormData = z.infer<typeof imageSchema>;

export default function useUploadConversationImage() {
    const { addToast } = useToast();

    const form = useForm<ImageConversationFormData>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            files: undefined,
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (
            data: ImageConversationFormData
        ): Promise<API.TUploadConversationImageResponse> => {
            const formData = new FormData();
            formData.append("File", data.files);

            // Gọi API và lấy data
            const res = await uploadImageConversationAsync(formData);
            if (
                !res.data ||
                !res.data.mediaIds ||
                res.data.mediaIds.length === 0
            ) {
                throw new Error("Không nhận được dữ liệu hợp lệ từ server");
            }
            return res.data;
        },
    });

    const onSubmit = (
        data: ImageConversationFormData,
        clearImage: () => void,
        onImageUploaded: (imageId: string) => void
    ) => {
        mutate(data, {
            onSuccess: (res) => {
                if (res.mediaIds && res.mediaIds.length > 0) {
                    onImageUploaded(res.mediaIds[0]);
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
        });
    };

    return {
        onSubmit,
        form,
        isPending,
    };
}

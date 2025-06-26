import { useDeleteImageService } from "@/services/media/services";

export default function useDeleteImage() {
    const { mutate, isPending } = useDeleteImageService();

    const onSubmitDelete = (
        data: REQUEST.TDeleteImage,
        onLoadData: () => void
    ) => {
        try {
            mutate(data, {
                onSuccess: () => {
                    onLoadData();
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return {
        onSubmitDelete,
        isPending,
    };
}

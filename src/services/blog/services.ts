import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createBlogAsync } from "./api-services";

export const useServiceCreateBlog = () => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TCreateBlog>({
        mutationFn: async (data: REQUEST.TCreateBlog) => {
            const formData = new FormData();
            formData.append("Title", data.title);
            formData.append("Content", data.content);
            formData.append("ContentHtml", data.contentHtml);
            formData.append("Thumbnail", data.thumbnail);
            data.categoryIds.forEach((id) => {
                formData.append("CategoryIds", id);
            });
            data.images.forEach((id) => {
                formData.append("Images", id);
            });
            formData.append("DoctorId", data.doctorId);

            return await createBlogAsync(formData);
        },
        onSuccess: (data) => {
            addToast({
                type: "success",
                description: data.value.message,
                duration: 5000,
            });
        },
    });
};

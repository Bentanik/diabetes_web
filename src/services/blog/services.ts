import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createBlogAsync, UpdateBlogAsync } from "./api-services";

export const useServiceCreateBlog = () => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, void>({
        mutationFn: async () => {
            return await createBlogAsync();
        },
        onSuccess: () => {
            console.log("onSuccess called, attempting to show toast");
            addToast({
                type: "success",
                description: "Tạo bài viết thành công",
                duration: 5000,
            });
            console.log("Toast dispatched");
        },
    });
};

export const useServiceUpdateBlog = ({ blogId }: REQUEST.BlogId) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TUpdateBlog>({
        mutationFn: async (data: REQUEST.TUpdateBlog) => {
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
            formData.append("IsDraft", "true");

            return await UpdateBlogAsync({ blogId }, formData);
        },
        onSuccess: () => {
            console.log("onSuccess called, attempting to show toast");
            addToast({
                type: "success",
                description: "Tạo bài viết thành công",
                duration: 5000,
            });
            console.log("Toast dispatched");
        },
    });
};

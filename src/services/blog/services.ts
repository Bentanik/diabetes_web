import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import {
    createBlogAsync,
    updateBlogAsync,
    reviewBlogAsync,
} from "./api-services";

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

            return await updateBlogAsync({ blogId }, formData);
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

export const useServiceReviewBlog = ({ blogId }: REQUEST.BlogId) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.ReviewBlog>({
        mutationFn: async (data: REQUEST.ReviewBlog) => {
            // Gửi dữ liệu dạng JSON
            const response = await reviewBlogAsync(
                { blogId },
                {
                    isApproved: data.isApproved,
                    reasonRejected: data.reasonRejected,
                }
            );
            return response as TResponse;
        },
        onSuccess: () => {
            console.log("Gửi đánh giá bài viết thành công");
            addToast({
                type: "success",
                description: "Duyệt bài viết thành công",
                duration: 5000,
            });
        },
        onError: (err: any) => {
            console.error("Lỗi API:", err);
            addToast({
                type: "error",
                description: "Duyệt bài viết không thành công",
                duration: 5000,
            });
        },
    });
};

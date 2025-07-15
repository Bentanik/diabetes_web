import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import {
    createBlogAsync,
    updateBlogAsync,
    reviewBlogAsync,
} from "./api-services";

export const useServiceCreateBlog = () => {
    const { addToast } = useToast();

    return useMutation<TResponseData<API.TGetBlogId>, TMeta, void>({
        mutationFn: async () => {
            return await createBlogAsync();
        },
        onSuccess: () => {
            addToast({
                type: "success",
                description: "Tạo bài viết thành công",
                duration: 5000,
            });
        },
        onError: (err) => {
            const errorMessages = err.errors
                .flat()
                .map((e) => e.message)
                .join(", ");

            addToast({
                type: "error",
                description: errorMessages,
                duration: 5000,
            });
        },
    });
};

export const useServiceUpdateBlog = ({ blogId }: REQUEST.BlogId) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TUpdateBlog>({
        mutationFn: async (data: REQUEST.TUpdateBlog) => {
            return await updateBlogAsync({ blogId }, data);
        },
        onSuccess: (_, variables) => {
            if (!variables.isDraft) {
                addToast({
                    type: "success",
                    description: "Tạo bài viết thành công",
                    duration: 5000,
                });
            }
        },
        onError: (err) => {
            const errorMessages = err.errors
                .flat()
                .map((e) => e.message)
                .join(", ");

            addToast({
                type: "error",
                description: errorMessages,
                duration: 5000,
            });
        },
    });
};

export const useServiceReviewBlog = ({ blogId }: REQUEST.BlogId) => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.ReviewBlog>({
        mutationFn: async (data: REQUEST.ReviewBlog) => {
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
        onError: (err) => {
            const errorMessages = err.errors
                .flat()
                .map((e) => e.message)
                .join(", ");

            addToast({
                type: "error",
                description: errorMessages,
                duration: 5000,
            });
        },
    });
};

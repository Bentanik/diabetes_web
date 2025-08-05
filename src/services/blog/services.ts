import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import {
    createBlogAsync,
    updateBlogAsync,
    reviewBlogAsync,
    deletePostAsync,
} from "./api-services";
import { TMeta, TResponse, TResponseData } from "@/typings";

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
            addToast({
                type: "error",
                description: err.title,
                duration: 5000,
            });
        },
    });
};

export const useServiceDeletePost = ({ blogId }: REQUEST.BlogId) => {
    const { addToast } = useToast();
    return useMutation<TResponse<object | null>, TMeta, void>({
        mutationFn: () => deletePostAsync({ blogId }),
        onSuccess: () => {
            addToast(
                {
                    type: "success",
                    description: "Xóa bài viết thành công",
                    duration: 5000,
                },
                false
            );
        },
        onError: (err) => {
            addToast({
                type: "error",
                description: err.title,
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
            addToast({
                type: "error",
                description: err.title,
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
            addToast({
                type: "success",
                description: "Duyệt bài viết thành công",
                duration: 5000,
            });
        },
        onError: (err) => {
            addToast({
                type: "error",
                description: err.title,
                duration: 5000,
            });
        },
    });
};

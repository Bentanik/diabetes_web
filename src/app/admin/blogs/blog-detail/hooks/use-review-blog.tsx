import { useBackdrop } from "@/context/backdrop_context";
import { useServiceReviewBlog } from "@/services/blog/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GET_POSTS_QUERY_KEY } from "../../hooks/use-get-blogs";
import { BLOG_DETAIL_QUERY_KEY } from "./use-get-blog";

export const reviewSchema = z.object({
    reasonRejected: z
        .string()
        .min(1, "Phải thêm lý do từ chối")
        .max(200, "Phản hồi không được quá 200 kí tự"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export default function useReviewBlog({ blogId }: REQUEST.BlogId) {
    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            reasonRejected: "",
        },
    });

    const { mutate, isPending } = useServiceReviewBlog({ blogId });
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = (data: REQUEST.ReviewBlog) => {
        showBackdrop();
        mutate(data, {
            onSuccess: async (res) => {
                hideBackdrop();
                await queryClient.invalidateQueries({
                    queryKey: [GET_POSTS_QUERY_KEY],
                });
                await queryClient.invalidateQueries({
                    queryKey: [BLOG_DETAIL_QUERY_KEY],
                });
                form.reset();
            },
            onError: (err) => {
                hideBackdrop();
                console.log("API Fail:", err);
            },
        });
    };
    return {
        onSubmit,
        form,
        isPending,
    };
}

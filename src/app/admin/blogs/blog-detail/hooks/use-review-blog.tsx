import { useBackdrop } from "@/context/backdrop_context";
import { useServiceReviewBlog } from "@/services/blog/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

    const onSubmit = (data: REQUEST.ReviewBlog) => {
        showBackdrop();
        mutate(data, {
            onSuccess: (res) => {
                hideBackdrop();
                console.log("API Success:", res);
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

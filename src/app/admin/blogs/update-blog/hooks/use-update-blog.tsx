import { useBackdrop } from "@/context/backdrop_context";
import { useServiceUpdateBlog } from "@/services/blog/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BLOG_DETAIL_QUERY_KEY } from "../../blog-detail/hooks/use-get-blog";
import { GET_POSTS_QUERY_KEY } from "../../hooks/use-get-blogs";

export const blogSchema = z.object({
    title: z
        .string()
        .min(2, "Tiêu đề bài viết phải có ít nhất 2 kí tự")
        .max(100, "Tiêu đề bài viết không được quá 100 kí tự"),
    contentHtml: z.string().min(100, "Nội dung phải hơn 100 kí tự"),
    categoryIds: z
        .array(z.string())
        .min(1, "Phải chọn ít nhất 1 thể loại cho bài viết"),
    doctorId: z.string().nonempty("Vui lòng chọn bác sĩ"),
    thumbnail: z.string(),
});

export type BlogFormData = z.infer<typeof blogSchema>;

export default function useUpdateBlog({ blogId }: REQUEST.BlogId) {
    const form = useForm<BlogFormData>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            contentHtml: "",
            categoryIds: [],
            doctorId: "",
            thumbnail: "",
        },
    });

    const { mutate, isPending } = useServiceUpdateBlog({ blogId });

    const isPendingUpdate = isPending;
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const queryClient = useQueryClient();

    const onSubmit = (data: REQUEST.TUpdateBlog, clearImages: () => void) => {
        if (!data.isDraft) {
            showBackdrop();
        }
        mutate(data, {
            onSuccess: async (res) => {
                await queryClient.invalidateQueries({
                    queryKey: [BLOG_DETAIL_QUERY_KEY],
                });
                await queryClient.invalidateQueries({
                    queryKey: [GET_POSTS_QUERY_KEY],
                });
                if (!data.isDraft) {
                    hideBackdrop();
                    form.reset();
                    clearImages();
                }
            },
            onError: async (err) => {
                hideBackdrop();
                console.log("API Fail:", err);
            },
        });
    };
    return {
        onSubmit,
        form,
        isPendingUpdate,
    };
}

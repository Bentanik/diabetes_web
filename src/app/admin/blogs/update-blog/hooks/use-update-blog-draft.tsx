import { useServiceUpdateBlogDraft } from "@/services/blog/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const blogDraftSchema = z.object({
    contentHtml: z.string().min(1, "Phải thêm nội dung cho bài viết"),
});

export type BlogDraftFormData = z.infer<typeof blogDraftSchema>;

export default function useUpdateDraftBlog({ blogId }: REQUEST.BlogId) {
    const form = useForm<BlogDraftFormData>({
        resolver: zodResolver(blogDraftSchema),
        defaultValues: {
            contentHtml: "",
        },
    });

    const { mutate, isPending } = useServiceUpdateBlogDraft({ blogId });

    const onSubmit = (data: REQUEST.TUpdateBlogDraft) => {
        mutate(data, {
            onSuccess: (res) => {
                console.log("API Success:", res);
            },
            onError: (err) => {
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

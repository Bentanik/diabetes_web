import { useServiceCreateBlog } from "@/services/blog/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const blogSchema = z.object({
    title: z
        .string()
        .min(2, "Tiêu đề bài viết phải có ít nhất 2 kí tự")
        .max(100, "Tiêu đề bài viết không được quá 100 kí tự"),
    contentHtml: z
        .string()
        .min(100, "Nội dung phải hơn 100 kí tự")
        .max(3000, "Nội dung không đươc vượt quá 3000 kí tự"),
    categoryIds: z
        .array(z.string())
        .min(1, "Phải chọn ít nhất 1 thể loại cho bài viết"),
    doctorId: z.string().nonempty("Vui lòng chọn bác sĩ"),
});

export type BlogFormData = z.infer<typeof blogSchema>;

export default function useCreateBlog() {
    const form = useForm<BlogFormData>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            contentHtml: "",
            categoryIds: [],
            doctorId: "",
        },
    });

    const { mutate, isPending } = useServiceCreateBlog();

    const onSubmit = (data: REQUEST.TCreateBlog, clearImages: () => void) => {
        mutate(data, {
            onSuccess: (res) => {
                console.log("API Success:", res);
                form.reset();
                clearImages();
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

import { useServiceCreateBlog } from "@/services/blog/services";
import { useRouter } from "next/navigation";

export default function useCreateBlog() {
    const { mutate, isPending } = useServiceCreateBlog();
    const router = useRouter();

    const onSubmit = () => {
        mutate(undefined, {
            onSuccess: (res) => {
                console.log("API Success:", res);
                const blogId = res.value.data?.id;
                if (blogId) {
                    router.push(`/admin/blogs/update-blog/${blogId}`);
                }
            },
            onError: (err) => {
                console.log("API Fail:", err);
            },
        });
    };
    return {
        onSubmit,
        isPending,
    };
}

import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateBlog } from "@/services/blog/services";
import { useRouter } from "next/navigation";

export default function useCreateBlog() {
    const { mutate, isPending } = useServiceCreateBlog();
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const router = useRouter();

    const onSubmit = () => {
        showBackdrop();
        mutate(undefined, {
            onSuccess: (res) => {
                hideBackdrop();
                console.log("API Success:", res);
                const blogId = res.value.data?.id;
                if (blogId) {
                    router.push(`/admin/blogs/update-blog/${blogId}`);
                }
            },
            onError: (err) => {
                hideBackdrop();
                console.log("API Fail:", err);
            },
        });
    };
    return {
        onSubmit,
        isPending,
    };
}

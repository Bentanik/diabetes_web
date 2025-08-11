import { useBackdrop } from "@/context/backdrop_context";
import { useServiceCreateBlog } from "@/services/blog/services";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { GET_POSTS_QUERY_KEY } from "./use-get-blogs";

export default function useCreateBlog() {
    const { mutate, isPending } = useServiceCreateBlog();
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const router = useRouter();
    const queryClient = useQueryClient();

    const onSubmit = () => {
        showBackdrop();
        mutate(undefined, {
            onSuccess: async (res) => {
                await queryClient.invalidateQueries({
                    queryKey: [GET_POSTS_QUERY_KEY],
                });
                const blogId = res.data?.id;
                console.log(blogId);
                if (blogId) {
                    router.push(`/admin/blogs/update-blog/${blogId}`);
                }
                hideBackdrop();
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

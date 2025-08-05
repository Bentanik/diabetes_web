import { useBackdrop } from "@/context/backdrop_context";
import { useServiceDeletePost } from "@/services/blog/services";
import { useQueryClient } from "@tanstack/react-query";
import { GET_POSTS_QUERY_KEY } from "./use-get-blogs";

export default function useDeletePost({ blogId }: REQUEST.BlogId) {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useServiceDeletePost({
        blogId,
    });
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const onSubmit = (onLoadData: () => void) => {
        showBackdrop();
        mutate(undefined, {
            onSuccess: async () => {
                onLoadData();
                hideBackdrop();
                await queryClient.invalidateQueries({
                    queryKey: [GET_POSTS_QUERY_KEY],
                });
            },
            onError: () => {
                hideBackdrop();
            },
        });
    };

    return {
        onSubmit,
        isPending,
    };
}

import { useServiceCreateBlog } from "@/services/blog/services";

export default function useCreateBlog() {
    const { mutate, isPending } = useServiceCreateBlog();

    const onSubmit = () => {
        mutate(undefined, {
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
        isPending,
    };
}

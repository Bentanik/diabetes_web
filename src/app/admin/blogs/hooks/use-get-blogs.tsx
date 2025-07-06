import useToast from "@/hooks/use-toast";
import { useState } from "react";
import { getAllBlogs } from "@/services/blog/api-services";

export default function useGetBlogs() {
    const { addToast } = useToast();
    const [isPending, setPending] = useState(false);

    const getBlogsApi = async (params: REQUEST.BlogRequestParam) => {
        setPending(true);
        try {
            const res = await getAllBlogs(params);
            if (res.value.data != null) {
                return res as TResponse<API.TGetBlogs>;
            } else {
                addToast({
                    type: "error",
                    description: "Fail to fetch application",
                });
                return null;
            }
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            setPending(false);
        }
    };
    return { getBlogsApi, isPending };
}

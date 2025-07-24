import useToast from "@/hooks/use-toast";
import { useState } from "react";
import { getAllBlogs } from "@/services/blog/api-services";
import { useBackdrop } from "@/context/backdrop_context";

export default function useGetBlogs() {
    const { addToast } = useToast();
    const [isPending, setPending] = useState(false);
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const getBlogsApi = async (params: REQUEST.BlogRequestParam) => {
        setPending(true);
        showBackdrop();
        try {
            const res = await getAllBlogs(params);
            console.log("Blogs Data nè:");
            if (res.data != null) {
                return res as TResponseData<API.TGetBlogs>;
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
            hideBackdrop();
        }
    };
    return { getBlogsApi, isPending };
}

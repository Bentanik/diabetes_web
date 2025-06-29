import useToast from "@/hooks/use-toast";
import { useState } from "react";
import { getAllPost } from "@/services/blog/api-services";
import { isTResponseData } from "@/utils/compare";

export default function useGetBlogs() {
    const { addToast } = useToast();
    const [isPending, setPending] = useState(false);

    const getBlogsApi = async (params: REQUEST.BlogRequestParam) => {
        setPending(true);
        try {
            const res = await getAllPost(params);
            if (isTResponseData(res)) {
                return res as TResponseData<API.TGetBlogs>;
            } else {
                addToast({
                    type: "error",
                    description: "Fail to fetch application",
                });
                return null;
            }
        } catch (err) {
            return null;
        } finally {
            setPending(false);
        }
    };
    return { getBlogsApi, isPending };
}

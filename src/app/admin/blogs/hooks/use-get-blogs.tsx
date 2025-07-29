import useToast from "@/hooks/use-toast";
import { useState } from "react";
import { getAllBlogs } from "@/services/blog/api-services";
import { TResponseData } from "@/typings";

export default function useGetBlogs() {
    const { addToast } = useToast();
    const [isPending, setPending] = useState(false);

    const getBlogsApi = async (params: REQUEST.BlogRequestParam) => {
        setPending(true);
        try {
            const res = await getAllBlogs(params);
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
        }
    };
    return { getBlogsApi, isPending };
}

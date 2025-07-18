import { useBackdrop } from "@/context/backdrop_context";
import useToast from "@/hooks/use-toast";
import { getBlog } from "@/services/blog/api-services";
import { TResponseData } from "@/typings";
import { useState } from "react";

export default function useGetBlog() {
    const { addToast } = useToast();
    const [isBlogPending, setIsBlogPending] = useState<boolean>(false);
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const getBlogApi = async (param: REQUEST.BlogId) => {
        showBackdrop();
        setIsBlogPending(true);
        try {
            const res = await getBlog(param);
            if (res.data != null) {
                return res as TResponseData<API.TGetBlog>;
            } else {
                addToast({
                    type: "error",
                    description: "Failed to fetch applications",
                });
                return null;
            }
        } catch (error) {
            addToast({
                type: "error",
                description: "An error occurred while fetching applications",
            });
            console.log(error);
            return null;
        } finally {
            setIsBlogPending(false);
            hideBackdrop();
        }
    };

    return { getBlogApi, isBlogPending };
}

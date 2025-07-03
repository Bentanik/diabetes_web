import useToast from "@/hooks/use-toast";
import { getBlog } from "@/services/blog/api-services";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetBlog() {
    const { addToast } = useToast();
    const [isBlogPending, setIsBlogPending] = useState<boolean>(false);

    const getBlogApi = async (param: REQUEST.BlogId) => {
        setIsBlogPending(true);
        try {
            const res = await getBlog(param);
            if (isTResponseData(res)) {
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
        }
    };

    return { getBlogApi, isBlogPending };
}

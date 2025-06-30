import useToast from "@/hooks/use-toast";
import { getBlog } from "@/services/blog/api-services";
import { isTResponseData } from "@/utils/compare";
import React, { useState } from "react";

export default function useGetBlog() {
    const { addToast } = useToast();
    const [isPending, setIsPending] = useState<boolean>(false);

    const getBlogApi = async (param: REQUEST.BlogId) => {
        setIsPending(true);
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
            return null;
        } finally {
            setIsPending(false);
        }
    };

    return { getBlogApi, isPending };
}

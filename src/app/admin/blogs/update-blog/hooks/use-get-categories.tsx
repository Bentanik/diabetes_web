import useToast from "@/hooks/use-toast";
import { getCategories } from "@/services/category/api-services";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetDataCategories() {
    const { addToast } = useToast();
    const [isPending, setPending] = useState(false);

    const getCategoriesApi = async () => {
        setPending(true);
        try {
            const res = await getCategories();
            if (isTResponseData(res)) {
                return res as TResponseData<API.TGetCategories>;
            } else {
                addToast({
                    type: "error",
                    description: "Failed to fetch applications",
                });
                return null;
            }
        } catch (err) {
            addToast({
                type: "error",
                description: "An error occurred while fetching applications",
            });
            console.log(err);
            return null;
        } finally {
            setPending(false);
        }
    };
    return { getCategoriesApi, isPending };
}

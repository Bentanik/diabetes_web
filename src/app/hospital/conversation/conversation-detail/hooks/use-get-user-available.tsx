import useToast from "@/hooks/use-toast";
import { useState } from "react";
import { getUserAvailable } from "@/services/conversation/api-services";
import { useBackdrop } from "@/context/backdrop_context";
import { TResponseData } from "@/typings";

export default function useGetUserAvailable() {
    const { addToast } = useToast();
    const [isPending, setPending] = useState(false);
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const getUserAvailableApi = async (
        params: REQUEST.UserAvailableRequestParam
    ) => {
        setPending(true);
        showBackdrop();
        try {
            const res = await getUserAvailable(params);
            if (res.data != null) {
                return res as TResponseData<API.TGetUserAvailable>;
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
    return { getUserAvailableApi, isPending };
}

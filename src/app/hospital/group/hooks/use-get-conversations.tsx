import useToast from "@/hooks/use-toast";
import { useState } from "react";
import { getConversations } from "@/services/conversation/api-services";
import { useBackdrop } from "@/context/backdrop_context";

export default function useGetConversations() {
    const { addToast } = useToast();
    const [isPending, setPending] = useState(false);
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const getConversationsApi = async (params: REQUEST.ConversationsParams) => {
        setPending(true);
        showBackdrop();
        try {
            const res = await getConversations(params);
            if (res.data != null) {
                return res as TResponseData<API.TGetConversations>;
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
    return { getConversationsApi, isPending };
}

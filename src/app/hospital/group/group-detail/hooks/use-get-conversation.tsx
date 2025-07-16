import useToast from "@/hooks/use-toast";
import { useState } from "react";
import { getConversationDetail } from "@/services/conversation/api-services";
import { useBackdrop } from "@/context/backdrop_context";

export default function useGetUserAvailable() {
    const { addToast } = useToast();
    const [isPending, setPending] = useState(false);
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const getConversationDetailApi = async (
        groupId: string,
        params: REQUEST.ConversationsParams
    ) => {
        setPending(true);
        showBackdrop();
        try {
            const res = await getConversationDetail(groupId, params);
            if (res.data != null) {
                return res as TResponseData<API.TGetConversationDetail>;
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
    return { getConversationDetailApi, isPending };
}

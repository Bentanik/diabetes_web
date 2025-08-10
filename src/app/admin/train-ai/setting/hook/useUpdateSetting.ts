import { useBackdrop } from "@/context/backdrop_context";
import {
  CHAT_SETTING_QUERY_KEY,
  useUpdateChatSettingService,
} from "@/services/setting/services";
import { KNOWLEDGE_QUERY_KEY } from "@/services/train-ai/services";
import { useQueryClient } from "@tanstack/react-query";

export default function useUpdateSetting() {
  const { mutate, isPending } = useUpdateChatSettingService();
  const backdrop = useBackdrop();
  const queryClient = useQueryClient();

  const handleUpdateChatSetting = (data: REQUEST.TUpdateChatSettingRequest) => {
    backdrop.showBackdrop();
    mutate(data, {
      onSuccess: async () => {
        backdrop.hideBackdrop();
        await queryClient.invalidateQueries({
          queryKey: [CHAT_SETTING_QUERY_KEY],
        });

        await queryClient.invalidateQueries({
          queryKey: [KNOWLEDGE_QUERY_KEY],
        });
      },
      onError: () => {
        backdrop.hideBackdrop();
      },
    });
  };

  return { handleUpdateChatSetting, isPending };
}

import { useBackdrop } from "@/context/backdrop_context";
import {
  useUpdateSettingsService,
} from "@/services/train-ai/services";
import { KNOWLEDGE_QUERY_KEY } from "@/services/train-ai/services";
import { useQueryClient } from "@tanstack/react-query";

export default function useUpdateSetting() {
  const { mutate, isPending } = useUpdateSettingsService();
  const backdrop = useBackdrop();
  const queryClient = useQueryClient();

  const handleUpdateChatSetting = (data: REQUEST.TUpdateSettingsRequest) => {
    backdrop.showBackdrop();
    mutate(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [KNOWLEDGE_QUERY_KEY],
        });
      },
      onError: () => {
      },
      onSettled: () => {
        backdrop.hideBackdrop();
      },
    });
  };

  return { handleUpdateChatSetting, isPending };
}

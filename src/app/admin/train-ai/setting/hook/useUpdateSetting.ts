import { useBackdrop } from "@/context/backdrop_context";
import { useNotificationContext } from "@/context/notification_context";
import {
  useUpdateSettingsService,
} from "@/services/train-ai/services";
import { KNOWLEDGE_QUERY_KEY } from "@/services/train-ai/services";
import { useQueryClient } from "@tanstack/react-query";

export default function useUpdateSetting() {
  const { mutate, isPending } = useUpdateSettingsService();
  const backdrop = useBackdrop();
  const queryClient = useQueryClient();

  const { addSuccess, addError } = useNotificationContext()


  const handleUpdateChatSetting = (data: REQUEST.TUpdateSettingsRequest, handleSuccess: () => void) => {
    backdrop.showBackdrop();
    mutate(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [KNOWLEDGE_QUERY_KEY],
        });
        handleSuccess();
        addSuccess("Thành công","Cập nhật cài đặt thành công");
      },
      onError: () => {
        addError("Thất bại", "Đã có lỗi xảy ra");
      },
      onSettled: () => {
        backdrop.hideBackdrop();
      },
    });
  };

  return { handleUpdateChatSetting, isPending };
}

import { useNotificationContext } from "@/context/notification_context";
import {
  KNOWLEDGE_QUERY_KEY,
  useDeleteKnowledgeService,
} from "@/services/train-ai/services";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useDeleteKnowlege() {
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate } = useDeleteKnowledgeService();
  const queryClient = useQueryClient();

  const { addSuccess } = useNotificationContext()


  const onSubmit = async (id: string, onClose: () => void) => {
    if (isDeleting) return; // Prevent multiple submissions

    try {
      setIsDeleting(true);

      mutate(id, {
        onSuccess: async (responseData) => {
          if (responseData) {
            setIsDeleting(false);
            onClose();
            await queryClient.invalidateQueries({
              queryKey: [KNOWLEDGE_QUERY_KEY],
            });
            addSuccess("Thành công", `Cơ sở tri thức đã được xóa thành công`)
          }
        },
        onError: () => {
          setIsDeleting(false);
        },
      });
    } catch (err) {
      console.error("Unexpected error:", err);

      setIsDeleting(false);
    }
  };

  return {
    onSubmit,
    isDeleting,
  };
}

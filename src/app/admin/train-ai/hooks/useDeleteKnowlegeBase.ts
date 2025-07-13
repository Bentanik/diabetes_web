import {
  KNOWLEDGE_BASE_QUERY_KEY,
  useDeleteKnowledgeBaseService,
} from "@/services/train-ai/services";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useDeleteKnowlegeBase() {
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate } = useDeleteKnowledgeBaseService();
  const queryClient = useQueryClient();

  const onSubmit = async (name: string, onClose: () => void) => {
    if (isDeleting) return; // Prevent multiple submissions

    try {
      setIsDeleting(true);

      mutate(name, {
        onSuccess: async (responseData) => {
          if (responseData) {
            setIsDeleting(false);
            onClose();
            await queryClient.invalidateQueries({
              queryKey: [KNOWLEDGE_BASE_QUERY_KEY],
            });
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

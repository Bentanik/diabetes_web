import {
  type EditKnowledgeBaseFormData,
  editKnowledgeBaseSchema,
} from "@/lib/validations/knowledge_base.schema";
import {
  KNOWLEDGE_QUERY_KEY,
  useEditKnowledgeService,
} from "@/services/train-ai/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationContext } from "@/context/notification_context";

export default function useEditKnowledgeBase(knowledge: API.TKnowledge) {
  const [isEditing, setIsEditing] = useState(false);

  const { addSuccess } = useNotificationContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
    watch,
  } = useForm<EditKnowledgeBaseFormData>({
    resolver: zodResolver(editKnowledgeBaseSchema),
    defaultValues: {
      name: knowledge.name,
      description: knowledge.description,
    },
  });

  const { mutate } = useEditKnowledgeService();
  const queryClient = useQueryClient();

  const onSubmit = async (
    data: EditKnowledgeBaseFormData,
    onClose: () => void
  ) => {
    if (isEditing) return; // Prevent multiple submissions

    try {
      setIsEditing(true);

      // Prepare request
      const request: REQUEST.TEditKnowledgeRequest = {
        id: knowledge.id,
        name: data?.name,
        description: data?.description,
      };

      // Make API call
      mutate(request, {
        onSuccess: async (responseData) => {
          if (responseData) {
            setIsEditing(false);
            onClose();
            await queryClient.invalidateQueries({
              queryKey: [KNOWLEDGE_QUERY_KEY],
            });
            addSuccess("Thành công", `Cơ sở tri thức đã được chỉnh sửa thành công`)
          }
        },
        onError: (data: TMeta) => {
          if (data.errorCode === "KNOWLEDGE_NAME_EXISTS") {
            setError("name", { message: "Tên cơ sở tri thức đã tồn tại" });
          }
          setIsEditing(false);
        },
      });
    } catch (err) {
      console.error("Unexpected error:", err);

      setIsEditing(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    setError,
    watch,
    isEditing,
    reset,
  };
}

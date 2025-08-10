import {
  type CreateKnowledgeBaseFormData,
  createKnowledgeBaseSchema,
} from "@/lib/validations/knowledge_base.schema";
import {
  KNOWLEDGE_QUERY_KEY,
  useCreateKnowledgeService,
} from "@/services/train-ai/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function useCreateKnowlegeBase() {
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
    watch,
  } = useForm<CreateKnowledgeBaseFormData>({
    resolver: zodResolver(createKnowledgeBaseSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate } = useCreateKnowledgeService();
  const queryClient = useQueryClient();

  const onSubmit = async (
    data: CreateKnowledgeBaseFormData,
    onClose: () => void
  ) => {
    if (isCreating) return; // Prevent multiple submissions

    try {
      setIsCreating(true);

      // Prepare request
      const request: REQUEST.TCreateKnowledgeRequest = {
        name: data?.name,
        description: data?.description,
      };

      // Make API call
      mutate(request, {
        onSuccess: async (responseData) => {
          if (responseData) {
            setIsCreating(false);
            onClose();
            await queryClient.invalidateQueries({
              queryKey: [KNOWLEDGE_QUERY_KEY],
            });
          }
        },
        onError: (data: TMeta) => {
          if (data.errorCode === "KB001") {
            setError("name", { message: "Thư mục đã tồn tại" });
          }
          setIsCreating(false);
        },
      });
    } catch (err) {
      console.error("Unexpected error:", err);

      setIsCreating(false);
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
    isCreating,
    reset,
  };
}

import {
  type UpdateDocumentFormData,
  updateDocumentSchema,
} from "@/lib/validations/document.schema";
import {
  DOCUMENT_QUERY_KEY,
  DOCUMENTS_QUERY_KEY,
  useUpdateDocumentService,
} from "@/services/train-ai/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationContext } from "@/context/notification_context";

export default function useUpdateDocument(document: API.TDocument) {
  const [isCreating, setIsCreating] = useState(false);

  const { addSuccess } = useNotificationContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
    watch,
  } = useForm<UpdateDocumentFormData>({
    resolver: zodResolver(updateDocumentSchema),
    defaultValues: {
      name: document.title ?? "",
      description: document.description ?? "",
    },
  });

  const { mutate } = useUpdateDocumentService();
  const queryClient = useQueryClient();

  const onSubmit = async (
    data: REQUEST.TUpdateDocumentRequest,
    onClose: () => void
  ) => {
    if (isCreating) return;

    try {
      setIsCreating(true);

      const request: REQUEST.TUpdateDocumentRequest = {
        document_id: data?.document_id,
        title: data?.title,
        description: data?.description,
        is_active: data?.is_active,
      };

      mutate(request, {
        onSuccess: async (responseData) => {
          if (responseData) {
            setIsCreating(false);
            onClose();
            await queryClient.invalidateQueries({
              queryKey: [DOCUMENT_QUERY_KEY],
            });
            await queryClient.invalidateQueries({
              queryKey: [DOCUMENTS_QUERY_KEY],
            });
            addSuccess("Thành công", `Tài liệu đã được cập nhật thành công`);
          }
        },
        onError: (data: TMeta) => {
          if (data.errorCode === "DOCUMENT_TITLE_EXISTS") {
            setError("name", { message: "Tên tài liệu đã tồn tại" });
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

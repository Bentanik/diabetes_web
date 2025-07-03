import { useBackdrop } from "@/context/backdrop_context";
import {
  CreateKnowledgeBaseFormData,
  createKnowledgeBaseSchema,
} from "@/lib/validations/knowledge_base.schema";
import { useCreateKnowledgeBaseService } from "@/services/train-ai/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useCreateKnowlegeBase() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm<CreateKnowledgeBaseFormData>({
    resolver: zodResolver(createKnowledgeBaseSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate } = useCreateKnowledgeBaseService();
  const { showBackdrop, hideBackdrop } = useBackdrop();

  const onSubmit = async (
    data: CreateKnowledgeBaseFormData,
    onClose: () => void
  ) => {
    try {
      const request: REQUEST.TCreateKnowledgeBaseRequest = {
        name: data?.name,
        description: data?.description,
      };

      showBackdrop();
      mutate(request, {
        onSuccess: async (data) => {
          if (data) {
            hideBackdrop();
            reset();
            onClose();
          }
        },
        onError: () => {
          hideBackdrop();
        },
      });
    } catch (err) {
      console.log("err: ", err);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    setError,
  };
}

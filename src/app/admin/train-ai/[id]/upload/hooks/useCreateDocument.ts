import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreateDocumentFormData,
  createDocumentSchema,
} from "@/lib/validations/document.schema";

export default function useCreateDocument() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
    watch,
  } = useForm<CreateDocumentFormData>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (
    data: CreateDocumentFormData,
    file: File,
    onClose: () => void,
    handleUploadFile: (data: CreateDocumentFormData, file: File) => void
  ) => {
    try {
      onClose();
      handleUploadFile(data, file);
    } catch (err) {
      console.error("Unexpected error:", err);
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
    reset,
  };
}

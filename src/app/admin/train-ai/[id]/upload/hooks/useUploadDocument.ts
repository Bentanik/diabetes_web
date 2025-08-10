import { useUploadDocumentService } from "@/services/train-ai/services";

interface UploadOptions {
  onSuccess?: (response: TResponseData) => void;
  onError?: (error: TMeta) => void;
  onProgress?: (progress: number) => void;
}

export const useUploadDocument = () => {
  const { mutate: uploadDocument, isPending } = useUploadDocumentService();

  const handleUploadDocument = (
    data: FormData,
    options: UploadOptions = {}
  ) => {
    uploadDocument(data, {
      onSuccess: (response: TResponseData) => {
        if (options.onSuccess) {
          options.onSuccess(response);
        }
      },
      onError: (error: TMeta) => {
        const uploadError: TMeta = error || {
          detail: "Lỗi không xác định khi tải lên tài liệu",
          errorCode: "UNKNOWN",
          status: 500,
          title: "Upload Error",
        };
        if (options.onError) {
          options.onError(uploadError);
        }
      },
    });
  };

  return { handleUploadDocument, isPending };
};

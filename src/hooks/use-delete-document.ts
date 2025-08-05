import { JOB } from "@/services/job/services";
import {
    KNOWLEDGE_BASE_DOCUMENTS_QUERY_KEY,
    useDeleteDocumentService,
} from "@/services/train-ai/services";
import { useQueryClient } from "@tanstack/react-query";

export const useDeleteDocument = () => {
    const { mutate: deleteDocument, isPending } = useDeleteDocumentService();

    const queryClient = useQueryClient();

    const handleDeleteDocument = (id: string, onClose: () => void) => {
        console.log(id);
        deleteDocument(id, {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: [JOB],
                });
                await queryClient.invalidateQueries({
                    queryKey: [KNOWLEDGE_BASE_DOCUMENTS_QUERY_KEY],
                });
                onClose();
            },
            onError: (error: TMeta) => {
                const uploadError: TMeta = error || {
                    detail: "Lỗi không xác định khi xóa tài liệu",
                    errorCode: "UNKNOWN",
                    status: 500,
                    title: "Delete Error",
                };
                console.log(uploadError);
            },
        });
    };

    return { handleDeleteDocument, isPending };
};

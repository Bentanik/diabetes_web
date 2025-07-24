import {
    createKnowledgeAsync,
    deleteDocumentAsync,
    deleteKnowledgeAsync,
    getKnowledgeAsync,
    getKnowledgeBaseDocumentsAsync,
    getKnowledgesAsync,
    trainDocumentAsync,
    uploadDocumentAsync,
} from "@/services/train-ai/api-services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const KNOWLEDGE_BASE_QUERY_KEY = "knowledge-base";
export const KNOWLEDGE_BASE_DOCUMENTS_QUERY_KEY = "knowledge-base-documents";

interface IGetKnowledgeBaseListService {
    search: string;
    sort_by: "updated_at";
    sort_order: "asc" | "desc";
    page: number;
    limit: number;
}

export const useGetKnowledgesService = ({
    search = "",
    sort_by = "updated_at",
    sort_order = "desc",
    page = 1,
    limit = 10,
}: IGetKnowledgeBaseListService) => {
    const {
        data: knowledge_bases,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: [
            KNOWLEDGE_BASE_QUERY_KEY,
            search.trim(),
            sort_by,
            sort_order,
            page,
            limit,
        ],
        queryFn: () =>
            getKnowledgesAsync(search.trim(), sort_by, sort_order, page, limit),
        select: (data) => {
            return data.value.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });

    return { knowledge_bases, isPending, isError, error };
};

export const useGetKnowledgeBaseByIdService = (id: string) => {
    return useQuery({
        queryKey: [KNOWLEDGE_BASE_QUERY_KEY, id],
        queryFn: () => getKnowledgeAsync(id),
        select: (data) => data.value.data,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });
};

export const useCreateKnowledgeService = () => {
    return useMutation<
        TResponse<API.TKnowledge>,
        TMeta,
        REQUEST.TCreateKnowledgeRequest
    >({
        mutationFn: createKnowledgeAsync,
    });
};

export const useDeleteKnowledgeService = () => {
    return useMutation<TResponse<API.TKnowledge>, TMeta, string>({
        mutationFn: (name) => deleteKnowledgeAsync(name),
    });
};

export const useUploadDocumentService = () => {
    return useMutation<TResponse, TMeta, FormData>({
        mutationFn: (data) => uploadDocumentAsync(data),
    });
};

export const useGetKnowledgeBaseDocumentsService = (
    id: string,
    params: {
        search_name?: string;
        sort_by?: string;
        sort_order?: string;
        page?: number;
        limit?: number;
    } = {}
) => {
    return useQuery<
        TResponse<API.TGetKnowledgeBaseDocumentsResponse>,
        TMeta,
        API.TGetKnowledgeBaseDocumentsResponse
    >({
        queryKey: [KNOWLEDGE_BASE_DOCUMENTS_QUERY_KEY, id, params],
        queryFn: () => getKnowledgeBaseDocumentsAsync(id, params),
        select: (data) =>
            data.value.data || {
                documents: [],
                total: 0,
                page: 0,
                limit: 0,
                total_pages: 0,
            },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });
};

export const useDeleteDocumentService = () => {
    return useMutation<TResponse, TMeta, string>({
        mutationFn: (id) => deleteDocumentAsync(id),
    });
};

export const useTrainDocumentService = () => {
    return useMutation<TResponse, TMeta, string>({
        mutationFn: (id) => trainDocumentAsync(id),
    });
};

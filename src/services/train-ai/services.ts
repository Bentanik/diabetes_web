import {
  createKnowledgeBaseAsync,
  deleteDocumentAsync,
  deleteKnowledgeBaseAsync,
  getKnowledgeBaseByIdAsync,
  getKnowledgeBaseDocumentsAsync,
  getKnowledgeBaseListAsync,
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

export const useGetKnowledgeBaseListService = ({
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
      getKnowledgeBaseListAsync(
        search.trim(),
        sort_by,
        sort_order,
        page,
        limit
      ),
    select: (data) => data.value.data,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  return { knowledge_bases, isPending, isError, error };
};

export const useGetKnowledgeBaseByIdService = (id: string) => {
  return useQuery({
    queryKey: [KNOWLEDGE_BASE_QUERY_KEY, id],
    queryFn: () => getKnowledgeBaseByIdAsync(id),
    select: (data) => data.value.data,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};

export const useCreateKnowledgeBaseService = () => {
  return useMutation<
    TResponse<API.TKnowledgeBase>,
    TMeta,
    REQUEST.TCreateKnowledgeBaseRequest
  >({
    mutationFn: createKnowledgeBaseAsync,
  });
};

export const useDeleteKnowledgeBaseService = () => {
  return useMutation<TResponse<API.TKnowledgeBase>, TMeta, string>({
    mutationFn: (name) => deleteKnowledgeBaseAsync(name),
  });
};

export const useUploadDocumentService = () => {
  return useMutation<TResponse, TMeta, FormData>({
    mutationFn: (data) => uploadDocumentAsync(data),
  });
};

export const useGetKnowledgeBaseDocumentsService = (
  params: {
    kb_name?: string;
    file_name?: string;
    job_id?: string;
    created_from?: string;
    created_to?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    limit?: number;
  } = {}
) => {
  return useQuery<
    TResponse<API.TKnowledgeBaseDocument[]>,
    Error,
    API.TKnowledgeBaseDocument[]
  >({
    queryKey: [KNOWLEDGE_BASE_DOCUMENTS_QUERY_KEY, params],
    queryFn: () => getKnowledgeBaseDocumentsAsync(params),
    select: (data) => data.value.data || [],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};

export const useDeleteDocumentService = () => {
  return useMutation<TResponse, TMeta, string>({
    mutationFn: (id) => deleteDocumentAsync(id),
  });
};

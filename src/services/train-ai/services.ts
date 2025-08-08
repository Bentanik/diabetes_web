import {
  createKnowledgeAsync,
  deleteDocumentAsync,
  deleteKnowledgeAsync,
  getKnowledgeByIdAsync,
  getKnowledgeBaseDocumentsAsync,
  getKnowledgeListAsync,
  trainDocumentAsync,
  uploadDocumentAsync,
} from "@/services/train-ai/api-services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const KNOWLEDGE_QUERY_KEY = "knowledge";
export const DOCUMENTS_QUERY_KEY = "documents";

interface IGetKnowledgeListService {
  search: string;
  sort_by: "updated_at";
  sort_order: "asc" | "desc";
  page: number;
  limit: number;
}

export const useGetKnowledgeListService = ({
  search = "",
  sort_by = "updated_at",
  sort_order = "desc",
  page = 1,
  limit = 10,
}: IGetKnowledgeListService) => {
  const {
    data: knowledges,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: [
      KNOWLEDGE_QUERY_KEY,
      search.trim(),
      sort_by,
      sort_order,
      page,
      limit,
    ],
    queryFn: () =>
      getKnowledgeListAsync(search.trim(), sort_by, sort_order, page, limit),
    select: (data) => {
      return (
        data.data || {
          items: [],
          total: 0,
          page: 0,
          limit: 0,
          total_pages: 0,
        }
      );
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  return { knowledges, isPending, isError, error };
};

export const useGetKnowledgeByIdService = (id: string) => {
  return useQuery({
    queryKey: [KNOWLEDGE_QUERY_KEY, id],
    queryFn: () => getKnowledgeByIdAsync(id),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};

export const useCreateKnowledgeService = () => {
  return useMutation<
    TResponseData<API.TKnowledge>,
    TMeta,
    REQUEST.TCreateKnowledgeRequest
  >({
    mutationFn: createKnowledgeAsync,
  });
};

export const useDeleteKnowledgeService = () => {
  return useMutation<TResponseData<API.TKnowledge>, TMeta, string>({
    mutationFn: (name) => deleteKnowledgeAsync(name),
  });
};

export const useUploadDocumentService = () => {
  return useMutation<TResponseData, TMeta, FormData>({
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
    TResponseData<API.TGetKnowledgeDocumentsResponse>,
    TMeta,
    API.TGetKnowledgeDocumentsResponse
  >({
    queryKey: [DOCUMENTS_QUERY_KEY, id, params],
    queryFn: () => getKnowledgeBaseDocumentsAsync(id, params),
    select: (data) =>
      data.data || {
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
  return useMutation<TResponseData, TMeta, string>({
    mutationFn: (id) => deleteDocumentAsync(id),
  });
};

export const useTrainDocumentService = () => {
  return useMutation<TResponseData, TMeta, string>({
    mutationFn: (id) => trainDocumentAsync(id),
  });
};

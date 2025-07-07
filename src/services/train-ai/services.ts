import {
  createKnowledgeBaseAsync,
  deleteKnowledgeBaseAsync,
  getKnowledgeBaseListAsync,
  getKnowledgeBaseStatAsync,
} from "@/services/train-ai/api-services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const KNOWLEDGE_BASE_QUERY_KEY = "knowledge-base";
export const KNOWLEDGE_BASE_STAT_QUERY_KEY = "knowledge-base-stat";

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

export const useGetKnowledgeBaseStatService = (knowledgeBaseName: string) => {
  const {
    data: knowledge_base_stat,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: [KNOWLEDGE_BASE_STAT_QUERY_KEY, knowledgeBaseName],
    queryFn: () => getKnowledgeBaseStatAsync(knowledgeBaseName),
    enabled: !!knowledgeBaseName,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  return { knowledge_base_stat, isPending, isError, error };
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

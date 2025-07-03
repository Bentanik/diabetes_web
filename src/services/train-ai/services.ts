/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createKnowledgeBaseAsync,
  getKnowledgeBaseListAsync,
} from "@/services/train-ai/api-services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const KNOWLEDGE_BASE_QUERY_KEY = "knowledge-base";

export const useGetKnowledgeBaseListService = () => {
  const {
    data: knowledge_bases,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: [KNOWLEDGE_BASE_QUERY_KEY],
    queryFn: getKnowledgeBaseListAsync,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    select: (data) => {
      return data.knowledge_bases;
    },
  });

  return { knowledge_bases, isPending, isError, error };
};

export const useCreateKnowledgeBaseService = () => {
  return useMutation<
    API.TKnowledgeBase,
    TMeta,
    REQUEST.TCreateKnowledgeBaseRequest
  >({
    mutationFn: createKnowledgeBaseAsync,
  });
};

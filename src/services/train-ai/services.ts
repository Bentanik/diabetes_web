/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createKnowledgeBaseAsync,
  createKnowledgeBaseDocumentAsync,
  getKnowledgeBaseListAsync,
  getKnowledgeBaseStatAsync,
} from "@/services/train-ai/api-services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const KNOWLEDGE_BASE_QUERY_KEY = "knowledge-base";
export const KNOWLEDGE_BASE_STAT_QUERY_KEY = "knowledge-base-stat";

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
    API.TKnowledgeBase,
    TMeta,
    REQUEST.TCreateKnowledgeBaseRequest
  >({
    mutationFn: createKnowledgeBaseAsync,
  });
};

export const useCreateKnowledgeDocumentService = (name: string) => {
  return useMutation<
    API.TProcessedFileResponse,
    TMeta,
    REQUEST.TCreateDocumentRequest
  >({
    mutationFn: (data) => {
      const form = new FormData();
      form.append("file", data.file);
      form.append("chunk_size", data.chunk_size.toString());
      form.append("chunk_overlap", data.chunk_overlap.toString());
      form.append("metadata_str", "");
      return createKnowledgeBaseDocumentAsync(name, form);
    },
  });
};

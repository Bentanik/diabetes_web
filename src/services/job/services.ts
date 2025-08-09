import {
  getActiveTrainingJobAsync,
  getActiveUploadJobAsync,
  getJobDocumentHistoryAsync,
} from "@/services/job/api-services";
import { useQuery } from "@tanstack/react-query";

export const JOB_ACTIVE_QUERY_KEY = "job-active";

export const useGetActiveUploadJobService = () => {
  const {
    data: job,
    isPending,
    isError: isJobError,
    error,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery({
    queryKey: [JOB_ACTIVE_QUERY_KEY],
    queryFn: () => getActiveUploadJobAsync(),
    select: (data) => data.value.data,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchInterval: 1000,
  });

  return {
    job,
    isPending,
    isJobError,
    error,
    refetch,
    isRefetching,
    isFetching,
  };
};

export const useGetActiveTrainingJobService = (options?: {
  enabled?: boolean;
}) => {
  const {
    data: jobs,
    isPending,
    isError: isJobError,
    error,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery({
    queryKey: [JOB_ACTIVE_QUERY_KEY],
    queryFn: () => getActiveTrainingJobAsync(),
    select: (data) => data.value.data,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchInterval: 1000,
    enabled: options?.enabled ?? true,
  });

  return {
    jobs,
    isPending,
    isJobError,
    error,
    refetch,
    isRefetching,
    isFetching,
  };
};

// =====================================
export const JOB_DOCUMENT_HISTORY_QUERY_KEY = "job-document-history";

export const useGetJobDocumentHistoryService = (
  params: {
    search: string;
    sort_by: "created_at" | "updated_at";
    sort_order: "asc" | "desc";
    page: number;
    limit: number;
  } = {
    search: "",
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
    limit: 10,
  }
) => {
  return useQuery({
    queryKey: [JOB_DOCUMENT_HISTORY_QUERY_KEY, params],
    queryFn: () => getJobDocumentHistoryAsync(params),
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
    refetchInterval: 1000,
  });
};

import {
  getActiveTrainingJobAsync,
  getActiveUploadJobAsync,
  getJobs,
} from "@/services/job/api-services";
import { useQuery } from "@tanstack/react-query";

export const JOB = "jobs";
export const JOB_ACTIVE_QUERY_KEY = "job-active";

export const useGetJobsService = (
  params: {
    kb_name?: string;
    job_type?: REQUEST.TJobType;
    document_name?: string;
    job_id?: string;
    created_from?: string;
    created_to?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    limit?: number;
  } = {}
) => {
  const {
    data: jobs,
    isPending,
    isError: isJobError,
    error,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery({
    queryKey: [JOB, params],
    queryFn: () => getJobs(params),
    select: (data) => data.value.data,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchInterval: 1000,
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

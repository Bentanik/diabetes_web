import { getJobDocumentHistoryAsync } from "@/services/job/api-services";
import { useQuery } from "@tanstack/react-query";

export const JOB_DOCUMENT_HISTORY_QUERY_KEY = "job-document-history";

export const useGetJobDocumentHistoryService = (
  params: {
    search: string;
    progress?: number;
    sort_by: "created_at" | "updated_at";
    sort_order: "asc" | "desc";
    page: number;
    limit: number;
    type: "upload_document" | "training_document";
    status?: "completed" | "failed" | "processing" | "queued";
    enabled?: boolean;
    knowledge_id?: string;
  } = {
    search: "",
    progress: undefined,
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
    limit: 10,
    type: "upload_document",
    status: undefined,
    enabled: true,
    knowledge_id: undefined,
  }
) => {
  const { enabled, ...apiParams } = params;

  return useQuery({
    queryKey: [JOB_DOCUMENT_HISTORY_QUERY_KEY, apiParams],
    queryFn: () => getJobDocumentHistoryAsync(apiParams),
    enabled: enabled,
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
    refetchInterval: enabled ? 1000 : false, // Chỉ poll khi enabled
  });
};

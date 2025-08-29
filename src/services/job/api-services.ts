import API_ENDPOINTS from "@/services/job/api-path";
import request from "@/services/interceptor";

export const getJobDocumentHistoryAsync = async (
  params: {
    search: string;
    progress?: number;
    sort_by: "created_at" | "updated_at";
    sort_order: "asc" | "desc";
    page: number;
    limit: number;
    type: "upload_document" | "training_document";
    status?: "completed" | "failed" | "processing" | "queued";
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
    knowledge_id: undefined,
  }
) => {
  const response = await request<TResponseData<TPagination<API.TJob>>>(
    API_ENDPOINTS.JOB_DOCUMENT_HISTORY,
    {
      method: "GET",
      params,
    }
  );

  return response.data;
};

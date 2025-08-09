import API_ENDPOINTS from "@/services/job/api-path";
import request from "@/services/interceptor";

export const getActiveUploadJobAsync = async () => {
  const response = await request<TResponse<API.TJob>>(
    API_ENDPOINTS.JOB_DOCUMENT_HISTORY,
    {
      method: "GET",
    }
  );

  return response.data;
};

export const getActiveTrainingJobAsync = async () => {
  const response = await request<TResponse<API.TJob[]>>(
    API_ENDPOINTS.JOB_DOCUMENT_HISTORY,
    {
      method: "GET",
    }
  );

  return response.data;
};

export const getJobDocumentHistoryAsync = async (
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
  const response = await request<TResponseData<TPagination<API.TJob>>>(
    API_ENDPOINTS.JOB_DOCUMENT_HISTORY,
    {
      method: "GET",
      params,
    }
  );

  return response.data;
};

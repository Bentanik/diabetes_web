import API_ENDPOINTS from "@/services/job/api-path";
import request from "@/services/interceptor";

export const getJobs = async (
  params: {
    kb_name?: string;
    job_type?: REQUEST.TJobType | "upload";
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
  const queryParams = {
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
    limit: 10,
    ...params,
  };

  const response = await request<TResponse<API.TJob[]>>(API_ENDPOINTS.JOB, {
    method: "GET",
    params: queryParams,
  });
  return response.data;
};

export const getActiveUploadJobAsync = async () => {
  const response = await request<TResponse<API.TJob>>(
    API_ENDPOINTS.ACTIVE_UPLOAD,
    {
      method: "GET",
    }
  );

  return response.data;
};

export const getActiveTrainingJobAsync = async () => {
  const response = await request<TResponse<API.TJob[]>>(
    API_ENDPOINTS.ACTIVE_TRAINING,
    {
      method: "GET",
    }
  );

  return response.data;
};

import API_ENDPOINTS from "@/services/train-ai/api-path";
import request from "@/services/interceptor";

export const getKnowledgeBaseListAsync = async (
  search: string,
  sort_by: "updated_at" | "created_at",
  sort_order: "asc" | "desc",
  page: number,
  limit: number
) => {
  const response = await request<TResponse<API.TGetKnowledgeBaseListResponse>>(
    API_ENDPOINTS.KNOWLEDGE_BASE,
    {
      method: "GET",
      params: {
        search,
        sort_by,
        sort_order,
        page,
        limit,
      },
    }
  );

  return response.data;
};

export const createKnowledgeBaseAsync = async (
  data: REQUEST.TCreateKnowledgeBaseRequest
) => {
  const response = await request<TResponse<API.TKnowledgeBase>>(
    API_ENDPOINTS.KNOWLEDGE_BASE,
    {
      method: "POST",
      data,
    }
  );

  return response.data;
};

export const deleteKnowledgeBaseAsync = async (name: string) => {
  const response = await request<TResponse<API.TKnowledgeBase>>(
    API_ENDPOINTS.KNOWLEDGE_BASE + "/" + name,
    {
      method: "DELETE",
    }
  );

  return response.data;
};

export const uploadDocumentAsync = async (data: FormData) => {
  const response = await request<TResponse>(
    API_ENDPOINTS.KNOWLEDGE_BASE_UPLOAD_DOCUMENT,
    {
      method: "POST",
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getKnowledgeBaseDocumentsAsync = async (
  params: {
    kb_name?: string;
    file_name?: string;
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

  const response = await request<TResponse<API.TKnowledgeBaseDocument[]>>(
    API_ENDPOINTS.KNOWLEDGE_BASE_DOCUMENTS,
    {
      method: "GET",
      params: queryParams,
    }
  );
  return response.data;
};

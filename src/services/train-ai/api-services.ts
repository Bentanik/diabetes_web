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

export const getKnowledgeBaseStatAsync = async (name: string) => {
  const response = await request<TResponse<API.TKnowledgeBaseStats>>(
    API_ENDPOINTS.KNOWLEDGE_BASE_STATS(name),
    {
      method: "GET",
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

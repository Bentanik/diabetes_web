import API_ENDPOINTS from "@/services/train-ai/api-path";
import request from "@/services/interceptor";

export const getKnowledgeBaseListAsync = async () => {
  const response = await request<API.TGetKnowledgeBaseListResponse>(
    API_ENDPOINTS.KNOWLEDGE_BASE,
    {
      method: "GET",
    }
  );

  return response.data;
};

export const createKnowledgeBaseAsync = async (
  data: REQUEST.TCreateKnowledgeBaseRequest
) => {
  const response = await request<API.TKnowledgeBase>(
    API_ENDPOINTS.KNOWLEDGE_BASE,
    {
      method: "POST",
      data,
    }
  );

  return response.data;
};

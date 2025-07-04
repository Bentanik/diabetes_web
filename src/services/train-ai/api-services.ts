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

export const getKnowledgeBaseStatAsync = async (name: string) => {
  const response = await request<API.TKnowledgeBaseStats>(
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
  const response = await request<API.TKnowledgeBase>(
    API_ENDPOINTS.KNOWLEDGE_BASE,
    {
      method: "POST",
      data,
    }
  );

  return response.data;
};

export const createKnowledgeBaseDocumentAsync = async (
  name: string,
  formData: FormData
) => {
  const response = await request<API.TProcessedFileResponse>(
    API_ENDPOINTS.KNOWLEDGE_BASE_UPLOAD_DOCUMENT(name),
    {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

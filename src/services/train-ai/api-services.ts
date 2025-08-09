import API_ENDPOINTS from "@/services/train-ai/api-path";
import request from "@/services/interceptor";
import axios from "axios";

export const getKnowledgeListAsync = async (
  search: string,
  sort_by: "updated_at" | "created_at",
  sort_order: "asc" | "desc",
  page: number,
  limit: number
) => {
  const response = await request<TResponseData<TPagination<API.TKnowledge>>>(
    API_ENDPOINTS.KNOWLEDGES,
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

export const getKnowledgeByIdAsync = async (id: string) => {
  const response = await request<TResponseData<API.TKnowledge>>(
    API_ENDPOINTS.KNOWLEDGES + "/" + id,
    {
      method: "GET",
    }
  );

  return response.data;
};

export const createKnowledgeAsync = async (
  data: REQUEST.TCreateKnowledgeRequest
) => {
  const response = await request<TResponseData<API.TKnowledge>>(
    API_ENDPOINTS.KNOWLEDGES,
    {
      method: "POST",
      data,
    }
  );

  return response.data;
};

export const deleteKnowledgeAsync = async (name: string) => {
  const response = await request<TResponseData<API.TKnowledge>>(
    API_ENDPOINTS.KNOWLEDGES + "/" + name,
    {
      method: "DELETE",
    }
  );

  return response.data;
};

export const uploadDocumentAsync = async (data: FormData) => {
  const response = await request<TResponseData>(API_ENDPOINTS.DOCUMENTS, {
    method: "POST",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteDocumentAsync = async (id: string) => {
  const response = await request<TResponseData>(
    API_ENDPOINTS.DOCUMENTS + "/" + id,
    {
      method: "DELETE",
    }
  );

  return response.data;
};

export const getDocumentsAsync = async (
  id: string,
  params: {
    search_name?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    limit?: number;
    type?: "upload_document" | "training_document";
  } = {}
) => {
  const queryParams = {
    sort_by: "updated_at",
    sort_order: "desc",
    page: 1,
    limit: 10,
    ...params,
  };

  const response = await request<TResponseData<TPagination<API.TDocument>>>(
    API_ENDPOINTS.DOCUMENTS,
    {
      method: "GET",
      params: queryParams,
    }
  );
  return response.data;
};

export const downloadDocumentAsync = async (id: string) => {
  try {
    const response = await axios({
      url: API_ENDPOINTS.DOWNLOAD_DOCUMENT(id),
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    let filename = "download";
    const contentDisposition = response.headers["content-disposition"];

    if (contentDisposition) {
      console.log("Content-Disposition:", contentDisposition);

      const patterns = [
        /filename\*=UTF-8''([^;]+)/,
        /filename="([^"]+)"/,
        /filename=([^;]+)/,
      ];

      for (const pattern of patterns) {
        const match = contentDisposition.match(pattern);
        if (match) {
          filename = decodeURIComponent(match[1]);
          break;
        }
      }
    }

    if (filename === "download") {
      const urlParts = response.config.url?.split("/");
      const lastPart = urlParts?.[urlParts.length - 1];
      if (lastPart && lastPart.includes(".")) {
        filename = lastPart;
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
};

export const trainDocumentAsync = async (id: string) => {
  const response = await request<TResponseData>(
    API_ENDPOINTS.TRAIN_DOCUMENT(id),
    {
      method: "POST",
    }
  );
  return response.data;
};

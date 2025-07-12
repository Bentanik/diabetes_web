declare namespace REQUEST {
  type TCreateKnowledgeBaseRequest = {
    name: string;
    description: string;
  };

  type TValidationResults = {
    isValid: boolean;
    confidence: number;
    reasons: string[];
    suggestions?: string[];
    keyTopics?: string[];
    error?: string;
    errorCode?: string;
  };

  type TCreateDocumentRequest = {
    id: number;
    name: string;
    size: string;
    type: string;
    status: "uploading" | "validating" | "valid" | "invalid" | "error";
    progress: number;
    validationResults: API.TValidationResults | null;
  };

  type TSuggestPromptRequest = {
    idea: string;
    language: vi;
  };

  type TUpdateSettingsRequest = {
    system_prompt: string;
    available_collections: string[];
  };
}

declare namespace API {
  type TKnowledgeBase = {
    id: string;
    name: string;
    description: string;
    metadata: {
      useDescriptionForLLMCheck: boolean;
    };
    document_count: number;
    created_at: string;
    updated_at: string;
    total_size_mb: number;
  };

  type TGetKnowledgeBaseListResponse = {
    knowledge_bases: TKnowledgeBase[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };

  type TKnowledgeBaseDocument = {
    id: string;
    kb_name: string;
    document_id: string;
    status: "completed | failed";
    file_name: string;
    file_type: string;
    file_size: number;
    created_at: string;
    updated_at: string;
  };
}

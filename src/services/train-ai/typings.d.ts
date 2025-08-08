declare namespace REQUEST {
  type TCreateKnowledgeRequest = {
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
  type TKnowledgeStats = {
    total_size_bytes: number;
    document_count: number;
  };

  type TKnowledge = {
    id: string;
    name: string;
    description: string;
    stats: TKnowledgeStats;
    select_training: boolean;
    created_at: string;
    updated_at: string;
  };

  type TKnowledgeDocument = {
    id: string;
    kb_name: string;
    status: "uploaded" | "training" | "trained";
    file_name: string;
    file_type: string;
    file_size: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    metadata: {
      diabetes_score_avg: number;
      is_training: boolean;
    };
  };

  type TGetKnowledgeDocumentsResponse = {
    documents: TKnowledgeDocument[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

declare namespace REQUEST {
  type TCreateKnowledgeBaseRequest = {
    name: string;
    description: string;
  };

  type TCreateDocumentRequest = {
    file: File;
    chunk_size: 1000;
    chunk_overlap: 200;
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
    name: string;
    description: string;
    document_count: number;
    created_at: string;
    updated_at: string;
    total_size_mb: number;
  };

  type TGetKnowledgeBaseListResponse = {
    knowledge_bases: TKnowledgeBase[];
  };

  type TKnowledgeBaseDocument = {
    filename: string;
    size: number;
    last_modified: string;
    content_type: string;
  };

  type TKnowledgeBaseStats = {
    total_documents: number;
    total_size_bytes: number;
    file_types: Record<string, number>;
    documents: TKnowledgeBaseDocument[];
    collection_name: string;
    last_updated: string;
  };

  type TFileInfo = {
    filename: string;
    file_size: number;
    file_extension: string;
    content_type: string;
    upload_time: string;
    storage_path: string;
    storage_time: string;
  };

  type TProcessedFileResponse = {
    success: boolean;
    message: string;
    file_info: FileInfo;
    document_ids: string[];
  };

  type TSuggestPromptResponse = {
    suggested_template: string;
  };

  type TSettings = {
    id: string;
    system_prompt: string;
    available_collections: string[];
    default_language: string;
    search_settings: {
      k: number;
      score_threshold: number;
    };
    created_at: string;
    updated_at: string;
  };
}

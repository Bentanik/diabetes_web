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

    type TTrainingDocumentRequest = {
        document_id: string;
    };

    type TUpdateSettingsRequest = {
        top_k?: number;
        accuracy_threshold?: number;
        system_prompt?: string;
        context_prompt?: string;
        max_tokens?: number;
        temperature?: number;
        list_knowledge_ids?: string[];
    };

    type TGetDocumentParserRequest = {
        document_id: string;
        page?: number;
        limit?: number;
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

    type TDocumentType =
        | "uploaded_document"
        | "training_document"
        | "trained_document";

    type TDocumentFile = {
        path: string;
        size_bytes: number;
        name: string;
        type: string;
    };

    type TDocument = {
        id: string;
        knowledge_id: string;
        title: string;
        description: string;
        document_type: TDocumentType;
        file: TDocumentFile;
        file_hash: string;
        priority_diabetes: number;
        created_at: string;
        updated_at: string;
    };

  type TDocumentParser = {
    id: string;
    document_id: string;
    content: string;
    location: TLocation;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };

  type TSettings = {
    top_k: number;
    temperature: number;
    max_tokens: number;
    search_accuracy: number;
  };
}

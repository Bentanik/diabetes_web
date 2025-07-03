declare namespace REQUEST {
  type TCreateKnowledgeBaseRequest = {
    name: string;
    description: string;
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
}

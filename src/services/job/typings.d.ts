declare namespace REQUEST {}

declare namespace API {
  type TJob = {
    id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    status: "queued" | "processing" | "completed" | "failed";
    progress: number;
    current_step: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
    error_message?: string;
    document_id?: string;
    minio_object_name?: string;
    minio_bucket_name?: string;
    kb_name?: string;
    diabetes_score?: number;
    matched_keywords?: string[];
    total_documents?: number;
    rejection_reason?: string;
  };
}

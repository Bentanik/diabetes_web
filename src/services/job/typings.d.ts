declare namespace REQUEST {}

declare namespace API {
  type TJob = {
    id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    title: string;
    description: string;
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
    diabetes_score_avg?: number;
    rejection_reason?: string;
    is_deleted?: boolean;
    is_duplicate?: boolean;
  };
}

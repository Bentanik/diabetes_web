declare namespace REQUEST {
  type TJobType = "upload_document" | "training_document";
}

declare namespace API {
  type TProgress = {
    status: "queued" | "processing" | "completed" | "failed";
    progress: number;
    progress_message: string;
  };

  type TDocumentJobFile = {
    file_path: string;
    file_name: string;
    file_size_bytes: number;
    file_type: string;
  };

  type TStatus = {
    status: "queued" | "processing" | "completed" | "failed";
    progress: number;
    progress_message: string;
  };

  type TJob = {
    id: string;
    document_id: string;
    knowledge_id: string;
    title: string;
    description: string;
    file: TDocumentJobFile;
    type: "upload_document" | "training_document";
    status: TStatus;
    progress: TProgress;
    priority_diabetes: number;
    is_document_delete: boolean;
    is_document_duplicate: boolean;
    created_at: string;
    updated_at: string;
  };
}

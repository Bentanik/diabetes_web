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
    status: "queued" | "processing" | "completed" | "failed" | "pending";
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
    processing_status: TStatus;
    priority_diabetes: number;
    document_status: "normal" | "deleted" | "duplicate";
    created_at: string;
    updated_at: string;
  };
}

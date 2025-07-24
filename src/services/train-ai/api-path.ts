/* eslint-disable import/no-anonymous-default-export */
// const TRAIN_AI = "http://localhost:5023/api/v1/rag";
// const KNOWLEDGE_BASE = TRAIN_AI + "/knowledge-bases";

const TRAIN_AI = "http://localhost:8000/api/v1/rag";
const KNOWLEDGE = TRAIN_AI + "/knowledges";

const KNOWLEDGE_DOCUMENTS = `${KNOWLEDGE}/documents`;

const KNOWLEDGE_GET_DOCUMENT_BY_ID = (id: string) =>
  `${KNOWLEDGE}/${id}/documents`;

const KNOWLEDGE_BASE_UPLOAD_DOCUMENT = `${KNOWLEDGE_DOCUMENTS}/upload`;

const KNOWLEDGE_BASE_DOWNLOAD_DOCUMENT = (id: string) =>
  `${KNOWLEDGE_DOCUMENTS}/${id}/download`;

const KNOWLEDGE_BASE_TRAIN_DOCUMENT = (id: string) =>
  `${KNOWLEDGE_DOCUMENTS}/${id}/training`;

export default {
  KNOWLEDGE,
  KNOWLEDGE_BASE_DOCUMENTS: KNOWLEDGE_DOCUMENTS,
  KNOWLEDGE_BASE_UPLOAD_DOCUMENT,
  KNOWLEDGE_BASE_DOWNLOAD_DOCUMENT,
  KNOWLEDGE_BASE_GET_DOCUMENT_BY_ID: KNOWLEDGE_GET_DOCUMENT_BY_ID,
  KNOWLEDGE_BASE_TRAIN_DOCUMENT,
};

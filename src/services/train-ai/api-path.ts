/* eslint-disable import/no-anonymous-default-export */
const TRAIN_AI = "http://localhost:8000/api/v1/rag";
const KNOWLEDGES = TRAIN_AI + "/knowledges";

const KNOWLEDGE_BASE_DOCUMENTS = `${KNOWLEDGES}/documents`;

const KNOWLEDGE_BASE_GET_DOCUMENT_BY_ID = (id: string) =>
  `${KNOWLEDGES}/${id}/documents`;

const KNOWLEDGE_BASE_UPLOAD_DOCUMENT = `${KNOWLEDGE_BASE_DOCUMENTS}/upload`;

const KNOWLEDGE_BASE_DOWNLOAD_DOCUMENT = (id: string) =>
  `${KNOWLEDGE_BASE_DOCUMENTS}/${id}/download`;

const KNOWLEDGE_BASE_TRAIN_DOCUMENT = (id: string) =>
  `${KNOWLEDGE_BASE_DOCUMENTS}/${id}/training`;

export default {
  KNOWLEDGES,
  KNOWLEDGE_BASE_DOCUMENTS,
  KNOWLEDGE_BASE_UPLOAD_DOCUMENT,
  KNOWLEDGE_BASE_DOWNLOAD_DOCUMENT,
  KNOWLEDGE_BASE_GET_DOCUMENT_BY_ID,
  KNOWLEDGE_BASE_TRAIN_DOCUMENT,
};

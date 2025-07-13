/* eslint-disable import/no-anonymous-default-export */
const TRAIN_AI = "http://localhost:5023/api/v1/rag";
const KNOWLEDGE_BASE = TRAIN_AI + "/knowledge-bases";

// const KNOWLEDGE_BASE_UPLOAD_DOCUMENT = (name: string) =>
//   `${KNOWLEDGE_BASE}/${name}/documents/upload`;

const KNOWLEDGE_BASE_DOCUMENTS = `${KNOWLEDGE_BASE}/documents`;

const KNOWLEDGE_BASE_UPLOAD_DOCUMENT = `${KNOWLEDGE_BASE_DOCUMENTS}/upload`;

const KNOWLEDGE_BASE_DOWNLOAD_DOCUMENT = (id: string) =>
  `${KNOWLEDGE_BASE_DOCUMENTS}/${id}/download`;

export default {
  KNOWLEDGE_BASE,
  KNOWLEDGE_BASE_DOCUMENTS,
  KNOWLEDGE_BASE_UPLOAD_DOCUMENT,
  KNOWLEDGE_BASE_DOWNLOAD_DOCUMENT,
};

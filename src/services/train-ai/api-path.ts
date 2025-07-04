/* eslint-disable import/no-anonymous-default-export */
const TRAIN_AI = "http://localhost:8000/api/v1/rag";
const KNOWLEDGE_BASE = TRAIN_AI + "/knowledge-bases";

const KNOWLEDGE_BASE_STATS = (name: string) =>
  `${KNOWLEDGE_BASE}/${name}/documents/stats`;

const KNOWLEDGE_BASE_UPLOAD_DOCUMENT = (name: string) =>
  `${KNOWLEDGE_BASE}/${name}/documents`;

export default {
  KNOWLEDGE_BASE,
  KNOWLEDGE_BASE_STATS,
  KNOWLEDGE_BASE_UPLOAD_DOCUMENT,
};

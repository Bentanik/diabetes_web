/* eslint-disable import/no-anonymous-default-export */
const TRAIN_AI = "http://localhost:8000/api/v1/rag";
const KNOWLEDGES = TRAIN_AI + "/knowledges";

const DOCUMENTS = `${TRAIN_AI}/documents`;

const GET_DOCUMENT_BY_ID = (id: string) => `${DOCUMENTS}/${id}`;

const DOWNLOAD_DOCUMENT = (id: string) => `${DOCUMENTS}/${id}/download`;

const TRAIN_DOCUMENT = `${TRAIN_AI}/train-ai`;

const SETTING = `${TRAIN_AI}/setting`;

export default {
  KNOWLEDGES,
  DOCUMENTS,
  GET_DOCUMENT_BY_ID,
  DOWNLOAD_DOCUMENT,
  TRAIN_DOCUMENT,
  SETTING,
};

/* eslint-disable import/no-anonymous-default-export */
const CHAT = "http://localhost:5023/api/v1/chat";
const SESSION = CHAT + "/session-chat";

const CHAT_HISTORY = SESSION + "/history";

export default {
  CHAT,
  SESSION,
  CHAT_HISTORY,
};

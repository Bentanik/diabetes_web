/* eslint-disable import/no-anonymous-default-export */

const CONVERSATION =
    "http://163.61.110.211:30000/chat-service/api/v1/conversations";
const HOSPITAL_CONVERSATION =
    "http://163.61.110.211:30000/chat-service/api/v1/hospital-conversations";

// Hospital
const GET_CONVERSATIONS = HOSPITAL_CONVERSATION;

const CREATE_CONVERSATION = HOSPITAL_CONVERSATION;

// Conversation
const GET_AVAILABLE_USERS = (conversationId: string) =>
    `${HOSPITAL_CONVERSATION}/${conversationId}/available-users`;

const ADD_MEMBERS = (conversationId: string) =>
    `${HOSPITAL_CONVERSATION}/${conversationId}/members`;

const ADD_DOCTOR = (conversationId: string) =>
    `${HOSPITAL_CONVERSATION}/${conversationId}/doctors`;

const ADD_STAFF = (conversationId: string) =>
    `${HOSPITAL_CONVERSATION}/${conversationId}/admins`;

const DELETE_CONVERSATION = (conversationId: string) =>
    `${HOSPITAL_CONVERSATION}/${conversationId}`;

const GET_CONVERSATION = (conversationId: string) =>
    `${CONVERSATION}/${conversationId}/participants`;

const DELETE_PARTICIPANT = (conversationId: string) =>
    `${HOSPITAL_CONVERSATION}/${conversationId}/participants`;

const UPDATE_CONVERSATION = DELETE_CONVERSATION;
const GET_CONVERSATION_DETAIL = (conversationId: string) =>
    `${CONVERSATION}/${conversationId}`;

export default {
    CONVERSATION,
    GET_CONVERSATIONS,
    GET_AVAILABLE_USERS,
    CREATE_CONVERSATION,
    ADD_MEMBERS,
    ADD_DOCTOR,
    ADD_STAFF,
    DELETE_CONVERSATION,
    GET_CONVERSATION,
    DELETE_PARTICIPANT,
    UPDATE_CONVERSATION,
    GET_CONVERSATION_DETAIL,
};

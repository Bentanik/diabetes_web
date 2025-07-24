/* eslint-disable import/no-anonymous-default-export */

const CONVERSATION =
    "https://chat-doctor-h5awemg3hcfacwdv.southeastasia-01.azurewebsites.net/api/v1/conversations";
const HOSPITAL_CONVERSATION =
    "https://chat-doctor-h5awemg3hcfacwdv.southeastasia-01.azurewebsites.net/api/v1/hospitals/conversations";

// Hospital
const GET_CONVERSATIONS = HOSPITAL_CONVERSATION;

const CREATE_CONVERSATION = HOSPITAL_CONVERSATION;

// Conversation
const GET_AVAILABLE_USERS = (conversationId: string) =>
    `${CONVERSATION}/${conversationId}/available-users`;

const ADD_MEMBERS = (conversationId: string) =>
    `${CONVERSATION}/${conversationId}/members`;

const ADD_DOCTOR = (conversationId: string) =>
    `${CONVERSATION}/${conversationId}/doctors`;

const ADD_STAFF = (conversationId: string) =>
    `${CONVERSATION}/${conversationId}/admins`;

const DELETE_CONVERSATION = (conversationId: string) =>
    `${CONVERSATION}/${conversationId}`;

const GET_CONVERSATION = (conversationId: string) =>
    `${CONVERSATION}/${conversationId}/participants`;

const DELETE_PARTICIPANT = GET_CONVERSATION;

const UPDATE_CONVERSATION = DELETE_CONVERSATION;
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
};

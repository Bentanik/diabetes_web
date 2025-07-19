/* eslint-disable import/no-anonymous-default-export */

const CONVERSATION =
    "https://chat-doctor-h5awemg3hcfacwdv.southeastasia-01.azurewebsites.net/api/v1/conversations";

const GET_CONVERSATIONS = CONVERSATION + "/hospital";

const USER =
    "https://chat-doctor-h5awemg3hcfacwdv.southeastasia-01.azurewebsites.net/api/v1/users";
const GET_AVAILABLE_USERS = USER;
const CREATE_CONVERSATION = CONVERSATION;
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

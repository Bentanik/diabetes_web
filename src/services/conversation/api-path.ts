/* eslint-disable import/no-anonymous-default-export */

const CONVERSATION =
    "https://chat-doctor-h5awemg3hcfacwdv.southeastasia-01.azurewebsites.net/api/v1/conversations";

const USER =
    "https://chat-doctor-h5awemg3hcfacwdv.southeastasia-01.azurewebsites.net/api/v1/users";
const GET_AVAILABLE_USERS = USER;
const CREATE_CONVERSATION = CONVERSATION;
const ADD_MEMBERS = (conversationId: string) =>
    `${CONVERSATION}/${conversationId}/members`;

const ADD_DOCTOR = (conversationId: string) =>
    `${CONVERSATION}/${conversationId}/doctors`;
export default {
    CONVERSATION,
    GET_AVAILABLE_USERS,
    CREATE_CONVERSATION,
    ADD_MEMBERS,
};

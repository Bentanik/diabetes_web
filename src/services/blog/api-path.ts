/* eslint-disable import/no-anonymous-default-export */

const POST = "http://163.61.110.211:30000/media-service/api/v1/posts";
const CREATE_POST = POST;
const GET_POSTS = POST + "/system";
const GET_POST = (id: string) => `${GET_POSTS}/${id}`;
const UPDATE_POST = (id: string) => `${POST}/${id}`;
const DELETE_POST = UPDATE_POST;
const REVIEW_POST = (id: string) => `${POST}/review/${id}`;

export default {
    CREATE_POST,
    GET_POSTS,
    GET_POST,
    UPDATE_POST,
    DELETE_POST,
    REVIEW_POST,
};

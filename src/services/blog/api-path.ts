/* eslint-disable import/no-anonymous-default-export */

const POST =
    "https://media-doctor-cth2d9c9c0gwdfg6.southeastasia-01.azurewebsites.net/api/v1/posts";
const GET_POSTS = POST + "/system";
const GET_POST = (id: string) => `${GET_POSTS}/${id}`;
const UPDATE_POST = (id: string) => `${POST}/${id}`;
const REVIEW_POST = (id: string) => `${POST}/review/${id}`;

export default {
    POST,
    GET_POSTS,
    GET_POST,
    UPDATE_POST,
    REVIEW_POST,
};

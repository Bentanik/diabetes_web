/* eslint-disable import/no-anonymous-default-export */

const POST =
    "https://capstonegateway-dqdrf9g0g9h0ffdd.southeastasia-01.azurewebsites.net/api/v1/posts";
const CREATE_POST = POST;
// const UPDATE_POST_DRAFT = (id: string) => `${CREATE_POST}/${id}`;
const GET_POSTS = POST + "/system";
const GET_POST = (id: string) => `${GET_POSTS}/${id}`;
const UPDATE_POST = (id: string) => `${POST}/${id}`;
const REVIEW_POST = (id: string) => `${POST}/review/${id}`;

export default {
    CREATE_POST,
    GET_POSTS,
    GET_POST,
    UPDATE_POST,
    REVIEW_POST,
};

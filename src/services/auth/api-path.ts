/* eslint-disable import/no-anonymous-default-export */
const AUTH =
    "https://capstonegateway-dqdrf9g0g9h0ffdd.southeastasia-01.azurewebsites.net/api/v1/auth";
const LOGIN = AUTH + "/system/login-email";
const SEND_REGISTER_EMAIL = AUTH + "/send-register-email";
const VERIFY_REGISTER_EMAIL = AUTH + "/verify-register-email";
const REGISTER_EMAIL = AUTH + "/register-email";
const REFRESH_TOKEN = AUTH + "/refresh-token";
const FORGOT_PASSWORD = AUTH + "/forgot-password";
const VERIFY_FORGOT_PASSWORD = AUTH + "/verify-forgot-password";
const LOGOUT = AUTH + "/logout";


export default {
    LOGIN,
    SEND_REGISTER_EMAIL,
    VERIFY_REGISTER_EMAIL,
    REGISTER_EMAIL,
    REFRESH_TOKEN,
    FORGOT_PASSWORD,
    VERIFY_FORGOT_PASSWORD,
    LOGOUT,
};

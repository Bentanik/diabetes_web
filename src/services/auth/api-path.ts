/* eslint-disable import/no-anonymous-default-export */
const AUTH = "http://localhost:5206/api/v1/auth";
const LOGIN = AUTH + "/system/login-email";
const SEND_REGISTER_EMAIL = AUTH + "/send-register-email";
const VERIFY_REGISTER_EMAIL = AUTH + "/verify-register-email";
const REGISTER_EMAIL = AUTH + "/register-email";
const REFRESH_TOKEN = AUTH + "/refresh-token";

export default {
  LOGIN,
  SEND_REGISTER_EMAIL,
  VERIFY_REGISTER_EMAIL,
  REGISTER_EMAIL,
  REFRESH_TOKEN,
};

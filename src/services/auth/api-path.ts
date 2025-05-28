/* eslint-disable import/no-anonymous-default-export */
const AUTH = "https://localhost:1121/api/v1/auth";
const LOGIN = AUTH + "/login-by-emailpassword";
const SEND_REGISTER_EMAIL = AUTH + "/send-register-email";
const VERIFY_REGISTER_EMAIL = AUTH + "/verify-register-email";
const REGISTER_EMAIL = AUTH + "/register-email";

export default {
  LOGIN,
  SEND_REGISTER_EMAIL,
  VERIFY_REGISTER_EMAIL,
  REGISTER_EMAIL
};

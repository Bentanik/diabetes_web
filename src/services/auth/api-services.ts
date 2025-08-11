import API_ENDPOINTS from "@/services/auth/api-path";
import request from "@/services/interceptor";

export const sendRegisterEmailAsync = async (
    body: REQUEST.TSendRegisterEmail
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.SEND_REGISTER_EMAIL,
        {
            method: "POST",
            data: body,
        }
    );

    return response.data;
};

export const verifyRegisterEmailAsync = async (
    body: REQUEST.TVerifyRegisterEmail
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.VERIFY_REGISTER_EMAIL,
        {
            method: "POST",
            data: body,
        }
    );

    return response.data;
};

export const registerEmailAsync = async (body: REQUEST.TRegisterEmail) => {
    const response = await request<TResponseData<API.TLoginResponseDto>>(
        API_ENDPOINTS.REGISTER_EMAIL,
        {
            method: "POST",
            data: body,
        }
    );
    return response.data;
};

export const loginAsync = async (body: REQUEST.TLogin) => {
    const response = await request<TResponseData<API.TLoginResponseDto>>(
        API_ENDPOINTS.LOGIN,
        {
            method: "POST",
            data: body,
        }
    );

    return response.data;
};

export const refreshTokenAsync = async (body: REQUEST.TRereshToken) => {
    const response = await request<TResponseData<API.TLoginResponseDto>>(
        API_ENDPOINTS.LOGIN,
        {
            method: "POST",
            data: body,
        }
    );

    return response.data;
};

export const forgotPasswordAsync = async (body: REQUEST.TForgotPasswordEmail) => {
    const response = await request<TResponseData>(
        API_ENDPOINTS.FORGOT_PASSWORD,
        {
            method: "POST",
            data: body,
        }
    );
    return response.data;
};

export const verifyForgotPasswordAsync = async (body: REQUEST.TVerifyForgotPassword) => {
    const response = await request<TResponseData>(
        API_ENDPOINTS.VERIFY_FORGOT_PASSWORD,
        {
            method: "POST",
            data: body,
        }
    );
    return response.data;
};

export const logoutAsync = async () => {
    const response = await request<TResponseData>(
        API_ENDPOINTS.LOGOUT,
        {
            method: "DELETE",
        }
    );
    return response.data;
};
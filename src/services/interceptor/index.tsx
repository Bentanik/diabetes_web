/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    getStorageItem,
    removeStorageItem,
    setStorageItem,
} from "@/utils/local-storage";
import axios from "axios";
//   import { refreshToken } from "@/services/auth/api-services";
import useToast from "@/hooks/use-toast";
import { refreshTokenAsync } from "@/services/auth/api-services";
//   import useLogout from "@/hooks/use-logout";

const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER,
    timeout: 50000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

const handleLogout = () => {
    //   useLogout().handleLogout();
};

let refreshTokenPromise: any = null;

const errorHandler = async (error: any) => {
    const responseMeta: TMeta = error.response?.data as TMeta;
    const { addToast } = useToast();

    if (!error?.response) {
        const result: TMeta = {
            detail: "Network not available!",
            errorCode: "NetWork_503",
            status: 503,
            title: "Network not available!",
        };
        addToast({
            type: "error",
            description: result.detail,
            duration: 5000,
        });
        return Promise.reject(result);
    }

    // Xử lý lỗi 403 và refresh token trước
    if (
        error.response?.status === 403 &&
        error?.config &&
        !(error.config as any)._retry
    ) {
        const originalRequest = error?.config;
        const refreshToken = getStorageItem("refreshToken");

        if (refreshToken) {
            if (!refreshTokenPromise) {
                refreshTokenPromise = refreshTokenAsync({
                    refreshToken: refreshToken,
                })
                    .then((res: any) => {
                        setStorageItem("accessToken", res.value.accessToken);
                        setStorageItem(
                            "refreshToken",
                            res.value.data.refreshToken
                        );
                        return res;
                    })
                    .catch((err: any) => {
                        removeStorageItem("accessToken");
                        removeStorageItem("refreshToken");
                        location.href = "/";
                        return Promise.reject(err);
                    })
                    .finally(() => {
                        refreshTokenPromise = null;
                    });
            }

            return refreshTokenPromise.then(() => {
                // Đánh dấu request này đã retry để tránh vòng lặp vô hạn
                (originalRequest as any)._retry = true;
                originalRequest.headers.Authorization = `Bearer ${getStorageItem(
                    "accessToken"
                )}`;
                return request(originalRequest);
            });
        } else {
            // Không có refresh token, redirect về trang chủ
            location.href = "/";
            return Promise.reject(error);
        }
    }

    // Xử lý các lỗi khác sau khi đã xử lý 403
    switch (responseMeta.errorCode) {
        case "auth_forgot_01":
            addToast({
                type: "error",
                description: responseMeta.detail,
                duration: 5000,
            });
            break;
        case "account_ban_01":
            addToast({
                type: "error",
                description: responseMeta.detail,
                duration: 5000,
            });
            handleLogout();
            break;
        default:
            break;
    }
};

request.interceptors.request.use(
    (config: any) => {
        const token = getStorageItem("accessToken");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

request.interceptors.response.use(
    (response: any) => {
        if (response.data?.status && response.data?.status >= 400) {
            return Promise.reject(response.data);
        }
        return response;
    },
    (error: any) => {
        return errorHandler(error);
    }
);

export default request;

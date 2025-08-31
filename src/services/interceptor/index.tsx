/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    getStorageItem,
    removeStorageItem,
    setAuthStorage,
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
    } else {
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
    }

    if (error.response?.status === 401 && error?.config) {
        const originalRequest = error?.config;
        const refreshToken = getStorageItem("refreshToken");
        if (!refreshTokenPromise) {
            refreshTokenPromise = refreshTokenAsync({
                refreshToken: refreshToken || "",
            })
                .then((res: any) => {
                    const authToken = res.data.authToken as API.TAuthTokenDto;
                    setAuthStorage(authToken);
                })
                .catch((err: any) => {
                    removeStorageItem("accessToken");
                    location.href = "/";
                    return Promise.reject(err);
                })
                .finally(() => {
                    refreshTokenPromise = null;
                });
        }

        return refreshTokenPromise.then(() => {
            originalRequest.headers.Authorization =
                getStorageItem("accessToken");
            return request(originalRequest);
        });
    }

    return Promise.reject(responseMeta);
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

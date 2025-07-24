/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    getStorageItem,
    removeStorageItem,
    setStorageItem,
} from "@/utils/local-storage";
import axios, { AxiosError } from "axios";
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

const errorHandler = async (error: AxiosError) => {
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

    if (error?.response?.status === 403) {
        const result: TMeta = {
            detail: "Not permission",
            errorCode: "Forbident",
            status: 403,
            title: "Not permission",
        };
        addToast({
            type: "error",
            description: "Sorry, you do not permission",
            duration: 5000,
        });
        return Promise.reject(result);
    }

    if (error.response?.status === 401 && error?.config) {
        const originalRequest = error?.config;
        const refreshToken = getStorageItem("refreshToken");
        if (!refreshTokenPromise) {
            refreshTokenPromise = refreshTokenAsync({
                refreshToken: refreshToken || "",
            })
                .then((res: any) => {
                    setStorageItem("accessToken", res.value.data.accessToken);
                    setStorageItem("refreshToken", res.value.data.refreshToken);
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
    (config) => {
        const token = getStorageItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

request.interceptors.response.use(
    (response) => {
        if (response.data?.status && response.data?.status >= 400) {
            return Promise.reject(response.data);
        }
        return response;
    },
    (error) => {
        return errorHandler(error);
    }
);

export default request;

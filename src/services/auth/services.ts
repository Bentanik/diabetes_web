/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import useToast from "@/hooks/use-toast";
import {
    loginAsync,
    registerEmailAsync,
    sendRegisterEmailAsync,
    verifyRegisterEmailAsync,
} from "@/services/auth/api-services";
import { useAppDispatch } from "@/stores";
import { setInfoUser } from "@/stores/user-slice";
import { removeAuthStorage, setAuthStorage } from "@/utils/local-storage";
import { useMutation } from "@tanstack/react-query";

export const useServiceSendRegisterEmail = () => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TSendRegisterEmail>({
        mutationFn: sendRegisterEmailAsync,
        onSuccess: (data) => {
            if (data) {
                addToast({
                    type: "success",
                    description: data.value.message,
                    duration: 5000,
                });
            }
        },
    });
};

export const useServiceVerifyRegisterEmail = () => {
    const { addToast } = useToast();

    return useMutation<TResponse, TMeta, REQUEST.TVerifyRegisterEmail>({
        mutationFn: verifyRegisterEmailAsync,
        onSuccess: (data) => {
            if (data) {
                addToast({
                    type: "success",
                    description: data.value.message,
                    duration: 5000,
                });
            }
        },
    });
};

export const useServiceRegisterEmail = () => {
    const { addToast } = useToast();
    const dispatch = useAppDispatch();

    return useMutation<
        TResponseData<API.TLoginResponseDto>,
        TMeta,
        REQUEST.TRegisterEmail
    >({
        mutationFn: registerEmailAsync,
        onSuccess: (data) => {
            try {
                if (data) {
                    const { authToken, authUser } =
                        data.data as API.TLoginResponseDto;
                    addToast({
                        type: "success",
                        description: data.message,
                        duration: 5000,
                    });
                    setAuthStorage(authToken);
                    dispatch(setInfoUser(authUser));
                }
            } catch (ex: any) {
                removeAuthStorage();
            }
        },
    });
};

export const useServiceLogin = () => {
    const { addToast } = useToast();
    const dispatch = useAppDispatch();

    return useMutation<
        TResponseData<API.TLoginResponseDto>,
        TMeta,
        REQUEST.TLogin
    >({
        mutationFn: loginAsync,
        onSuccess: (data) => {
            try {
                if (data) {
                    const { authToken, authUser } =
                        data.data as API.TLoginResponseDto;
                    addToast({
                        type: "success",
                        description: data.message,
                        duration: 5000,
                    });
                    setAuthStorage(authToken);
                    dispatch(setInfoUser(authUser));
                }
            } catch (ex) {
                removeAuthStorage();
            }
        },
    });
};

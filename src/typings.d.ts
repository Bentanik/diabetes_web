import { error } from "console";

declare type TMeta = {
    type?: string;
    title: string;
    status: number;
    errorCode: string;
    detail: string;
};

declare type TResponse<T = object | null> = {
    value: {
        code: string;
        message: string;
        data: T | null;
    };
    isSuccess: boolean;
    isFailure: boolean;
    error: {
        code: string;
        message: string;
    };
};

declare type TResponseData<T = object | null> = {
    code: string;
    message: string;
    data: T | null;
    isSuccess: boolean;
    isFailure: boolean;
    error: {
        code: string;
        message: string;
    };
};

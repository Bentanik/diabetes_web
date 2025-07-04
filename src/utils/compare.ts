// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTMeta = (error: any): error is TMeta => {
    return (
        typeof error === "object" &&
        error !== null &&
        "detail" in error &&
        "errorCode" in error &&
        "status" in error &&
        "title" in error
    );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTResponse = (data: any): data is TResponse => {
    return data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTResponseData = (data: any): data is TResponseData => {
    return data;
};

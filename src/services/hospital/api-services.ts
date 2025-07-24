import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/hospital/api-path";
import { TResponse } from "@/typings";

export const createHospitalAsync = async (body: FormData) => {
    const response = await request<TResponse>(API_ENDPOINTS.CREATE_HOSPITAL, {
        method: "POST",
        data: body,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

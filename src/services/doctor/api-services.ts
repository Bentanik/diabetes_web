import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/doctor/api-path";
import { TResponse } from "@/typings";

export const createDoctorAsync = async (body: REQUEST.TCreateDoctor) => {
    const response = await request<TResponse>(API_ENDPOINTS.CREATE_DOCTOR, {
        method: "POST",
        data: body,
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/consultation/api-path";
import { TResponse } from "@/typings";

export const createConsultationAsync = async (
    { doctorId }: REQUEST.DoctorId,
    body: REQUEST.TCreateConsultation
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.CREATE_CONSULTATION(doctorId),
        {
            method: "POST",
            data: body,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

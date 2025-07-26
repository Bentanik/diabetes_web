import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/doctor/api-path";
import { TResponseData } from "@/typings";

export const getDoctorDetail = async ({ doctorId }: REQUEST.DoctorId) => {
    const response = await request<TResponseData<API.TGetDoctorDetail>>(
        API_ENDPOINTS.GET_DOCTOR(doctorId),
        {
            method: "GET",
        }
    );
    return response.data;
};

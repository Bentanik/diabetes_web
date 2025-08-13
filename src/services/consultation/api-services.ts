import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/consultation/api-path";

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

export const updateConsultationAsync = async (
    { doctorId }: REQUEST.DoctorId,
    body: REQUEST.TUpdateTimeTemplateRequest
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.UPDATE_CONSULTATION(doctorId),
        {
            method: "PATCH",
            data: body,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

export const getConsultationsCursor = async (
    { doctorId }: REQUEST.DoctorId,
    {
        pageSize = 10,
        cursor = "",
        fromDate = "",
        toDate = "",
    }: REQUEST.GetConsultationsCursorParams
) => {
    const params: Record<
        string,
        string | number | boolean | string[] | undefined
    > = {};

    if (pageSize !== null) {
        params.pageSize = pageSize;
    }
    if (cursor && cursor.trim() !== "") {
        params.cursor = cursor.trim();
    }
    if (fromDate && fromDate.trim() !== "") {
        params.fromDate = fromDate.trim();
    }
    if (toDate && toDate.trim() !== "") {
        params.toDate = toDate.trim();
    }
    const response = await request<TResponseData<API.TGetConsultations>>(
        API_ENDPOINTS.GET_CONSULTATIONS(doctorId),
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : [],
        }
    );
    return response.data;
};

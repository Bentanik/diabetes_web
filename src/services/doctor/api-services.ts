import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/doctor/api-path";
import { TResponse, TResponseData } from "@/typings";

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

export const getDoctors = async ({
    pageIndex = 1,
    sortBy = "createdDate",
    sortDirection = 1,
    gender = 1,
    position = 0,
    search = "",
}: REQUEST.GetDoctorsParams) => {
    const params: Record<
        string,
        string | number | boolean | string[] | undefined
    > = {};
    params.pageIndex = pageIndex;

    if (search && search.trim() !== "") {
        params.search = search.trim();
    }
    if (gender !== undefined) {
        params.gender = gender;
    }
    if (position !== undefined) {
        params.position = position;
    }
    if (sortBy && sortBy.trim() !== "") {
        params.sortBy = sortBy.trim();
    }
    if (sortDirection !== undefined) {
        params.sortDirection = sortDirection;
    }
    const response = await request<TResponseData<API.TGetDoctors>>(
        API_ENDPOINTS.GET_DOCTORS,
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : [],
        }
    );
    return response.data;
};

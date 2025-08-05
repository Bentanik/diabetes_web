import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/doctor/api-path";

export const getDoctorDetail = async ({ doctorId }: REQUEST.DoctorId) => {
    const response = await request<TResponseData<API.TGetDoctorDetail>>(
        API_ENDPOINTS.GET_DOCTOR(doctorId),
        {
            method: "GET",
        }
    );
    return response.data;
};

export const getDoctors = async ({
    pageIndex = 1,
    sortBy = "name",
    sortDirection = 1,
    pageSize = 10,
    gender = 1,
    position = 0,
    cursor = "",
    search = "",
}: REQUEST.GetDoctorsCursorParams) => {
    const params: Record<
        string,
        string | number | boolean | string[] | undefined
    > = {};
    if (pageIndex !== null) {
        params.pageIndex = pageIndex;
    }
    if (pageSize !== null) {
        params.pageSize = pageSize;
    }
    if (search && search.trim() !== "") {
        params.search = search.trim();
    }
    if (gender !== null) {
        params.gender = gender;
    }
    if (position !== null) {
        params.position = position;
    }
    if (sortBy && sortBy.trim() !== "") {
        params.sortBy = sortBy.trim();
    }
    if (cursor && cursor.trim() !== "") {
        params.cursor = cursor.trim();
    }
    if (sortDirection !== undefined) {
        params.sortDirection = sortDirection;
    }
    const response = await request<TResponseData<API.TGetDoctorsCursor>>(
        API_ENDPOINTS.GET_DOCTORS,
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : [],
        }
    );
    return response.data;
};

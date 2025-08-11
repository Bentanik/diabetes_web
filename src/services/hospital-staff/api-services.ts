import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/hospital-staff/api-path";

export const getHospitalStaffDetail = async ({
    hospitalStaffId,
}: REQUEST.hospitalStaffId) => {
    const response = await request<TResponseData<API.TGetHospitalStaffDetail>>(
        API_ENDPOINTS.GET_HOSPITAL_STAFF(hospitalStaffId),
        {
            method: "GET",
        }
    );
    return response.data;
};

export const createHospitalStaffAsync = async (
    body: REQUEST.TCreateHospitalStaff
) => {
    const response = await request<TResponse>(
        API_ENDPOINTS.CREATE_HOSPITAL_STAFF,
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

export const getHospitalStaffs = async ({
    pageIndex = 1,
    sortBy = "createdDate",
    sortDirection = 1,
    pageSize = 10,
    gender = 1,
    search = "",
}: REQUEST.GetHospitalStaffsParams) => {
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
    if (sortBy && sortBy.trim() !== "") {
        params.sortBy = sortBy.trim();
    }
    if (sortDirection !== undefined) {
        params.sortDirection = sortDirection;
    }
    const response = await request<TResponseData<API.TGetHospitalStaffs>>(
        API_ENDPOINTS.GET_HOSPITAL_STAFFS,
        {
            method: "GET",
            params: Object.keys(params).length > 0 ? params : [],
        }
    );
    return response.data;
};

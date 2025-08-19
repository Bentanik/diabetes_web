/* eslint-disable import/no-anonymous-default-export */
const HOSPITAL_STAFF_ADMIN =
    "https://capstonegateway-dqdrf9g0g9h0ffdd.southeastasia-01.azurewebsites.net/user-service/api/v1/hospitals/me/hospitalstaffs";

const HOSPITAL_STAFF =
    "https://capstonegateway-dqdrf9g0g9h0ffdd.southeastasia-01.azurewebsites.net/user-service/api/v1/hospitals/hospitalstaffs";

const GET_HOSPITAL_STAFFS = HOSPITAL_STAFF_ADMIN;
const GET_HOSPITAL_STAFF = (hospitalStaffId: string) =>
    `${HOSPITAL_STAFF}/${hospitalStaffId}`;
const CREATE_HOSPITAL_STAFF = HOSPITAL_STAFF;

export default {
    GET_HOSPITAL_STAFFS,
    GET_HOSPITAL_STAFF,
    CREATE_HOSPITAL_STAFF,
};

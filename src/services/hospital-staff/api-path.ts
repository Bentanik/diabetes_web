/* eslint-disable import/no-anonymous-default-export */
const HOSPITAL_STAFF =
    "https://capstonegateway-dqdrf9g0g9h0ffdd.southeastasia-01.azurewebsites.net/api/v1/hospitals/me/hospitalstaffs";

const GET_HOSPITAL_STAFFS = HOSPITAL_STAFF;
const GET_HOSPITAL_STAFF = (hospitalStaffId: string) =>
    `${HOSPITAL_STAFF}/${hospitalStaffId}`;

export default {
    GET_HOSPITAL_STAFFS,
    GET_HOSPITAL_STAFF,
};

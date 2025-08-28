/* eslint-disable import/no-anonymous-default-export */
const HOSPITAL_STAFF_ADMIN =
    "http://163.61.110.211:30000/user-service/api/v1/hospitals/me/hospitalstaffs";

const HOSPITAL_STAFF =
    "http://163.61.110.211:30000/user-service/api/v1/hospitals/hospitalstaffs";

const GET_HOSPITAL_STAFFS = HOSPITAL_STAFF_ADMIN;
const GET_HOSPITAL_STAFF = (hospitalStaffId: string) =>
    `${HOSPITAL_STAFF}/${hospitalStaffId}`;
const CREATE_HOSPITAL_STAFF = HOSPITAL_STAFF;

export default {
    GET_HOSPITAL_STAFFS,
    GET_HOSPITAL_STAFF,
    CREATE_HOSPITAL_STAFF,
};

/* eslint-disable import/no-anonymous-default-export */
const DOCTOR =
    "https://capstonegateway-dqdrf9g0g9h0ffdd.southeastasia-01.azurewebsites.net/api/v1/hospitals";
const CREATE_DOCTOR = DOCTOR + "/doctors";
const GET_DOCTORS = DOCTOR + "/me/doctors";

const GET_HOSPITALS = DOCTOR + "/me";
const GET_HOSPITAL = (hospitalId: string) => `${DOCTOR}/${hospitalId}`;

export default {
    CREATE_DOCTOR,
    GET_DOCTORS,
    GET_HOSPITALS,
    GET_HOSPITAL,
};

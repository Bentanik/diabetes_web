/* eslint-disable import/no-anonymous-default-export */
const HOSPITAL = "https://diadoctor.site/user-service/api/v1/hospitals";
const CREATE_DOCTOR = HOSPITAL + "/doctors";
const GET_DOCTORS = HOSPITAL + "/me/doctors";
const GET_HOSPITALS_CURSOR = HOSPITAL;
const GET_HOSPITALS = HOSPITAL + "/me";
const GET_HOSPITAL = (hospitalId: string) => `${HOSPITAL}/${hospitalId}`;
const CREATE_HOSPITAL = HOSPITAL;

export default {
    CREATE_DOCTOR,
    GET_DOCTORS,
    GET_HOSPITALS,
    GET_HOSPITAL,
    GET_HOSPITALS_CURSOR,
    CREATE_HOSPITAL,
};

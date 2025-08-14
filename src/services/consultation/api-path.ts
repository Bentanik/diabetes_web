/* eslint-disable import/no-anonymous-default-export */
const CONSULTATION =
    "https://consultation-doctor-hzfhdqfhd9crd3es.southeastasia-01.azurewebsites.net/api/v1/doctors";

const CREATE_CONSULTATION = (doctorId: string) =>
    `${CONSULTATION}/${doctorId}/consultation-templates`;
const UPDATE_CONSULTATION = CREATE_CONSULTATION;
const GET_CONSULTATIONS = CREATE_CONSULTATION;
export default {
    CREATE_CONSULTATION,
    GET_CONSULTATIONS,
    UPDATE_CONSULTATION,
};

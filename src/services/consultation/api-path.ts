/* eslint-disable import/no-anonymous-default-export */
const CONSULTATION =
    "http://163.61.110.211:30000/consultation-service/api/v1/doctors";

const CREATE_CONSULTATION = (doctorId: string) =>
    `${CONSULTATION}/${doctorId}/consultation-templates`;
const UPDATE_CONSULTATION = CREATE_CONSULTATION;
const GET_CONSULTATIONS = CREATE_CONSULTATION;
export default {
    CREATE_CONSULTATION,
    GET_CONSULTATIONS,
    UPDATE_CONSULTATION,
};

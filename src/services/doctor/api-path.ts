/* eslint-disable import/no-anonymous-default-export */
const DOCTOR = "http://163.61.110.211:30000/user-service/api/v1/doctors";

const GET_DOCTOR = (doctorId: string) => `${DOCTOR}/${doctorId}`;
const GET_DOCTORS = DOCTOR;

export default {
    GET_DOCTOR,
    GET_DOCTORS,
};

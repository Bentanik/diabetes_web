/* eslint-disable import/no-anonymous-default-export */
const DOCTOR =
    "https://capstonegateway-dqdrf9g0g9h0ffdd.southeastasia-01.azurewebsites.net/api/v1/doctors";

const GET_DOCTOR = (doctorId: string) => `${DOCTOR}/${doctorId}`;

export default {
    GET_DOCTOR,
};

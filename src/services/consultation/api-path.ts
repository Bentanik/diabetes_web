/* eslint-disable import/no-anonymous-default-export */
const CONSULTATION =
    "https://consultation-service-decygje5e9gnf8gd.southeastasia-01.azurewebsites.net/api/v1/doctors";

const CREATE_CONSULTATION = (doctorId: string) =>
    `${CONSULTATION}/${doctorId}/consultation-templates`;

export default {
    CREATE_CONSULTATION,
};

declare namespace REQUEST {
    export type DoctorId = {
        doctorId: string;
    };

    type TCreateDoctor = {
        phoneNumber: string;
        firstName: string;
        middleName: string;
        lastName: string;
        dateOfBirth: string;
        gender: number;
        avatar: string;
        numberOfExperiences: number;
        position: number;
        introduction: string;
        images: string[];
    };
}

declare namespace API {}

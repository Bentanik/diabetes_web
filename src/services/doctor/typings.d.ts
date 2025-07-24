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
        gender: GenderType;
        avatarId: string;
        numberOfExperiences: number;
        position: DoctorPositionType;
        introduction: string;
    };

    enum GenderType {
        Male = 0,
        Female = 1,
    }

    enum DoctorPositionType {
        Director = 0,
        DeputyDir = 1,
        HeadDept = 2,
        DeputyHead = 3,
        Doctor = 4,
    }
}

declare namespace API {}

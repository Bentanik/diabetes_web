declare namespace REQUEST {
    type DoctorId = {
        doctorId: string;
    };
}

declare namespace API {
    type TGetDoctorDetail = {
        id: string;
        phoneNumber: string;
        avatar: string;
        name: string;
        dateOfBirth: string;
        gender: GenderType;
        numberOfExperiences: number;
        position: DoctorPositionType;
        introduction: string;
        hospital: Hospital;
        createdDate: string;
    };

    type Hospital = {
        id: string;
        name: string;
        phoneNumber: string;
        thumbnail: string;
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

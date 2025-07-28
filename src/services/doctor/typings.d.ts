declare namespace REQUEST {
    type DoctorId = {
        doctorId: string;
    };

    type GetDoctorsCursorParams = {
        search?: string | null;
        gender?: GenderType | null;
        position?: DoctorPositionType | null;
        cursor: string | "";
        pageSize?: number;
        pageIndex?: number | null;
        sortBy: string;
        sortDirection: number;
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

    type Doctors = {
        id: string;
        phoneNumber: string;
        avatar: string;
        name: string;
        dateOfBirth: string;
        gender: number;
        numberOfExperiences: number;
        position: number;
        hospital: Hospital;
        createdDate: string;
    };

    type TGetDoctorsCursor = {
        items: Doctors[];
        pageSize: number;
        nextCursor: string;
        hasNextPage: boolean;
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

declare namespace REQUEST {
    export type DoctorId = {
        doctorId: string;
    };

    export type HospitalId = {
        hospitalId: string;
    };

    type GetHospitalsCursorParams = {
        search?: string | null;
        cursor?: string | "";
        pageSize?: number;
        pageIndex?: number;
        sortBy: string;
        sortDirection: number;
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

    type TCreateHospital = {
        name: string;
        email: string;
        phoneNumber: string;
        website: string;
        address: string;
        introduction: string;
        thumbnail: string;
        images: string[];
    };

    type GetDoctorsParams = {
        search?: string | null;
        gender?: GenderType | null;
        position?: DoctorPositionType | null;
        pageSize?: number;
        pageIndex?: number | null;
        sortBy: string;
        sortDirection: number;
    };

    type GetHospitalsParams = {
        search: string;
        pageSize: number;
        pageIndex: number;
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
    // type Doctors = {
    //     id: string;
    //     phoneNumber: string;
    //     avatar: string;
    //     name: string;
    //     dateOfBirth: string;
    //     gender: GenderType;
    //     numberOfExperiences: number;
    //     position: number;
    //     createdDate: string;
    // };

    type TGetHospital = {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        website: string;
        address: string;
        introduction: string;
        thumbnail: string;
        images: [];
        createdDate: string;
    };

    type HospitalCursor = {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        website: string;
        address: string;
        thumbnail: string;
        createdDate: string;
    };

    type TGetHospitalsCursor = {
        items: HospitalCursor[];
        pageSize: number;
        nextCursor: string;
        hasNextPage: boolean;
    };

    type Hospitals = {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        website: string;
        address: string;
        thumbnail: string;
        createdDate: string;
    };

    type TGetHospitals = {
        items: Hospitals[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };

    type TGetDoctors = {
        items: Doctors[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };

    enum GenderType {
        Male = 0,
        Female = 1,
    }
}

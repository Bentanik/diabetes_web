declare namespace REQUEST {
    type hospitalStaffId = {
        hospitalStaffId: string;
    };

    type GetHospitalStaffsParams = {
        search?: string | null;
        gender?: GenderType | null;
        hospitalId: string;
        pageSize?: number;
        pageIndex?: number | null;
        sortBy: string;
        sortDirection: number;
    };

    enum GenderType {
        Male = 0,
        Female = 1,
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

    type HospitalStaffs = {
        id: string;
        email: string;
        avatar: string;
        name: string;
        dateOfBirth: string;
        gender: GenderType;
        createdDate: string;
    };

    type TGetHospitalStaffs = {
        items: HospitalStaffs[];
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

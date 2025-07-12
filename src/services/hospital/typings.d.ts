declare namespace REQUEST {
    type TCreateHospital = {
        name: string;
        address: string;
        contactNumber: string;
        email: string;
        description: string;
        establishedDate: Date;
        logo: File;
    };

    export type HospitalId = {
        hospitalId: string;
    };
}

declare namespace API {}

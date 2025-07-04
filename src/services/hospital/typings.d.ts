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
}

declare namespace API {}

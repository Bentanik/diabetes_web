declare namespace REQUEST {
    type TCreateBlog = {
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

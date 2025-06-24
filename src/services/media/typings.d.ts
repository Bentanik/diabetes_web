declare namespace REQUEST {
    type TUploadImage = {
        image: File;
    };
}

declare namespace API {
    type TUploadImageResponse = {
        data: {
            imageId: string;
            publicId: string;
            publicUrl: string;
        };
    };
}

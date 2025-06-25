declare namespace REQUEST {
    type TUploadImage = {
        image: File;
    };
}

declare namespace API {
    type TUploadImageResponse = {
        imageId: string;
        publicId: string;
        publicUrl: string;
    };
}

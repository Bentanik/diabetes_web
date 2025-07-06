declare namespace REQUEST {
    type TUploadImage = {
        image: File;
    };

    type TDeleteImage = string[];
}

declare namespace API {
    type UploadImageResponse = {
        imageId: string;
        publicId: string;
        publicUrl: string;
    };

    type TUploadImageResponse = UploadImageResponse[];
}

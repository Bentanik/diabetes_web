declare namespace REQUEST {
    type TUploadImage = {
        image: File;
    };

    type TDeleteImage = string[];
}

declare namespace API {
    type TUploadImageResponse = {
        imageId: string;
        publicId: string;
        publicUrl: string;
    };
}

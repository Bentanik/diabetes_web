declare namespace REQUEST {
    type TUploadUserImage = {
        images: File;
    };
}

declare namespace API {
    type UploadUserImageResponse = {
        imageId: string;
        publicId: string;
        publicUrl: string;
    };

    type TUploadImageUserResponse = UploadImageUserResponse[];
}

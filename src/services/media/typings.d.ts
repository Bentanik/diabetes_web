declare namespace REQUEST {
    type TUploadImage = {
        image: File;
    };

    type TUploadConversationImage = {
        files: File;
    };
}

declare namespace API {
    type UploadImageResponse = {
        imageId: string;
        publicId: string;
        publicUrl: string;
    };
    type TUploadImageResponse = UploadImageResponse[];

    type TUploadConversationImageResponse = {
        mediaIds: string[];
    };
}

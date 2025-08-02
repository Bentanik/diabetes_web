declare namespace REQUEST {
    type CreateConsultation = {
        start: string;
        end: string;
    };

    type TCreateConsultation = {
        timeTemplates: CreateConsultation[];
    };
}

declare namespace API {
    type UploadImageResponse = {
        imageId: string;
        publicId: string;
        publicUrl: string;
    };
}

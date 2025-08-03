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
    type Consultation = {
        startTime: string;
        endTime: string;
        status: number;
    };

    type TGetConsultations = {
        items: Consultation[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

declare namespace REQUEST {
    type TimeRange = {
        start: string;
        end: string;
    };

    type TimeTemplate = {
        date: string;
        times: TimeRange[];
    };

    type TCreateConsultation = {
        timeTemplates: TimeTemplate[];
    };
}

declare namespace API {
    type ConsultationTemplate = {
        id: string;
        startTime: string;
        endTime: string;
        status: number;
    };

    type ConsultationByDate = {
        date: string;
        consultationTemplates: ConsultationTemplate[];
    };

    type TGetConsultations = {
        items: ConsultationByDate[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

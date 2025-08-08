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

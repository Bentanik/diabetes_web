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

    type GetConsultationsCursorParams = {
        cursor?: string;
        pageSize?: number;
        fromDate: string;
        toDate: string;
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
        totalItems: number;
        pageSize: number;
        nextCursor: string;
        hasNextPage: boolean;
    };
}

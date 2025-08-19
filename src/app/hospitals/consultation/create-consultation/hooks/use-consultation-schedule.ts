"use client";
import { useEffect, useMemo, useState } from "react";
import { useGetConsultationsCursor } from "./use-get-consultation";

export interface TimeSlot {
    start: string;
    end: string;
    id?: string;
    status?: number;
}

interface DaySchedule {
    date: string;
    times: TimeSlot[];
}

interface ScheduleData {
    timeTemplates: DaySchedule[];
}

export const useConsultationSchedule = (
    doctorId: string,
    apiParams: { pageSize: number; fromDate: string; toDate: string } | null
) => {
    const [scheduleData, setScheduleData] = useState<ScheduleData>({
        timeTemplates: [],
    });

    const queryParams = useMemo(
        () => apiParams || { pageSize: 7, fromDate: "", toDate: "" },
        [apiParams]
    );

    const {
        data: consultationData,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetConsultationsCursor({ doctorId }, queryParams);

    useEffect(() => {
        setScheduleData({ timeTemplates: [] });
    }, [doctorId, apiParams?.fromDate, apiParams?.toDate]);

    useEffect(() => {
        if (!doctorId || !apiParams) return;
        if (consultationData?.pages) {
            const allConsultations = consultationData.pages.flatMap(
                (page: any) => page.data?.items ?? []
            );
            if (allConsultations.length > 0) {
                const transformed: ScheduleData = {
                    timeTemplates: allConsultations.map((item: any) => {
                        const date = item.date.split("T")[0];
                        const timeslots = item.consultationTemplates.map(
                            (template: any) => {
                                const [hourStart, minuteStart] =
                                    template.startTime.split(":");
                                const [hourEnd, minuteEnd] =
                                    template.endTime.split(":");
                                return {
                                    start: `${hourStart.padStart(
                                        2,
                                        "0"
                                    )}:${minuteStart.padStart(2, "0")}`,
                                    end: `${hourEnd.padStart(
                                        2,
                                        "0"
                                    )}:${minuteEnd.padStart(2, "0")}`,
                                    id: template.id,
                                    status: template.status,
                                };
                            }
                        );
                        return { date, times: timeslots } as DaySchedule;
                    }),
                };
                setScheduleData(transformed);
            } else {
                setScheduleData({ timeTemplates: [] });
            }
        }
    }, [consultationData?.pages]);

    const hasConsultationData = useMemo(() => {
        if (!consultationData?.pages) return false;
        const allItems = consultationData.pages.flatMap(
            (page: any) => page.data?.items ?? []
        );
        return allItems.length > 0;
    }, [consultationData]);

    return {
        scheduleData,
        setScheduleData,
        isLoading,
        isError,
        error,
        hasConsultationData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    };
};

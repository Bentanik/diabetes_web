declare namespace REQUEST {
    type YearlyDashboardParams = {
        year: number;
    };

    type MonthlyDashboardParams = {
        year: number;
        month: number;
    };
}
declare namespace API {
    //  Get Yearly Statistics

    type MonthlyStatistic = {
        month: number;
        revenue: number;
        totalConsultations: number;
        completed: number;
        canceled: number;
    };

    type TGetYearlyStatistics = {
        year: number;
        totalRevenue: number;
        totalConsultations: number;
        totalCompleted: number;
        totalCanceled: number;
        months: MonthlyStatistic[];
    };

    //  Get Monthly Statistics

    type DailyStatistic = {
        day: number;
        revenue: number;
        totalConsultations: number;
        completed: number;
        canceled: number;
    };

    type TGetMonthlyStatistics = {
        month: number;
        totalRevenue: number;
        totalConsultations: number;
        totalCompleted: number;
        totalCanceled: number;
        days: DailyStatistic[];
    };
}

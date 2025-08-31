"use client";

import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
} from "recharts";

interface ConsultationChartProps {
    data: {
        chartData: Array<{
            date: string;
            consultations: number;
            revenue: number;
        }>;
        period?: {
            year: string;
            month: string;
            week: string;
        };
    } | null;
    isLoading: boolean;
    selectedYear: string;
    selectedMonth: string;
    statisticsType?: string | null;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
    });
};

const formatMonth = (monthString: string) => {
    const month = parseInt(monthString);
    return `Tháng ${month}`;
};

const formatYear = (yearString: string) => {
    return `Năm ${yearString}`;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const CustomTooltip = ({ active, payload, label, periodType }: any) => {
    if (active && payload && payload.length > 0) {
        const consultations = payload[0]?.value || 0;
        const revenue = payload[1]?.value || 0;

        let periodLabel = "";
        if (periodType === "year") {
            periodLabel = `${label}`;
        } else if (periodType === "month") {
            periodLabel = `${label}`;
        } else {
            // Nếu là ngày, label đã là format "day/month" nên không cần format lại
            periodLabel = `${label}`;
        }

        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900 mb-2">{periodLabel}</p>
                <div className="space-y-1">
                    <p className="text-green-500">
                        Cuộc tư vấn:{" "}
                        <span className="font-semibold">{consultations}</span>
                    </p>
                    <p className="text-[#246FCA]">
                        Doanh thu:{" "}
                        <span className="font-semibold">
                            {formatCurrency(revenue)}
                        </span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function ConsultationChart({
    data,
    isLoading,
    selectedYear,
    selectedMonth,
}: ConsultationChartProps) {
    if (isLoading) {
        return (
            <Card className="mb-6">
                <CardHeader>
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </CardHeader>
            </Card>
        );
    }

    if (!data || !data.chartData || data.chartData.length === 0) {
        return (
            null
        );
    }

    // Xác định loại period để hiển thị chart phù hợp
    let periodType = "day";
    let chartTitle = "Tổng cuộc tư vấn";
    let xAxisLabel = "Ngày";

    if (selectedYear && !selectedMonth) {
        periodType = "year";
        chartTitle = `Tổng cuộc tư vấn năm ${selectedYear}`;
        xAxisLabel = "Tháng";
    } else if (selectedYear && selectedMonth) {
        periodType = "month";
        chartTitle = `Tổng cuộc tư vấn tháng ${selectedMonth} năm ${selectedYear}`;
        xAxisLabel = "Ngày";
    }

    // Xử lý dữ liệu chart theo period type
    let chartData = data.chartData;
    let tooltipPeriodType = periodType;

    if (periodType === "year") {
        // Nhóm dữ liệu theo tháng - mỗi tháng là một điểm dữ liệu riêng biệt
        const monthlyData = chartData.reduce((acc: any, item) => {
            const month = new Date(item.date).getMonth() + 1;
            const monthKey = month.toString();

            if (!acc[monthKey]) {
                acc[monthKey] = {
                    month: monthKey,
                    consultations: 0,
                    revenue: 0,
                };
            }

            acc[monthKey].consultations += item.consultations;
            acc[monthKey].revenue += item.revenue;
            return acc;
        }, {});

        // Sắp xếp theo thứ tự tháng và tạo dữ liệu cho tất cả 12 tháng
        const sortedMonthlyData = [];
        for (let month = 1; month <= 12; month++) {
            const monthKey = month.toString();
            if (monthlyData[monthKey]) {
                sortedMonthlyData.push({
                    date: formatMonth(monthKey),
                    consultations: monthlyData[monthKey].consultations,
                    revenue: monthlyData[monthKey].revenue,
                });
            } else {
                // Nếu không có dữ liệu cho tháng này, tạo dữ liệu mặc định
                sortedMonthlyData.push({
                    date: formatMonth(monthKey),
                    consultations: 0,
                    revenue: 0,
                });
            }
        }

        chartData = sortedMonthlyData;
    } else {
        // Dữ liệu theo ngày (giữ nguyên format gốc)
        chartData = data.chartData.map((item) => ({
            ...item,
            // Không format date vì item.date đã là format "day/month"
            date: item.date,
        }));
    }

    return (
        <Card className="my-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                            {chartTitle}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            {xAxisLabel}:{" "}
                            {periodType === "year"
                                ? "12 tháng"
                                : `${chartData.length} ngày`}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                            />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: "#666" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#666" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                content={
                                    <CustomTooltip
                                        periodType={tooltipPeriodType}
                                    />
                                }
                            />
                            <Area
                                type="monotone"
                                dataKey="consultations"
                                stackId="1"
                                stroke="#8f24ca"
                                fill="#c791e4"
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stackId="2"
                                // stroke="#071d34"
                                // fill="#92c7e5"
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

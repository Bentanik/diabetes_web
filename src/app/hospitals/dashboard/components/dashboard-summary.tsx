"use client";

import React from "react";
import {
    Users,
    DollarSign,
    CheckCircle,
    Clock,
    XCircle,
    Calendar,
    Clock as ClockIcon,
    BadgeCheckIcon,
    Building2,
    Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface DashboardSummaryProps {
    data: {
        summary: {
            totalConsultations: number;
            totalRevenue: number;
            completedConsultations: number;
            pendingConsultations: number;
            cancelledConsultations: number;
            completionRate: number;
        };
        period: {
            year: string;
            month: string;
            week: string;
            fromDate: string;
            toDate: string;
        };
    } | null;
    isLoading: boolean;
    statisticsType?: string | null;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "N/A";
        }
        
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    } catch (error) {
        return "N/A";
    }
};

export default function DashboardSummary({
    data,
    isLoading,
}: DashboardSummaryProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shawdow-hospital"
                    >
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data) {
        return (
            null
        );
    }

    const { summary, period } = data;

    const summaryCards = [
        {
            title: "Tổng cuộc tư vấn",
            value: summary.totalConsultations,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Doanh thu",
            value: formatCurrency(summary.totalRevenue),
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Hoàn thành",
            value: summary.completedConsultations,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Period Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shawdow-hospital">
                <div className="flex items-center gap-2 mb-4">
                    <ClockIcon className="h-5 w-5 text-[#071d34]" />
                    <h3 className="text-lg font-semibold text-[#071d34]">
                        Khoảng thời gian đã chọn
                    </h3>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Năm: {period.year}</span>
                    </div>
                    {period.month && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Tháng: {period.month}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Summary Cards */}
            <div className="flex gap-10">
                {/* Status Cards */}
                <></>
                <div className="flex-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {summaryCards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 border border-gray-200 shawdow-hospital"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                        {card.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {card.value}
                                    </p>
                                </div>
                                <div
                                    className={`p-3 rounded-full ${card.bgColor}`}
                                >
                                    <card.icon
                                        className={`h-6 w-6 ${card.color}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

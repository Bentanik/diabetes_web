"use client";

import React from "react";
import {
    Users,
    DollarSign,
    CheckCircle,
    Clock,
    XCircle,
    TrendingUp,
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
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
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
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
                <div className="text-center text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>
                        Vui lòng chọn bác sĩ và khoảng thời gian để xem thống kê
                    </p>
                </div>
            </div>
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

    const statusCards = [
        {
            title: "Đang chờ",
            value: summary.pendingConsultations,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Đã hủy",
            value: summary.cancelledConsultations,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Period Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shawdow-hospital">
                <div className="flex items-center gap-2 mb-4">
                    <ClockIcon className="h-5 w-5 text-[#248FCA]" />
                    <h3 className="text-lg font-semibold text-[#248FCA]">
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
                    {period.week && (
                        <div className="flex items-center gap-2">
                            <ClockIcon className="h-4 w-4" />
                            <span>Tuần: {period.week}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Từ {formatDate(period.fromDate)} đến{" "}
                            {formatDate(period.toDate)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Summary Cards */}
            <div className="flex gap-10">
                {/* Status Cards */}
                {/* {selectedDoctor && ( */}
                <Card className="flex-1 p-4 rounded-2xl border border-blue-200 shadow-sm">
                    <CardContent className="p-0">
                        <div className="flex items-center gap-5">
                            <Avatar className="size-16">
                                <AvatarImage
                                    className="w-full h-full rounded-full object-cover"
                                    src={"/images/default_img.jpg"}
                                />
                            </Avatar>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="text-[1.1rem] font-semibold text-emerald-900">
                                        {/* {selectedDoctor.name} */}
                                        Nguyễn Mai Viết Vỹ
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">
                                        <BadgeCheckIcon className="w-4 h-4" />
                                        {/* {getPositionName(
                                            selectedDoctor.position
                                        )} */}
                                        Trưởng phòng
                                    </span>
                                </div>
                                <div className="text-sm text-gray-700 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-blue-700" />
                                    {/* <span>{selectedDoctor.hospital?.name}</span> */}
                                    <span>Bệnh viện A</span>
                                </div>
                                <div className="text-sm text-gray-700 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-blue-700" />
                                    <span>
                                        {/* {selectedDoctor.phoneNumber ||
                                            "Chưa cập nhật"} */}
                                        0909123456
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* )} */}
                <div className="flex-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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

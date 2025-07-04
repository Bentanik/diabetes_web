"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    ActivityIcon,
    BarChartIcon,
    BellIcon,
    BotIcon,
    ExternalLinkIcon,
    EyeIcon,
    MessageCircleIcon,
    MessagesSquareIcon,
    UserCogIcon,
    UserPlusIcon,
    UsersIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ListTotalStatisticHospitalDashboard from "@/app/hospital/home/components/list-total";

const messageData = [
    { day: "T2", messages: 145 },
    { day: "T3", messages: 167 },
    { day: "T4", messages: 189 },
    { day: "T5", messages: 156 },
    { day: "T6", messages: 234 },
    { day: "T7", messages: 198 },
    { day: "CN", messages: 123 },
];

const quickActions = [
    {
        title: "Thêm nhân viên mới",
        description: "Tạo tài khoản cho nhân viên y tế",
        icon: UserPlusIcon,
        color: "bg-blue-500",
    },
    {
        title: "Truy cập group chat",
        description: "Xem và quản lý các nhóm chat",
        icon: ExternalLinkIcon,
        color: "bg-green-500",
    },
];

const recentPatients = [
    {
        id: 1,
        name: "Nguyễn Thị Hoa",
        avatar: "NH",
        joinedAt: "2024-01-15 14:30",
        messageCount: 24,
        lastActive: "Hôm nay",
    },
    {
        id: 2,
        name: "Trần Văn Bình",
        avatar: "TB",
        joinedAt: "2024-01-14 09:15",
        messageCount: 18,
        lastActive: "Hôm qua",
    },
    {
        id: 3,
        name: "Lê Thị Cẩm",
        avatar: "LC",
        joinedAt: "2024-01-13 16:45",
        messageCount: 32,
        lastActive: "Hôm nay",
    },
    {
        id: 4,
        name: "Phạm Văn Dũng",
        avatar: "PD",
        joinedAt: "2024-01-12 11:20",
        messageCount: 7,
        lastActive: "3 ngày trước",
    },
    {
        id: 5,
        name: "Hoàng Thị Em",
        avatar: "HE",
        joinedAt: "2024-01-11 08:30",
        messageCount: 15,
        lastActive: "Hôm nay",
    },
];

const Header = () => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Dashboard Quản Trị
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Tổng quan hoạt động hôm nay -{" "}
                        {new Date().toLocaleDateString("vi-VN")}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="gap-2">
                        <BarChartIcon className="w-4 h-4" />
                        Xuất báo cáo
                    </Button>
                    <Button variant="ghost" size="icon">
                        <BellIcon className="w-5 h-5" />
                    </Button>
                    <div>
                        <ProfileHospitalMenu profile={1} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function HomeHospitalComponent() {
    return (
        <div>
            {/* Header */}
            <header>
                <Header />
            </header>
            {/* Start Cards */}
            <ListTotalStatisticHospitalDashboard />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Charts - Equal height */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
                        {/* Message Chart */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="h-full"
                        >
                            <div className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden h-full flex flex-col min-h-[360px]">
                                <div className="p-6 border-b border-gray-100 flex-shrink-0">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <MessageCircleIcon className="w-5 h-5 text-blue-500" />
                                        Lượt tin nhắn 7 ngày gần nhất
                                    </h3>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex-1 flex items-end justify-between gap-2 min-h-[200px]">
                                        {messageData.map((data, index) => (
                                            <div
                                                key={data.day}
                                                className="flex flex-col items-center gap-2 flex-1"
                                            >
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{
                                                        height:
                                                            (data.messages /
                                                                250) *
                                                                120 +
                                                            20,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            0.7 + index * 0.1,
                                                        duration: 0.5,
                                                    }}
                                                    className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg w-full"
                                                />
                                                <span className="text-xs text-gray-500">
                                                    {data.day}
                                                </span>
                                                <span className="text-xs font-medium">
                                                    {data.messages}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Group Member Distribution */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="h-full"
                        >
                            <div className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden h-full flex flex-col min-h-[360px]">
                                <div className="p-6 border-b border-gray-100 flex-shrink-0">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <UsersIcon className="w-5 h-5 text-green-500" />
                                        Phân bố thành viên trong group
                                    </h3>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-center">
                                    <div className="flex items-center justify-center mb-6">
                                        <div className="relative w-40 h-40">
                                            <svg className="w-40 h-40 transform -rotate-90">
                                                <circle
                                                    cx="80"
                                                    cy="80"
                                                    r="70"
                                                    stroke="#f3f4f6"
                                                    strokeWidth="12"
                                                    fill="none"
                                                />
                                                <motion.circle
                                                    cx="80"
                                                    cy="80"
                                                    r="70"
                                                    stroke="#3b82f6"
                                                    strokeWidth="12"
                                                    fill="none"
                                                    strokeDasharray={439.82}
                                                    initial={{
                                                        strokeDashoffset: 439.82,
                                                    }}
                                                    animate={{
                                                        strokeDashoffset:
                                                            439.82 * 0.95,
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                        delay: 0.5,
                                                    }}
                                                    strokeLinecap="round"
                                                />
                                                <motion.circle
                                                    cx="80"
                                                    cy="80"
                                                    r="70"
                                                    stroke="#10b981"
                                                    strokeWidth="12"
                                                    fill="none"
                                                    strokeDasharray={439.82}
                                                    initial={{
                                                        strokeDashoffset: 439.82,
                                                    }}
                                                    animate={{
                                                        strokeDashoffset:
                                                            439.82 * 0.4,
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                        delay: 0.7,
                                                    }}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-bold">
                                                    2,847
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Thành viên
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <span className="text-sm">
                                                    Bệnh nhân
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium">
                                                95% (2,691)
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span className="text-sm">
                                                    Nhân viên y tế
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium">
                                                5% (156)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    {/* Group Activity Summary */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <BarChartIcon className="w-5 h-5 text-orange-500" />
                                    Hoạt động nhóm chat
                                </h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* AI Response Rate */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                                <BotIcon className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-800">
                                                    Tỉ lệ phản hồi AI
                                                </span>
                                                <p className="text-xs text-gray-500">
                                                    Hiệu quả trả lời tự động
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-purple-600">
                                                85%
                                            </span>
                                            <p className="text-xs text-green-500 font-medium">
                                                +5% tuần này
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "85%" }}
                                            transition={{
                                                duration: 1.5,
                                                delay: 0.8,
                                            }}
                                            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full relative"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 rounded-full"></div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Patient Interaction */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                                <UsersIcon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-800">
                                                    Tương tác của bệnh nhân
                                                </span>
                                                <p className="text-xs text-gray-500">
                                                    Mức độ tham gia hàng ngày
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-blue-600">
                                                72%
                                            </span>
                                            <p className="text-xs text-green-500 font-medium">
                                                +12% tuần này
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "72%" }}
                                            transition={{
                                                duration: 1.5,
                                                delay: 1.0,
                                            }}
                                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full relative"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 rounded-full"></div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Staff Interaction */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                                <UserCogIcon className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-800">
                                                    Tương tác của nhân viên
                                                </span>
                                                <p className="text-xs text-gray-500">
                                                    Hỗ trợ và tư vấn chuyên môn
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-green-600">
                                                64%
                                            </span>
                                            <p className="text-xs text-red-500 font-medium">
                                                -3% tuần này
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "64%" }}
                                            transition={{
                                                duration: 1.5,
                                                delay: 1.2,
                                            }}
                                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full relative"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 rounded-full"></div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Message Volume */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                                                <MessageCircleIcon className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-800">
                                                    Lượng tin nhắn hôm nay
                                                </span>
                                                <p className="text-xs text-gray-500">
                                                    So với trung bình tuần
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-orange-600">
                                                92%
                                            </span>
                                            <p className="text-xs text-green-500 font-medium">
                                                +18% hôm nay
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "92%" }}
                                            transition={{
                                                duration: 1.5,
                                                delay: 1.4,
                                            }}
                                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full relative"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 rounded-full"></div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Summary Stats */}
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-800">
                                                1,247
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Tin nhắn hôm nay
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-800">
                                                98.5%
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Uptime hệ thống
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        Chi tiết
                                    </Button>
                                    <Button className="gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg">
                                        <BarChartIcon className="w-4 h-4" />
                                        Báo cáo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden min-h-[360px]">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <ActivityIcon className="w-5 h-5 text-purple-500" />
                                    Điều khiển nhanh
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {quickActions.map((action, index) => (
                                    <motion.div
                                        key={action.title}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.5 + index * 0.1,
                                        }}
                                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors -pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}
                                            >
                                                <action.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {action.title}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {action.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Patients in Group */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <MessagesSquareIcon className="w-5 h-5 text-green-500" />
                                        Bệnh nhân tham gia gần đây
                                    </h3>
                                    <Button variant="ghost" size="sm">
                                        Xem tất cả
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {recentPatients.map((patient, index) => (
                                    <motion.div
                                        key={patient.id}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.6 + index * 0.1,
                                        }}
                                        className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10">
                                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                                    {patient.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">
                                                    {patient.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Tham gia: {patient.joinedAt}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 justify-end">
                                                <MessageCircleIcon className="w-3 h-3 text-blue-500" />
                                                <span className="text-sm font-medium">
                                                    {patient.messageCount}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Hoạt động: {patient.lastActive}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    BarChartIcon,
    BellIcon,
    PlusIcon,
    SearchIcon,
    UsersIcon,
    ClipboardType,
    CalendarClock,
    UserRound,
    Info,
    Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const staffData = [
    {
        id: 1,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đang hoạt động",
    },
    {
        id: 2,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đang hoạt động",
    },
    {
        id: 3,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đã dừng hoạt động",
    },
    {
        id: 4,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đang hoạt động",
    },
    {
        id: 5,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đã dừng hoạt động",
    },
    {
        id: 6,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đang hoạt động",
    },
];

const departmentStats = [
    { name: "Nội tiết", count: 12, color: "bg-blue-500" },
    { name: "Tim mạch", count: 8, color: "bg-red-500" },
    { name: "Nhi khoa", count: 15, color: "bg-green-500" },
    { name: "Ngoại khoa", count: 10, color: "bg-purple-500" },
    { name: "Cấp cứu", count: 6, color: "bg-orange-500" },
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
                        Quản lí nhóm chat
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Hiện có 6 kết quả hiển thị
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

export default function GroupHospitalComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    const filteredStaff = staffData.filter((staff) => {
        const matchesSearch = staff.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === "all";
        const matchesStatus = selectedStatus === "all";

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    return (
        <div>
            {/* Header */}
            <header>
                <Header />
            </header>

            {/* Main */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6"
            >
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm theo tên, email, khoa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={selectedDepartment}
                            onChange={(e) =>
                                setSelectedDepartment(e.target.value)
                            }
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả khoa</option>
                            {departmentStats.map((dept) => (
                                <option key={dept.name} value={dept.name}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Tạm nghỉ</option>
                            <option value="pending">Chờ xác thực</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="px-6 py-5 bg-[#248FCA] hover:bg-[#2490cada] cursor-pointer"
                        >
                            <Plus width={20} height={20} color="white" />
                            Thêm nhóm chat mới
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Staff Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map((staff, index) => (
                    <motion.div
                        key={staff.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                    >
                        <Link
                            href={`/hospital/group/group-detail/${staff.id}`}
                            key={staff.id}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-12 h-12">
                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold">
                                            {staff.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {staff.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 my-10">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <ClipboardType className="w-4 h-4" />
                                        <span>Loại nhóm chat:</span>
                                    </div>
                                    <span className="text-sm text-gray-600 border px-4 py-1 rounded-full">
                                        {staff.conversationType}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Info className="w-4 h-4" />
                                        <span>Trang thái:</span>
                                    </div>
                                    <span
                                        className={`text-sm text-gray-600 ${
                                            staff.status === "Đã dừng hoạt động"
                                                ? "bg-red-100"
                                                : "bg-green-100"
                                        } px-4 py-1 flex items-center rounded-full`}
                                    >
                                        {staff.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CalendarClock className="w-4 h-4" />
                                        <span>Ngày tạo: </span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {staff.createDate}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <UserRound className="w-4 h-4" />
                                        <span>Số lượng thành viên: </span>
                                    </div>
                                    <span className="text-[1rem] font-bold text-[#248FCA]">
                                        {staff.patientsCount}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredStaff.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                >
                    <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Không tìm thấy nhân viên
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                    <Button className="gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Thêm nhân viên mới
                    </Button>
                </motion.div>
            )}
        </div>
    );
}

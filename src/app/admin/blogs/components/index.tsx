"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertCircleIcon,
    BadgeIcon,
    BellIcon,
    CheckCircleIcon,
    ClockIcon,
    EditIcon,
    EyeIcon,
    HospitalIcon,
    MailIcon,
    MapPinIcon,
    MoreHorizontalIcon,
    PhoneIcon,
    PlusIcon,
    SearchIcon,
    Trash2Icon,
    UsersIcon,
    XCircleIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const staffData = [
    {
        id: 1,
        name: "Dr. Nguyễn Văn An",
        avatar: "NA",
        role: "Bác sĩ chuyên khoa",
        department: "Nội tiết",
        email: "dr.an@medichat.vn",
        phone: "0901234567",
        status: "active",
        joinDate: "2023-01-15",
        lastActive: "2024-01-20 14:30",
        patientsCount: 45,
        messagesCount: 234,
        rating: 4.8,
        specialization: "Tiểu đường",
        experience: "8 năm",
        location: "Tầng 3, Phòng 301",
    },
    {
        id: 2,
        name: "Y tá Trần Thị Bình",
        avatar: "TB",
        role: "Y tá trưởng",
        department: "Nội tiết",
        email: "yta.binh@medichat.vn",
        phone: "0901234568",
        status: "active",
        joinDate: "2023-03-20",
        lastActive: "2024-01-20 16:45",
        patientsCount: 78,
        messagesCount: 456,
        rating: 4.9,
        specialization: "Chăm sóc bệnh nhân",
        experience: "5 năm",
        location: "Tầng 3, Phòng 302",
    },
    {
        id: 3,
        name: "Dr. Lê Minh Cường",
        avatar: "LC",
        role: "Bác sĩ",
        department: "Tim mạch",
        email: "dr.cuong@medichat.vn",
        phone: "0901234569",
        status: "inactive",
        joinDate: "2023-06-10",
        lastActive: "2024-01-18 09:15",
        patientsCount: 32,
        messagesCount: 123,
        rating: 4.6,
        specialization: "Tim mạch",
        experience: "6 năm",
        location: "Tầng 2, Phòng 201",
    },
    {
        id: 4,
        name: "Điều dưỡng Phạm Thị Dung",
        avatar: "PD",
        role: "Điều dưỡng",
        department: "Nhi khoa",
        email: "dd.dung@medichat.vn",
        phone: "0901234570",
        status: "active",
        joinDate: "2023-08-05",
        lastActive: "2024-01-20 11:20",
        patientsCount: 56,
        messagesCount: 189,
        rating: 4.7,
        specialization: "Chăm sóc trẻ em",
        experience: "4 năm",
        location: "Tầng 4, Phòng 401",
    },
    {
        id: 5,
        name: "Dr. Hoàng Văn Em",
        avatar: "HE",
        role: "Bác sĩ",
        department: "Ngoại khoa",
        email: "dr.em@medichat.vn",
        phone: "0901234571",
        status: "pending",
        joinDate: "2024-01-10",
        lastActive: "2024-01-19 15:30",
        patientsCount: 12,
        messagesCount: 45,
        rating: 4.5,
        specialization: "Phẫu thuật",
        experience: "3 năm",
        location: "Tầng 5, Phòng 501",
    },
    {
        id: 6,
        name: "Y tá Võ Thị Lan",
        avatar: "VL",
        role: "Y tá",
        department: "Cấp cứu",
        email: "yta.lan@medichat.vn",
        phone: "0901234572",
        status: "active",
        joinDate: "2023-11-15",
        lastActive: "2024-01-20 18:00",
        patientsCount: 89,
        messagesCount: 567,
        rating: 4.9,
        specialization: "Cấp cứu",
        experience: "7 năm",
        location: "Tầng 1, Phòng cấp cứu",
    },
];

// const departmentStats = [
//     { name: "Nội tiết", count: 12, color: "bg-blue-500" },
//     { name: "Tim mạch", count: 8, color: "bg-red-500" },
//     { name: "Nhi khoa", count: 15, color: "bg-green-500" },
//     { name: "Ngoại khoa", count: 10, color: "bg-purple-500" },
//     { name: "Cấp cứu", count: 6, color: "bg-orange-500" },
// ];

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
                        Quản lý bài viết
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Tổng cộng 6 bài viết - 6 kết quả hiển thị
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/admin/blogs/create-blog">
                        <Button
                            variant="outline"
                            className="gap-2 cursor-pointer"
                        >
                            <HospitalIcon className="w-4 h-4" />
                            Thêm bài viết
                        </Button>
                    </Link>
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

export default function ModeratorManageBlogComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700 border-green-200";
            case "inactive":
                return "bg-gray-100 text-gray-700 border-gray-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
                return <CheckCircleIcon className="w-4 h-4" />;
            case "inactive":
                return <XCircleIcon className="w-4 h-4" />;
            case "pending":
                return <AlertCircleIcon className="w-4 h-4" />;
            default:
                return <XCircleIcon className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "active":
                return "Đang hoạt động";
            case "inactive":
                return "Tạm nghỉ";
            case "pending":
                return "Chờ xác thực";
            default:
                return "Không xác định";
        }
    };

    const filteredStaff = staffData.filter((staff) => {
        const matchesSearch =
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.department.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            selectedStatus === "all" || staff.status === selectedStatus;

        return matchesSearch && matchesStatus;
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
                                placeholder="Tìm kiếm theo tiêu đề bài viết..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        {/* drop down blog status */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đã được duyệt</option>
                            <option value="pending">Đang đợi duyệt</option>
                            <option value="inactive">Bị từ chối</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={
                                viewMode === "grid" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("grid")}
                        >
                            Grid
                        </Button>
                        <Button
                            variant={
                                viewMode === "list" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("list")}
                        >
                            List
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Staff Grid/List */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((staff, index) => (
                        <motion.div
                            key={staff.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
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
                                        <p className="text-sm text-gray-500">
                                            {staff.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BadgeIcon
                                        className={`${getStatusColor(
                                            staff.status
                                        )} flex items-center gap-1`}
                                    >
                                        {getStatusIcon(staff.status)}
                                        {getStatusText(staff.status)}
                                    </BadgeIcon>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPinIcon className="w-4 h-4" />
                                    <span>{staff.department}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MailIcon className="w-4 h-4" />
                                    <span>{staff.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>{staff.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <ClockIcon className="w-4 h-4" />
                                    <span>Hoạt động: {staff.lastActive}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-800">
                                        {staff.patientsCount}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Bệnh nhân
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-800">
                                        {staff.messagesCount}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Tin nhắn
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-800">
                                        {staff.rating}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Đánh giá
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 gap-2"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                    Xem
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 gap-2"
                                >
                                    <EditIcon className="w-4 h-4" />
                                    Sửa
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <MoreHorizontalIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                        bệnh viện
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                        Khoa
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                        Liên hệ
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                        Trạng thái
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                        Thống kê
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.map((staff, index) => (
                                    <motion.tr
                                        key={staff.id}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                                                        {staff.avatar}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {staff.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {staff.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {staff.department}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {staff.location}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600">
                                                    {staff.email}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {staff.phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <BadgeIcon
                                                className={`${getStatusColor(
                                                    staff.status
                                                )} flex items-center gap-1 w-fit`}
                                            >
                                                {getStatusIcon(staff.status)}
                                                {getStatusText(staff.status)}
                                            </BadgeIcon>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-4 text-sm">
                                                <span className="text-gray-600">
                                                    {staff.patientsCount} BN
                                                </span>
                                                <span className="text-gray-600">
                                                    {staff.messagesCount} TN
                                                </span>
                                                <span className="text-gray-600">
                                                    ⭐ {staff.rating}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <EditIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {filteredStaff.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                >
                    <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Không tìm thấy bệnh viện
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                    <Button className="gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Thêm bệnh viện mới
                    </Button>
                </motion.div>
            )}
        </div>
    );
}

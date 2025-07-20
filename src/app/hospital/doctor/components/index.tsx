"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertCircleIcon,
    BarChartIcon,
    BellIcon,
    CheckCircleIcon,
    PhoneIcon,
    PlusIcon,
    SearchIcon,
    UsersIcon,
    XCircleIcon,
    Plus,
    VenusAndMars,
    Briefcase,
    FileBadge,
    Hospital,
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
                        Quản lí nhân viên
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Tổng cộng 6 nhân viên - 6 kết quả hiển thị
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/hospital/doctor/create-doctor">
                        <Button
                            variant="outline"
                            className="gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm bác sĩ
                        </Button>
                    </Link>
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

export default function EmployeeHospitalComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

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

    const filteredStaff = staffData.filter((staff) => {
        const matchesSearch =
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment =
            selectedDepartment === "all" ||
            staff.department === selectedDepartment;
        const matchesStatus =
            selectedStatus === "all" || staff.status === selectedStatus;

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
                </div>
            </motion.div>

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
                            href={`/hospital/doctor/doctor-detail/${staff.id}`}
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
                                        <h3 className="font-semibold text-[1.5rem]">
                                            {staff.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {staff.role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>Số điện thoại:</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <VenusAndMars className="w-4 h-4" />
                                    <span>Giới tính:</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Briefcase className="w-4 h-4" />
                                    <span>Chức vụ:</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FileBadge className="w-4 h-4" />
                                    <span>Số năm kinh nghiệm</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Hospital className="w-4 h-4" />
                                    <span>Bác sĩ của bệnh viện:</span>
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

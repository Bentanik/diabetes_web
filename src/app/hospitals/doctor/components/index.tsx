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
import { useGetDoctors } from "../hooks/use-get-doctors";
import { useDebounce } from "@/hooks/use-debounce";

const sortBy = [
    { name: "Tên nhóm", value: "name" },
    { name: "Ngày tạo", date: "date" },
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
                    <Link href="/hospitals/doctor/create-doctor">
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

export default function DoctorComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectSortBy, setSelectSortBy] = useState<string>("");
    const [selectGender, setSelectGender] = useState<number>(0);
    const [selectPosition, setSelectPosition] = useState<number>(0);
    const [isSortAsc, setIsSortAsc] = useState(false);

    const pageSize = 6;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { doctors, isPending, isError, error } = useGetDoctors({
        search: debouncedSearchTerm,
        gender: null,
        position: null,
        pageIndex: currentPage,
        sortBy: "position",
        sortDirection: isSortAsc ? 0 : 1,
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
                            value={selectSortBy}
                            onChange={(e) => setSelectSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả khoa</option>
                            {sortBy.map((dept) => (
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
                {doctors?.items.map((staff, index) => (
                    <motion.div
                        key={staff.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                    >
                        <Link
                            href={`/hospitals/doctor/doctor-detail/${staff.id}`}
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
                                            {staff.position}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>
                                        Số điện thoại: {staff.phoneNumber}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <VenusAndMars className="w-4 h-4" />
                                    <span>Giới tính: {staff.gender}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Briefcase className="w-4 h-4" />
                                    <span>Chức vụ: {staff.position}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FileBadge className="w-4 h-4" />
                                    <span>
                                        Số năm kinh nghiệm:{" "}
                                        {staff.numberOfExperiences}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Hospital className="w-4 h-4" />
                                    <span>
                                        Bác sĩ của bệnh viện:{" "}
                                        {staff.numberOfExperiences}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {doctors?.items.length === 0 && (
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

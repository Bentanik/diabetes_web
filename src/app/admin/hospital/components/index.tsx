"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    BarChartIcon,
    BellIcon,
    PlusIcon,
    SearchIcon,
    UsersIcon,
    Plus,
    Mail,
    MapPin,
    Phone,
    PanelTop,
    ArrowUpDown,
} from "lucide-react";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useGetHospitals } from "../hooks/use-get-hospitals";
import { useDebounce } from "@/hooks/use-debounce";
import { Toggle } from "@radix-ui/react-toggle";
import PaginatedComponent from "@/components/paginated";
import { SkeletonFolderGrid } from "@/components/skeleton-card/skeleton-card";

const sortBy = [
    { name: "Tên bệnh viện", value: "name" },
    { name: "Ngày tạo", value: "createdDate" },
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
                        Quản lí bệnh viện
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Hiện có 6 kết quả được hiển thị
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/admin/hospital/create-hospital">
                        <Button
                            variant="outline"
                            className="gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm bệnh viện
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

export default function ManageHospitalComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectSortBy, setSelectSortBy] = useState<string>("createdDate");
    const [isSortAsc, setIsSortAsc] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const pageSize = 6;

    const { hospitals, isPending } = useGetHospitals({
        search: debouncedSearchTerm,
        pageSize: pageSize,
        pageIndex: currentPage,
        sortBy: selectSortBy,
        sortDirection: isSortAsc ? 0 : 1,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                                placeholder="Tìm kiếm theo tên..."
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
                            {sortBy.map((dept) => (
                                <option key={dept.name} value={dept.value}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <Toggle
                            pressed={isSortAsc}
                            onPressedChange={setIsSortAsc}
                            className="cursor-pointer flex items-center border px-3 rounded-[10px]"
                        >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            {isSortAsc ? "A → Z" : "Z → A"}
                        </Toggle>
                    </div>
                </div>
            </motion.div>

            {isPending && <SkeletonFolderGrid count={6} />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals?.items.map((hospital, index) => (
                    <motion.div
                        key={hospital.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                    >
                        <Link
                            href={`/admin/hospital/hospital-detail/${hospital.id}`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={hospital.thumbnail}
                                        alt="avatar"
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover w-12 h-12"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-[1.5rem] line-clamp-2">
                                            {hospital.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 mb-4">
                                {/* Email */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <Mail className="w-4 h-4" />
                                        <span>email:</span>
                                    </div>
                                    {hospital.email.length > 30
                                        ? hospital.email.slice(0, 30) + "..."
                                        : hospital.email}
                                </div>
                                {/* Address */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <MapPin className="w-4 h-4" />
                                        <span>Địa chỉ: </span>
                                    </div>
                                    {hospital.address.split(" ").length > 6
                                        ? hospital.address
                                              .split(" ")
                                              .slice(0, 6)
                                              .join(" ") + "..."
                                        : hospital.address}
                                </div>

                                {/* Phone Number */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <Phone className="w-4 h-4" />
                                        <span>Số điện thoại: </span>
                                    </div>
                                    <span>{hospital.phoneNumber}</span>
                                </div>
                                {/* Website */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <PanelTop className="w-4 h-4" />
                                        <span>Website:</span>
                                    </div>
                                    <span className="text-[#248FCA]">
                                        {hospital.website.length > 30
                                            ? hospital.website.slice(0, 30) +
                                              "..."
                                            : hospital.website}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {hospitals?.items.length !== 0 && !isPending && (
                <div className="my-10">
                    <div className="mt-5">
                        <PaginatedComponent
                            totalPages={hospitals?.totalPages || 0}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}

            {/* Empty State */}
            {hospitals?.items.length === 0 && (
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
                </motion.div>
            )}
        </div>
    );
}

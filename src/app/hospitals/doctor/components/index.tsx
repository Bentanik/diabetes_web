"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    BarChartIcon,
    BellIcon,
    PhoneIcon,
    UsersIcon,
    Plus,
    VenusAndMars,
    Briefcase,
    FileBadge,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useGetDoctors } from "../hooks/use-get-doctors";
import { useDebounce } from "@/hooks/use-debounce";
import PaginatedComponent from "@/components/paginated";
import { Toaster } from "sonner";
import { SkeletonFolderGrid } from "@/components/skeleton-card/skeleton-card";
import Header from "./header";
import DoctorFilters from "./doctor-filter";
import Pagination from "@/components/shared/pagination";

export default function DoctorComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectSortBy, setSelectSortBy] = useState<string>("createdDate");
    const [selectGender, setSelectGender] = useState<number | null>(null);
    const [selectPosition, setSelectPosition] = useState<number | null>(null);
    const [isSortAsc, setIsSortAsc] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const pageSize = 6;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { doctors, isPending, isError, error } = useGetDoctors({
        search: debouncedSearchTerm,
        gender: selectGender,
        pageSize: pageSize,
        position: selectPosition,
        pageIndex: currentPage,
        sortBy: selectSortBy,
        sortDirection: isSortAsc ? 0 : 1,
    });

    const handlePerPageChange = (perPage: number) => {
        setItemsPerPage(perPage);
        setCurrentPage(1);
    };

    const getPositionName = (position: number) => {
        switch (position) {
            case 0:
                return "Giám đốc";
            case 1:
                return "Phó giám đốc";
            case 2:
                return "Trưởng khoa";
            case 3:
                return "Phó trưởng khoa";
            case 4:
                return "Bác sĩ";
            default:
                return "Không xác định vị trí";
        }
    };

    const getGender = (gender: number) => {
        switch (gender) {
            case 0:
                return "Nam";
            case 1:
                return "Nữ";
            default:
                return "Không xác định giới tính";
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

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
                <DoctorFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectSortBy={selectSortBy}
                    setSelectSortBy={setSelectSortBy}
                    selectGender={selectGender}
                    setSelectGender={setSelectGender}
                    selectPosition={selectPosition}
                    setSelectPosition={setSelectPosition}
                    isSortAsc={isSortAsc}
                    setIsSortAsc={setIsSortAsc}
                />
            </motion.div>

            {isPending && <SkeletonFolderGrid count={6} />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors?.items.map((doctor, index) => (
                    <motion.div
                        key={doctor.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                    >
                        <Link
                            href={`/hospitals/doctor/doctor-detail/${doctor.id}`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={doctor.avatar}
                                        alt="avatar"
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover w-12 h-12"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-[1.5rem]">
                                            {doctor.name}
                                        </h3>
                                        <p className="text-sm text-[#248FCA]">
                                            {getPositionName(doctor.position)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 mb-4">
                                {/* Phone number */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <PhoneIcon className="w-4 h-4" />
                                        <span>Số điện thoại:</span>
                                    </div>
                                    <span>{doctor.phoneNumber}</span>
                                </div>
                                {/* Position */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <FileBadge className="w-4 h-4" />
                                        <span>Số năm kinh nghiệm: </span>
                                    </div>
                                    <span className="font-bold text-[#248FCA]">
                                        {" "}
                                        {doctor.numberOfExperiences}
                                    </span>
                                </div>

                                {/* Position */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <Briefcase className="w-4 h-4" />
                                        <span>Chức vụ: </span>
                                    </div>
                                    <span>
                                        {getPositionName(doctor.position)}
                                    </span>
                                </div>
                                {/* Gender */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <VenusAndMars className="w-4 h-4" />
                                        <span>Giới tính:</span>
                                    </div>
                                    <span>{getGender(doctor.gender)}</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {doctors && doctors?.items.length !== 0 && !isPending && (
                <div className="my-10">
                    <div className="mt-5">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={doctors.totalPages}
                            totalItems={doctors.totalCount}
                            perPage={itemsPerPage}
                            hasNext={doctors.hasNextPage}
                            hasPrev={doctors.hasPreviousPage}
                            onPageChange={handlePageChange}
                            isLoading={isPending}
                            perPageOptions={[6, 9, 12, 18, 24]}
                            onPerPageChange={handlePerPageChange}
                        />
                    </div>
                </div>
            )}

            {/* Empty State */}
            {doctors?.items.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                >
                    <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Không tìm thấy bác sĩ
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                </motion.div>
            )}
        </div>
    );
}

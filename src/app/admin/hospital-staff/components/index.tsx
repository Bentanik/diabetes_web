"use client";

import React, { useState } from "react";
import {
    PhoneIcon,
    UsersIcon,
    VenusAndMars,
    Briefcase,
    FileBadge,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useGetHospitalStaffs } from "../hooks/use-get-hospital-staffs";
import { useDebounce } from "@/hooks/use-debounce";
import PaginatedComponent from "@/components/paginated";
import { Toaster } from "sonner";
import { SkeletonFolderGrid } from "@/components/skeleton-card/skeleton-card";
import Header from "./header";
import DoctorFilters from "./hospital-staff-filter";

export default function HospitalStaffComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectSortBy, setSelectSortBy] = useState<string>("createdDate");
    const [selectGender, setSelectGender] = useState<number | null>(null);
    const [isSortAsc, setIsSortAsc] = useState(false);

    const pageSize = 6;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { hospital_staffs, isPending, isError, error } = useGetHospitalStaffs(
        {
            search: debouncedSearchTerm,
            hospitalId: "",
            gender: selectGender,
            pageSize: pageSize,
            pageIndex: currentPage,
            sortBy: selectSortBy,
            sortDirection: isSortAsc ? 0 : 1,
        }
    );

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
                    isSortAsc={isSortAsc}
                    setIsSortAsc={setIsSortAsc}
                />
            </motion.div>

            {isPending && <SkeletonFolderGrid count={6} />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospital_staffs?.items.map((doctor, index) => (
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
                                    <span>{doctor.email}</span>
                                </div>
                                {/* Position */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <FileBadge className="w-4 h-4" />
                                        <span>Số năm kinh nghiệm: </span>
                                    </div>
                                    <span className="font-bold text-[#248FCA]">
                                        {" "}
                                        {doctor.createdDate}
                                    </span>
                                </div>

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

            {hospital_staffs?.items.length !== 0 && !isPending && (
                <div className="my-10">
                    <div className="mt-5">
                        <PaginatedComponent
                            totalPages={hospital_staffs?.totalPages || 0}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}

            {/* Empty State */}
            {hospital_staffs?.items.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                >
                    <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Không tìm thấy nhân viên nào
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                </motion.div>
            )}
        </div>
    );
}

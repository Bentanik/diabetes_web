"use client";

import React, { useState } from "react";
import { UsersIcon, VenusAndMars, Mail, ClockPlus } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useGetHospitalStaffs } from "../hooks/use-get-hospital-staffs";
import { useDebounce } from "@/hooks/use-debounce";
import { SkeletonFolderGrid } from "@/components/skeleton-card/skeleton-card";
import Header from "./header";
import HospitalStaffFilters from "./hospital-staff-filter";
import Pagination from "@/components/shared/pagination";

export default function HospitalStaffComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const [selectSortBy, setSelectSortBy] = useState<string>("createdDate");
    const [isSortAsc, setIsSortAsc] = useState(false);
    const [selectGender, setSelectGender] = useState<number | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { hospital_staffs, isPending, isError, error } = useGetHospitalStaffs(
        {
            search: debouncedSearchTerm,
            gender: selectGender,
            pageSize: itemsPerPage,
            pageIndex: currentPage,
            sortBy: selectSortBy,
            sortDirection: isSortAsc ? 0 : 1,
        }
    );

    const handlePerPageChange = (perPage: number) => {
        setItemsPerPage(perPage);
        setCurrentPage(1);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
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
                <HospitalStaffFilters
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
                {hospital_staffs?.items.map((hospital_staff, index) => (
                    <motion.div
                        key={hospital_staff.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                    >
                        <Link
                            href={`/hospitals/hospital-staff/hospital-staff-detail/${hospital_staff.id}`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={hospital_staff.avatar}
                                        alt="avatar"
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover w-12 h-12"
                                    />
                                    <h3 className="font-semibold text-gray-800 text-[1.5rem]">
                                        {hospital_staff.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 mb-4">
                                {/* Phone number */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <Mail className="w-4 h-4" />
                                        <span>Email:</span>
                                    </div>
                                    <span className="truncate max-w-[200px] text-[#248FCA]">
                                        {hospital_staff.email}
                                    </span>
                                </div>
                                {/* Create Date */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <ClockPlus className="w-4 h-4" />
                                        <span>Ngày tạo: </span>
                                    </div>
                                    <span className="">
                                        {" "}
                                        {formatDate(hospital_staff.createdDate)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2 ">
                                        <VenusAndMars className="w-4 h-4" />
                                        <span>Giới tính:</span>
                                    </div>
                                    <span>
                                        {getGender(hospital_staff.gender)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {hospital_staffs &&
                hospital_staffs?.items.length !== 0 &&
                !isPending && (
                    <div className="my-10">
                        <div className="mt-5">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={hospital_staffs.totalPages}
                                totalItems={hospital_staffs.totalCount}
                                perPage={itemsPerPage}
                                hasNext={hospital_staffs.hasNextPage}
                                hasPrev={hospital_staffs.hasPreviousPage}
                                onPageChange={handlePageChange}
                                isLoading={isPending}
                                perPageOptions={[6, 9, 12, 18, 24]}
                                onPerPageChange={handlePerPageChange}
                            />
                        </div>
                    </div>
                )}

            {/* Empty State */}
            {hospital_staffs && hospital_staffs.items.length === 0 && (
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

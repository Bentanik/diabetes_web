"use client";

import React from "react";
import { SearchIcon, ArrowUpDown, FunnelX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@radix-ui/react-toggle";
import { Button } from "@/components/ui/button";
import HospitalsSelectFilter from "@/components/select-hospital";

interface HospitalStaffFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectSortBy: string;
    setSelectSortBy: (value: string) => void;
    // selectHospital: string;
    selectGender: number | null;
    setSelectGender: (value: number | null) => void;
    // setSelectHospital: (value: string) => void;
    isSortAsc: boolean;
    setIsSortAsc: (value: boolean) => void;
}

const sortBy = [
    { name: "Tên bác sĩ", value: "name" },
    { name: "Năm kinh nghiệm", value: "experiences" },
    { name: "Chức vụ", value: "position" },
    { name: "Ngày tham gia", value: "createdDate" },
    { name: "Ngày sinh", value: "dateOfBirth" },
    { name: "Giới tính", value: "gender" },
];

const listGender = [
    { name: "Nam", value: 0 },
    { name: "Nữ", value: 1 },
];

export default function HospitalStaffFilters({
    searchTerm,
    setSearchTerm,
    selectSortBy,
    setSelectSortBy,
    selectGender,
    setSelectGender,
    // selectHospital,
    // setSelectHospital,
    isSortAsc,
    setIsSortAsc,
}: HospitalStaffFiltersProps) {
    const handleClearFilter = () => {
        setSearchTerm("");
        setSelectSortBy("createdDate");
        // setSelectHospital("");
    };
    return (
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Tìm kiếm theo tên nhân viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Select sort by */}
                <select
                    value={selectSortBy}
                    onChange={(e) => setSelectSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="createdDate">Ngày tham gia</option>
                    {sortBy.map((dept) => (
                        <option key={dept.name} value={dept.value}>
                            {dept.name}
                        </option>
                    ))}
                </select>

                {/* Select gender */}
                <select
                    value={selectGender === null ? "" : selectGender}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSelectGender(val === "" ? null : Number(val));
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Tất cả</option>
                    {listGender.map((dept) => (
                        <option key={dept.name} value={dept.value}>
                            {dept.name}
                        </option>
                    ))}
                </select>

                {/* Select Hospital */}
                {/* <HospitalsSelectFilter
                    onHospitalChange={setSelectHospital}
                    selectHospital={selectHospital}
                /> */}

                <Toggle
                    pressed={isSortAsc}
                    onPressedChange={setIsSortAsc}
                    className="cursor-pointer flex items-center border px-3 rounded-[10px]"
                >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    {isSortAsc ? "A → Z" : "Z → A"}
                </Toggle>

                <Button
                    className="bg-white text-red-400 border-red-300 border-[1px] hover:bg-red-300 cursor-pointer hover:text-[white]"
                    onClick={handleClearFilter}
                >
                    <FunnelX />
                    Xóa bộ lọc
                </Button>
            </div>
        </div>
    );
}

"use client";

import React, { useEffect } from "react";
import { SearchIcon, ArrowUpDown, FunnelX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@radix-ui/react-toggle";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

interface DoctorFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectSortBy: string;
    setSelectSortBy: (value: string) => void;
    selectGender: number | null;
    setSelectGender: (value: number | null) => void;
    selectPosition: number | null;
    setSelectPosition: (value: number | null) => void;
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

const listPosition = [
    { name: "Giám đốc", value: 0 },
    { name: "Phó giám đốc", value: 1 },
    { name: "Trưởng khoa", value: 2 },
    { name: "Phó trưởng khoa", value: 3 },
    { name: "Bác sĩ", value: 4 },
];

export default function DoctorFilters({
    searchTerm,
    setSearchTerm,
    selectSortBy,
    setSelectSortBy,
    selectGender,
    setSelectGender,
    selectPosition,
    setSelectPosition,
    isSortAsc,
    setIsSortAsc,
}: DoctorFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Đồng bộ URL parameters với trạng thái khi component mount
    useEffect(() => {
        const sortByParam = searchParams.get("sortBy") || "createdDate";
        const genderParam = searchParams.get("gender");
        const positionParam = searchParams.get("position");
        const searchParam = searchParams.get("search") || "";
        const sortAscParam =
            searchParams.get("sortAsc") === "false" ? false : true;

        setSelectSortBy(sortByParam);
        setSelectGender(genderParam ? Number(genderParam) : null);
        setSelectPosition(positionParam ? Number(positionParam) : null);
        setSearchTerm(searchParam);
        setIsSortAsc(sortAscParam);
    }, [
        searchParams,
        setSelectSortBy,
        setSelectGender,
        setSelectPosition,
        setSearchTerm,
        setIsSortAsc,
    ]);

    // Hàm cập nhật URL parameters
    const updateURLParams = (
        newParams: Partial<Record<string, string | number | boolean | null>>
    ) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });

        router.push(`?${params.toString()}`);
    };

    // Xử lý xóa bộ lọc
    const handleClearFilter = () => {
        setSearchTerm("");
        setSelectSortBy("createdDate");
        setSelectGender(null);
        setSelectPosition(null);
        setIsSortAsc(true);

        const params = new URLSearchParams();
        router.push(`?${params.toString()}`);
    };

    // Xử lý thay đổi sortBy
    const handleSortByChange = (sortBy: string) => {
        setSelectSortBy(sortBy);
        updateURLParams({ sortBy });
    };

    // Xử lý thay đổi searchTerm
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        updateURLParams({ search: value });
    };

    // Xử lý thay đổi gender
    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const gender = val === "" ? null : Number(val);
        setSelectGender(gender);
        updateURLParams({ gender });
    };

    // Xử lý thay đổi position
    const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const position = val === "" ? null : Number(val);
        setSelectPosition(position);
        updateURLParams({ position });
    };

    // Xử lý thay đổi sortAsc
    const handleSortAscChange = (value: boolean) => {
        setIsSortAsc(value);
        updateURLParams({ sortAsc: value });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Tìm kiếm theo tên, email, khoa..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-10"
                    />
                </div>

                {/* Select sort by */}
                <select
                    value={selectSortBy}
                    onChange={(e) => handleSortByChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {sortBy.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                            {dept.name}
                        </option>
                    ))}
                </select>

                {/* Select gender */}
                <select
                    value={selectGender === null ? "" : selectGender}
                    onChange={handleGenderChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Tất cả</option>
                    {listGender.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                            {dept.name}
                        </option>
                    ))}
                </select>

                {/* Select position */}
                <select
                    value={selectPosition === null ? "" : selectPosition}
                    onChange={handlePositionChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Tất cả</option>
                    {listPosition.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                            {dept.name}
                        </option>
                    ))}
                </select>

                <Toggle
                    pressed={isSortAsc}
                    onPressedChange={handleSortAscChange}
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

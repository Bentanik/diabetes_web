"use client";

import React, { useMemo, useState } from "react";
import Header from "./header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    ArrowUpDown,
    Eye,
    Pause,
    Play,
    Pencil,
    Trash2,
    Search,
    UsersIcon,
    Eraser,
} from "lucide-react";
import { useGetPackages } from "../hooks/use-get-packages";
import { useDebounce } from "@/hooks/use-debounce";
import Pagination from "@/components/shared/pagination";
import { motion } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SkeletonFolderGrid } from "@/components/skeleton-card/skeleton-card";

export default function ManagePackage() {
    const [search, setSearch] = useState("");
    const [isSortAsc, setIsSortAsc] = useState(false);
    const debouncedSearch = useDebounce(search, 400);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [sortBy, setSortBy] = useState<string>("createdDate");

    const { packages, isPending } = useGetPackages({
        search: debouncedSearch,
        pageIndex: currentPage,
        pageSize: itemsPerPage,
        sortBy: sortBy,
        sortDirection: isSortAsc ? 0 : 1,
        isActive: true,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (perPage: number) => {
        setItemsPerPage(perPage);
        setCurrentPage(1);
    };

    const handleClearFilter = () => {
        setSearch("");
        setSortBy("createdDate");
        setIsSortAsc(false);
        setCurrentPage(1);
    };

    const data = useMemo(() => packages?.items ?? [], [packages]);

    const formatCurrency = (v: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(v);

    const formatDate = (d: string) => {
        const date = new Date(d);
        return `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
    };

    return (
        <div>
            <Header />
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 md:justify-between">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Tìm theo tên hoặc mô tả..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select
                            value={sortBy}
                            onValueChange={(v) => {
                                setSortBy(v);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="min-w-48">
                                <SelectValue placeholder="Sắp xếp theo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdDate">
                                    Ngày tạo
                                </SelectItem>
                                <SelectItem value="price">Giá</SelectItem>
                                <SelectItem value="sessions">
                                    Số lượt
                                </SelectItem>
                                <SelectItem value="durationInMonths">
                                    Thời hạn
                                </SelectItem>
                                <SelectItem value="name">Tên gói</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={() => setIsSortAsc((s) => !s)}
                            className="btn-hover-effect"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            <span>{isSortAsc ? "A -> Z" : "Z -> A"}</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleClearFilter}
                            className="btn-hover-effect"
                        >
                            <Eraser className="w-4 h-4" />
                            <span>Xóa lọc</span>
                        </Button>
                    </div>
                </div>

                {isPending && <SkeletonFolderGrid count={6} />}

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    {data.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="border border-gray-200 rounded-2xl"
                        >
                            <div className="bg-[#248FCA] rounded-t-2xl">
                                <h3 className="text-base font-semibold text-[white] p-5">
                                    {pkg.name}
                                </h3>
                            </div>
                            <div className="p-5">
                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Giá:
                                        </span>
                                        <span className="font-semibold text-gray-800 text-lg">
                                            {formatCurrency(pkg.price)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Số lượt:
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {pkg.sessions} lượt
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Thời hạn:
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {pkg.durationInMonths} tháng
                                        </span>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Tạo:
                                        </span>
                                        <span className="text-gray-700">
                                            {formatDate(pkg.createdDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {packages?.items.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                    >
                        <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Không tìm thấy gói tư vấn nào
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                        </p>
                    </motion.div>
                )}
                {packages && packages?.items.length > 0 && !isPending && (
                    <div className="my-10">
                        <div className="mt-5">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={packages.totalPages}
                                totalItems={packages.totalCount}
                                perPage={itemsPerPage}
                                hasNext={packages.hasNextPage}
                                hasPrev={packages.hasPreviousPage}
                                onPageChange={handlePageChange}
                                isLoading={isPending}
                                perPageOptions={[6, 9, 12, 18, 24]}
                                onPerPageChange={handlePerPageChange}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

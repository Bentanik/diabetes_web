/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react-hooks/exhaustive-deps

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    BarChartIcon,
    BellIcon,
    SearchIcon,
    UsersIcon,
    ClipboardType,
    CalendarClock,
    UserRound,
    ArrowUpDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useGetConversations } from "../hooks/use-get-conversations";
import { Toaster } from "sonner";
import Image from "next/image";
import PaginatedComponent from "@/components/paginated";
import { useDebounce } from "@/hooks/use-debounce";
import { Toggle } from "@radix-ui/react-toggle";
import { SkeletonFolderGrid } from "@/components/skeleton-card/skeleton-card";
import Header from "./header";
import CreateConversation from "./create-conversation-dialog";
import Link from "next/link";

const sortBy = [
    { name: "Tên nhóm", value: "name" },
    { name: "Ngày tạo", date: "date" },
];

export default function GroupHospitalComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectSortBy, setSelectSortBy] = useState<string>("all");
    const [isSortAsc, setIsSortAsc] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const pageSize = 6;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { conversations, isPending, isError, error } = useGetConversations({
        search: debouncedSearchTerm,
        pageIndex: currentPage,
        pageSize: pageSize,
        sortBy: selectSortBy,
        direction: isSortAsc ? 0 : 1,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
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
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative w-[70%]">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm theo tên nhóm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={selectSortBy}
                            onChange={(e) => setSelectSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer w-[15%]"
                        >
                            <option value="date">Mặc định</option>
                            {sortBy.map((sort) => (
                                <option key={sort.name} value={sort.value}>
                                    {sort.name}
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
                    <div className="flex gap-2">
                        <CreateConversation
                            isDialogOpen={isDialogOpen}
                            setIsDialogOpen={setIsDialogOpen}
                        />
                    </div>
                </div>
            </motion.div>

            {isPending && <SkeletonFolderGrid count={6} />}

            {/* Staff Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conversations?.items.map((conversation, index) => (
                    <motion.div
                        key={conversation.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                    >
                        <Link
                            href={`/hospitals/conversation/conversation-detail/${conversation.id}`}
                            key={conversation.id}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={conversation.avatar}
                                        alt="avatar"
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover w-12 h-12"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-[1.5rem]">
                                            {conversation.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            {/* Info */}
                            <div className="space-y-3 my-10">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <ClipboardType className="w-4 h-4" />
                                        <span>Loại nhóm chat:</span>
                                    </div>
                                    <span className="text-sm text-gray-600 border px-4 py-1 rounded-full">
                                        {conversation.conversationType === 0
                                            ? "Nhóm"
                                            : "Cá nhân"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CalendarClock className="w-4 h-4" />
                                        <span>Ngày tạo: </span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {formatDate(conversation.modifiedDate)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <UserRound className="w-4 h-4" />
                                        <span>Số lượng thành viên: </span>
                                    </div>
                                    <span className="text-[1rem] font-bold text-[#248FCA]">
                                        {conversation.memberCount}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
            {conversations?.items.length !== 0 && !isPending && (
                <div className="my-10">
                    <div className="mt-5">
                        <PaginatedComponent
                            totalPages={conversations?.totalPages || 0}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}

            {/* Empty State */}
            {conversations?.items.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                >
                    <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Không tìm thấy nhóm chat
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                </motion.div>
            )}
        </div>
    );
}

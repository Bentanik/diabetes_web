/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react-hooks/exhaustive-deps
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
    ArrowUpDown,
    BadgeCheck,
    BadgeX,
    CircleDotDashed,
    Eye,
    FileWarning,
    FunnelX,
    XCircleIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import PaginatedComponent from "@/components/paginated";
import BlogStatusDropdown from "./select-status";
import DoctorSelectFilter from "@/components/select_doctor";
import MultiSelectCategoriesFilter from "@/components/select-category";
import BlogSortDropdown from "@/components/select-sort";
import ModeratorSelectFilter from "@/components/select_moderator";
import { useDebounce } from "@/hooks/use-debounce";
import { useAppSelector } from "@/stores";
import { useGetCategories } from "../update-blog/hooks/use-get-categories";
import { useGetBlogs } from "../hooks/use-get-blogs";
import { SkeletonFolderGrid } from "@/components/skeleton-card/skeleton-card";
import Header from "./header";

export default function ModeratorManageBlogComponent() {
    const user = useAppSelector((state) => state.userSlice);
    const isSystemAdmin = user.user?.roles?.includes("SystemAdmin");

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<number>(
        isSystemAdmin ? 1 : 0
    );
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectModerator, setSelectModerator] = useState<string>("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
        []
    );
    const [selectedOption, setSelectedOption] = useState<string>("createdDate");

    const [isSortAsc, setIsSortAsc] = useState(true);

    const pageSize = 6;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleClearFilter = () => {
        setSelectedDoctor("");
        setSelectModerator("");
        setSelectedCategoryIds([]);
        setSearchTerm("");
        setSelectedOption("createdDate");
    };

    const { categories, isPending } = useGetCategories();

    const {
        blogs,
        isPending: blogsPending,
        isError,
        error,
    } = useGetBlogs({
        searchContent: debouncedSearchTerm,
        categoryIds: selectedCategoryIds,
        status: selectedStatus,
        moderatorId: selectModerator,
        doctorId: selectedDoctor,
        pageIndex: currentPage,
        pageSize: pageSize,
        sortType: selectedOption,
        isSortAsc: isSortAsc,
    });

    const getStatusIcon = (status: number) => {
        switch (status) {
            case 0:
                return <CircleDotDashed color="orange" className="w-4 h-4" />;
            case 1:
                return <BadgeCheck color="green" className="w-4 h-4" />;
            case -1:
                return <BadgeX color="red" className="w-4 h-4" />;
            case -2:
                return <CircleDotDashed color="gray" className="w-4 h-4" />;
            default:
                return <XCircleIcon className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 1:
                return "Đã duyệt";
            case -1:
                return "Từ chối";
            case 0:
                return "Chờ xác thực";
            case -2:
                return "Bản nháp";
            default:
                return "Không xác định";
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            {/* Header */}
            <header>
                <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>

            {/* Main */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6"
            >
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-2 flex-1">
                        {/*Select status*/}
                        <BlogStatusDropdown
                            selectedStatus={selectedStatus}
                            onStatusChange={setSelectedStatus}
                        />
                        {/* Select Category*/}
                        <MultiSelectCategoriesFilter
                            data={categories}
                            isPending={isPending}
                            onCategoryChange={setSelectedCategoryIds}
                            selectedCategories={selectedCategoryIds}
                        />
                        {/* Select Doctor */}
                        <DoctorSelectFilter
                            onDoctorChange={setSelectedDoctor}
                            selectDoctor={selectedDoctor}
                        />

                        {/* Select Moderator */}
                        {isSystemAdmin && (
                            <ModeratorSelectFilter
                                onModeratorChange={setSelectModerator}
                                selectedModerator={selectModerator}
                            />
                        )}

                        {/* Select Sort Type */}
                        <BlogSortDropdown
                            onSortChange={setSelectedOption}
                            selectedOption={selectedOption}
                        />
                        {/* Sort ASC/ DES */}
                        <Toggle
                            pressed={isSortAsc}
                            onPressedChange={setIsSortAsc}
                            className="cursor-pointer"
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
            </motion.div>

            {blogsPending && <SkeletonFolderGrid count={6} />}

            {/* Staff Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs?.items.map((data, index) => (
                    <Link
                        href={`/admin/blogs/blog-detail/${data.id}`}
                        key={data.id}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Header */}
                            <div>
                                <Image
                                    src={
                                        data.thumbnail ||
                                        "/images/default_img.jpg"
                                    }
                                    alt="thumbnail"
                                    width={100}
                                    height={50}
                                    className="w-full rounded-2xl h-[250px] object-cover"
                                />
                            </div>

                            {/* Body */}
                            <div className="p-4">
                                <div className="flex justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(data.status)}
                                        {getStatusText(data.status)}
                                    </div>
                                    <p className="text-gray-600 text-[0.9rem] font-light">
                                        {data?.createdDate
                                            ? formatDate(data.createdDate)
                                            : "Không hiển thị ngày đăng"}
                                    </p>
                                </div>
                                <div className="content-center mt-4">
                                    <h1 className="text-[1.5rem] font-medium line-clamp-2 min-h-[72px]">
                                        {data.title ||
                                            "Tiêu đề bài viết chưa được thiết lập"}
                                    </h1>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={
                                                data.doctor.imageUrl ||
                                                "/images/default_user.png"
                                            }
                                            alt="avatar"
                                            width={50}
                                            height={50}
                                            className="w-[50px] h-[50px] rounded-full"
                                        />
                                        <p className="">
                                            {data.doctor.fullName ||
                                                "Chưa hiển thị bác sĩ"}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Eye />
                                        <p>{data.view || "0"}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
            {/* Show pagination when has data */}
            {blogs?.items && blogs.items.length > 0 && !blogsPending && (
                <div className="my-10">
                    <div className="mt-5">
                        <PaginatedComponent
                            totalPages={blogs.totalPages || 1}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}

            {/* Empty State - sử dụng cùng data source */}
            {blogs?.items.length === 0 && !blogsPending && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                >
                    <FileWarning className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Không tìm thấy bài viết
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                </motion.div>
            )}
        </div>
    );
}

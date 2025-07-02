"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
    BellIcon,
    HospitalIcon,
    XCircleIcon,
    FileWarning,
    BadgeCheck,
    BadgeX,
    CircleDotDashed,
    Eye,
    ArrowUpDown,
} from "lucide-react";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import Link from "next/link";
import Image from "next/image";
import useGetBlogs from "../hooks/use-get-blogs";
import PaginatedComponent from "@/components/paginated";
import BlogStatusDropdown from "./select-status";
import DoctorSelectFilter from "@/components/select_doctor";
import MultiSelectCategoriesFilter from "@/components/select-category";
import useGetDataCategories from "@/app/admin/blogs/update-blog/hooks/use-get-categories";
import BlogSortDropdown from "@/components/select-sort";
import SearchInput from "@/components/search";
import useCreateBlog from "@/app/admin/blogs/hooks/use-create-blog";

const doctors = [
    {
        Id: "9554b171-acdc-42c3-8dec-5d3aba44ca99",
        value: "tanphat",
        label: "Bs.Lâm Tấn Phát",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b71",
        value: "tanphat1",
        label: "Bs.Lâm Tấn Phát1",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b72",
        value: "tanphat2",
        label: "Bs.Lâm Tấn Phát2",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b73",
        value: "tanphat3",
        label: "Bs.Lâm Tấn Phát3",
    },
    {
        Id: "019771dd-87ee-75a9-513c-1e6200629b74",
        value: "tanphat4",
        label: "Bs.Lâm Tấn Phát4",
    },
];

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
    const { onSubmit } = useCreateBlog();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateForm = () => {
        setIsSubmitting(true);
        try {
            onSubmit();
        } catch (err) {
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Quản lý bài viết
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Tổng cộng 6 bài viết - 6 kết quả hiển thị
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <SearchInput
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <Link href="/admin/blogs/create-blog">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            variant="outline"
                            className="gap-2 cursor-pointer"
                            onClick={handleCreateForm}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Đang tạo...
                                </div>
                            ) : (
                                "Tạo bài post"
                            )}
                        </Button>
                    </Link>
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

export default function ModeratorManageBlogComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<number>(1);
    const { getBlogsApi } = useGetBlogs();
    const [data, setData] = useState<API.Blog[]>([]);
    const [categoryData, setCategoryData] = useState<API.TGetCategories>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [selectDoctor, setSelectDoctor] = useState<string>("");
    const [selectSortType, setSelectSortType] = useState<string>("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
        []
    );
    const [isSortAsc, setIsSortAsc] = useState(true);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const { getCategoriesApi, isPending } = useGetDataCategories();

    const handleGetData = async (pageIndex: number) => {
        try {
            const res = await getBlogsApi({
                searchContent: searchTerm,
                categoryIds: selectedCategoryIds,
                status: selectedStatus,
                moderatorId: "",
                doctorId: selectDoctor,
                isAdmin: false,
                pageIndex: pageIndex,
                pageSize: 6,
                sortType: selectSortType,
                isSortAsc: isSortAsc,
            });
            setTotalPage(res?.data.totalPages || 1);
            console.log(selectedStatus);
            setData(res?.data.items || []);
        } catch (err) {
            setData([]);
        }
    };

    useEffect(() => {
        const handleGetData = async () => {
            try {
                const res = await getCategoriesApi();
                setCategoryData(res?.data || []);
            } catch (err) {
                console.log(err);
            }
        };
        handleGetData();
    }, []);

    useEffect(() => {
        if (currentPage == 1) {
            handleGetData(1);
            setCurrentPage(1);
        } else handleGetData(currentPage);
    }, [
        selectedStatus,
        selectDoctor,
        selectedCategoryIds,
        searchTerm,
        selectSortType,
        isSortAsc,
    ]);

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
        handleGetData(page);
    };

    const blogData = data.filter((data) => {
        const matchesSearch = data.title
            ? data.title.toLowerCase().includes(searchTerm.toLowerCase())
            : false;
        const matchesStatus =
            selectedStatus === 1 || data.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

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
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/*Select status*/}
                        <BlogStatusDropdown
                            selectedStatus={selectedStatus}
                            onStatusChange={setSelectedStatus} // Truyền hàm setSelectedStatus
                        />
                        {/* Select Category*/}
                        <MultiSelectCategoriesFilter
                            data={categoryData}
                            isPending={isPending}
                            onCategoryChange={setSelectedCategoryIds}
                        />
                        {/* Select Doctor */}
                        <DoctorSelectFilter
                            doctors={doctors}
                            onDoctorChange={setSelectDoctor}
                        />
                        {/* Select Sort Type */}
                        <BlogSortDropdown onSortChange={setSelectSortType} />
                        {/* Sort ASC/ DES */}
                        <Toggle
                            pressed={isSortAsc}
                            onPressedChange={setIsSortAsc}
                            className="cursor-pointer"
                        >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            {isSortAsc ? "A → Z" : "Z → A"}
                        </Toggle>
                    </div>
                </div>
            </motion.div>

            {/* Staff Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogData.map((data, index) => (
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
                                    src={data.thumbnail}
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
                                        {data.title}
                                    </h1>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={data.doctor.imageUrl}
                                            alt="avatar"
                                            width={50}
                                            height={50}
                                            className="w-[50px] h-[50px]"
                                        />
                                        <p className="">
                                            {data.doctor.fullName}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Eye />
                                        <p>{data.view}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
            {data?.length > 0 && (
                <div className="my-10">
                    <div className="mt-5">
                        <PaginatedComponent
                            totalPages={totalPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}

            {/* Empty State */}
            {blogData.length === 0 && (
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

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    BarChartIcon,
    BellIcon,
    PhoneIcon,
    SearchIcon,
    UsersIcon,
    Plus,
    VenusAndMars,
    Briefcase,
    FileBadge,
    ArrowUpDown,
    ImageIcon,
    Upload,
    AlertCircle,
    ArrowRight,
    CircleAlert,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";
import PaginatedComponent from "@/components/paginated";
import { Toggle } from "@radix-ui/react-toggle";
import { Toaster } from "sonner";
import { SkeletonFolderGrid } from "@/components/skeleton-card/skeleton-card";
import { FormProvider, useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import TimePicker from "@/components/time-picker";

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

const mockDoctors = {
    totalPages: 1,
    items: [
        {
            id: "1",
            name: "Bác sĩ Nguyễn Văn A",
            avatar: "/images/home1.jpg",
            phoneNumber: "0909123456",
            numberOfExperiences: 10,
            position: 0,
            gender: 0,
        },
        {
            id: "2",
            name: "Bác sĩ Trần Thị B",
            avatar: "/images/home1.jpg",
            phoneNumber: "0909765432",
            numberOfExperiences: 5,
            position: 4,
            gender: 1,
        },
        {
            id: "3",
            name: "Bác sĩ Lê Văn C",
            avatar: "/images/home1.jpg",
            phoneNumber: "0911123456",
            numberOfExperiences: 7,
            position: 2,
            gender: 0,
        },
    ],
};

const Header = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null
    );
    // Trạng thái cho thời gian bắt đầu và kết thúc
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("00:00");

    const handleCancel = () => {
        setThumbnailPreview(null);
        setStartTime("00:00");
        setEndTime("00:00");
    };

    const form = useForm();

    const handleSubmit = (data: any) => {
        // Log thời gian khi submit form
        console.log("Submitted - Start Time:", startTime);
        console.log("Submitted - End Time:", endTime);
        setIsDialogOpen(false);
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
                        Quản lý khung giờ tư vấn
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <Dialog
                        open={isDialogOpen}
                        onOpenChange={(open) => {
                            if (!open) {
                                handleCancel();
                            }
                            setIsDialogOpen(open);
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="px-6 py-5 bg-[#248FCA] hover:bg-[#2490cada] cursor-pointer"
                            >
                                <Plus width={20} height={20} color="white" />
                                Tạo cuộc tư vấn mới
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[420px] flex flex-col">
                            <DialogHeader className="flex-shrink-0">
                                <DialogTitle className="text-[1.5rem] text-[#248FCA]">
                                    Tạo cuộc tư vấn mới
                                </DialogTitle>
                                <DialogDescription>
                                    Chọn thời gian bắt đầu và kết thúc để tạo
                                    cuộc tư vấn
                                </DialogDescription>
                            </DialogHeader>

                            <FormProvider {...form}>
                                <form
                                    onSubmit={form.handleSubmit(handleSubmit)}
                                    className="flex flex-col flex-1 mt-5"
                                >
                                    <div className="flex-1 space-y-6">
                                        <div className="flex gap-6">
                                            <div>
                                                <Label className="flex font-medium items-center gap-2 text-gray-800 mb-5">
                                                    Thời gian bắt đầu
                                                </Label>
                                                <div className="flex items-center gap-6">
                                                    <TimePicker
                                                        time={startTime}
                                                        onTimeChange={
                                                            setStartTime
                                                        }
                                                    />
                                                    <ArrowRight />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="flex font-medium items-center gap-2 text-gray-800 mb-5">
                                                    Thời gian kết thúc
                                                </Label>
                                                <div className="flex items-center gap-6">
                                                    <TimePicker
                                                        time={endTime}
                                                        onTimeChange={
                                                            setEndTime
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <DialogDescription className="flex items-center gap-1">
                                            <CircleAlert
                                                className="w-4"
                                                color="gray"
                                            />
                                            Lưu ý thời gian tối thiểu cho một
                                            cuộc tư vấn là 30 phút
                                        </DialogDescription>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            className="px-8 h-12 mt-15 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                                        >
                                            Tạo cuộc tư vấn
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </FormProvider>
                        </DialogContent>
                    </Dialog>
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

export default function CreateDoctorSchedule() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectSortBy, setSelectSortBy] = useState<string>("createdDate");
    const [selectGender, setSelectGender] = useState<number | null>(null);
    const [selectPosition, setSelectPosition] = useState<number | null>(null);
    const [isSortAsc, setIsSortAsc] = useState(false);

    const pageSize = 6;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

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
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm theo tên, email, khoa..."
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
                            <option value="createdDate">Ngày tham gia</option>
                            {sortBy.map((dept) => (
                                <option key={dept.name} value={dept.value}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectGender === null ? "" : selectGender}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectGender(
                                    val === "" ? null : Number(val)
                                );
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Drop down bác sĩ</option>
                            {listGender.map((dept) => (
                                <option key={dept.name} value={dept.value}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={
                                selectPosition === null ? "" : selectPosition
                            }
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectPosition(
                                    val === "" ? null : Number(val)
                                );
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả</option>
                            {listPosition.map((dept) => (
                                <option key={dept.name} value={dept.value}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDoctors?.items.map((doctor, index) => (
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

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="w-4 h-4" />
                                        <span>Số điện thoại:</span>
                                    </div>
                                    <span>{doctor.phoneNumber}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FileBadge className="w-4 h-4" />
                                        <span>Số năm kinh nghiệm: </span>
                                    </div>
                                    <span className="font-bold text-[#248FCA]">
                                        {doctor.numberOfExperiences}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        <span>Chức vụ: </span>
                                    </div>
                                    <span>
                                        {getPositionName(doctor.position)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
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

            {mockDoctors?.items.length !== 0 && (
                <div className="my-10">
                    <div className="mt-5">
                        <PaginatedComponent
                            totalPages={mockDoctors?.totalPages || 0}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}

            {mockDoctors?.items.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                >
                    <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Không tìm thấy nhân viên
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                </motion.div>
            )}
        </div>
    );
}

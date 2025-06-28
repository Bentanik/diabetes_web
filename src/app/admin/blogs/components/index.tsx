"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    BellIcon,
    EditIcon,
    EyeIcon,
    HospitalIcon,
    MoreHorizontalIcon,
    SearchIcon,
    XCircleIcon,
    FileWarning,
    BadgeCheck,
    BadgeX,
    CircleDotDashed,
} from "lucide-react";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

const staffData = [
    {
        id: 1,
        title: "Nhận biết sớm, điều trị kịp thời triệu chứng đái tháo đường",
        thumbnail:
            "https://images.unsplash.com/photo-1685485276224-d78ce78f3b95?q=80&w=1056&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        createDate: "2025-06-28",
        status: "approved",
        doctorAvatar:
            "https://res.cloudinary.com/dc4eascme/image/upload/v1750172946/diabetesdoctor/vector-illustration-doctor-avatar-photo-doctor-fill-out-questionnaire-banner-set-more-doctor-health-medical-icon_469123-417_nvqosc.avif",
        doctorName: "Bác sĩ A",
    },
    {
        id: 2,
        title: "Nhận biết sớm, điều trị kịp thời triệu chứng đái tháo đường",
        thumbnail:
            "https://images.unsplash.com/photo-1625035446600-9c5c6b1e4b02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGRpYWJldHxlbnwwfHwwfHx8MA%3D%3D",
        createDate: "2025-06-28",
        status: "reject",
        doctorAvatar:
            "https://res.cloudinary.com/dc4eascme/image/upload/v1750172946/diabetesdoctor/vector-illustration-doctor-avatar-photo-doctor-fill-out-questionnaire-banner-set-more-doctor-health-medical-icon_469123-417_nvqosc.avif",
        doctorName: "Bác sĩ R",
    },
    {
        id: 3,
        title: "Nhận biết sớm, điều trị kịp thời triệu chứng đái tháo đường",
        thumbnail:
            "https://res.cloudinary.com/dc4eascme/image/upload/v1751097334/diabetesdoctor/kmoytobhasblvasp8uwo.jpg",
        createDate: "2025-06-28",
        status: "approved",
        doctorAvatar:
            "https://res.cloudinary.com/dc4eascme/image/upload/v1750172946/diabetesdoctor/vector-illustration-doctor-avatar-photo-doctor-fill-out-questionnaire-banner-set-more-doctor-health-medical-icon_469123-417_nvqosc.avif",
        doctorName: "Bác sĩ L",
    },
    {
        id: 4,
        title: "Nhận biết sớm, điều trị kịp thời triệu chứng đái tháo đường",
        thumbnail:
            "https://res.cloudinary.com/dc4eascme/image/upload/v1751097334/diabetesdoctor/kmoytobhasblvasp8uwo.jpg",
        createDate: "2025-06-28",
        status: "pending",
        doctorAvatar:
            "https://res.cloudinary.com/dc4eascme/image/upload/v1750172946/diabetesdoctor/vector-illustration-doctor-avatar-photo-doctor-fill-out-questionnaire-banner-set-more-doctor-health-medical-icon_469123-417_nvqosc.avif",
        doctorName: "Bác sĩ L",
    },
    {
        id: 5,
        title: "Nhận biết sớm, điều trị kịp thời triệu chứng đái tháo đường",
        thumbnail:
            "https://res.cloudinary.com/dc4eascme/image/upload/v1751097334/diabetesdoctor/kmoytobhasblvasp8uwo.jpg",
        createDate: "2025-06-28",
        status: "pending",
        doctorAvatar:
            "https://res.cloudinary.com/dc4eascme/image/upload/v1750172946/diabetesdoctor/vector-illustration-doctor-avatar-photo-doctor-fill-out-questionnaire-banner-set-more-doctor-health-medical-icon_469123-417_nvqosc.avif",
        doctorName: "Bác sĩ H",
    },
    {
        id: 6,
        title: "Nhận biết sớm, điều trị kịp thời triệu chứng đái tháo đường",
        thumbnail:
            "https://res.cloudinary.com/dc4eascme/image/upload/v1751097334/diabetesdoctor/kmoytobhasblvasp8uwo.jpg",
        createDate: "2025-06-28",
        status: "reject",
        doctorAvatar:
            "https://res.cloudinary.com/dc4eascme/image/upload/v1750172946/diabetesdoctor/vector-illustration-doctor-avatar-photo-doctor-fill-out-questionnaire-banner-set-more-doctor-health-medical-icon_469123-417_nvqosc.avif",
        doctorName: "Bác sĩ G",
    },
];

const Header = () => {
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
                    <Link href="/admin/blogs/create-blog">
                        <Button
                            variant="outline"
                            className="gap-2 cursor-pointer"
                        >
                            <HospitalIcon className="w-4 h-4" />
                            Thêm bài viết
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
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <BadgeCheck color="green" className="w-4 h-4" />;
            case "reject":
                return <BadgeX color="red" className="w-4 h-4" />;
            case "pending":
                return <CircleDotDashed color="orange" className="w-4 h-4" />;
            default:
                return <XCircleIcon className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "approved":
                return "Đã duyệt";
            case "reject":
                return "Từ chối";
            case "pending":
                return "Chờ xác thực";
            default:
                return "Không xác định";
        }
    };

    const filteredStaff = staffData.filter((staff) => {
        const matchesSearch =
            staff.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.doctorName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            selectedStatus === "all" || staff.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

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
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm theo tiêu đề bài viết..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        {/* drop down blog status */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-6 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="approved">Đã được duyệt</option>
                            <option value="pending">Đang đợi duyệt</option>
                            <option value="reject">Bị từ chối</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Staff Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map((data, index) => (
                    <motion.div
                        key={data.id}
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
                                    {data.createDate}
                                </p>
                            </div>
                            <div className="content-center mt-4">
                                <h1 className="text-[1.5rem] font-medium line-clamp-2">
                                    {data.title}
                                </h1>
                            </div>

                            <div className="flex mt-4 items-center gap-4">
                                <Image
                                    src={data.doctorAvatar}
                                    alt="avatar"
                                    width={50}
                                    height={50}
                                    className="w-[50px] h-[50px]"
                                />
                                <p className="">{data.doctorName}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredStaff.length === 0 && (
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

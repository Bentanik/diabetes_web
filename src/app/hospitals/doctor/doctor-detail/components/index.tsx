"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import Image from "next/image";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetDoctorDetail } from "../hooks/use-get-doctor";
import { Toaster } from "sonner";

const Header = () => {
    return (
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
            <div>
                <div className="flex items-center gap-5">
                    <Link href={`/hospitals/doctor`}>
                        <ArrowLeft color="#248fca" />
                    </Link>

                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Thông tin chi tiết
                    </h1>
                </div>
                <p className="text-gray-600 mt-1 ml-11 text-sm">
                    Thông tin chi tiết của bác sĩ
                </p>
            </div>
        </div>
    );
};

export default function DoctorDetailComponent({ doctorId }: REQUEST.DoctorId) {
    const [isOpenDialog, setIsDialogOpen] = useState(false);

    const { doctor_detail, isPending, isError, error } = useGetDoctorDetail({
        doctorId,
    });

    const introduction = doctor_detail?.introduction;

    const getPositionName = (position: any) => {
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

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

            <header>
                <Header />
            </header>
            <main>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
                    <div className="p-5">
                        {/* Header */}
                        <div>
                            <div className="mx-[12%]">
                                <div className="flex leading-5 gap-35">
                                    <Image
                                        src={
                                            doctor_detail?.avatar ||
                                            "/images/default_img.jpg"
                                        }
                                        alt="avatar"
                                        width={350}
                                        height={150}
                                        className="rounded-2xl h-[300px] object-cover"
                                    />
                                    <div>
                                        {/* Trình độ */}
                                        <h2 className="font-bold text-[1.5rem]">
                                            Bác sĩ
                                            <span> {doctor_detail?.name}</span>
                                        </h2>
                                        <div className="flex items-center mt-4 gap-3 relative">
                                            <div className="flex gap-2 items-center">
                                                <BadgeCheck
                                                    width={30}
                                                    color="#0066ff"
                                                />
                                                <p className="text-[#0066ff] text-[1.3rem] font-medium">
                                                    {getPositionName(
                                                        doctor_detail?.position
                                                    )}
                                                </p>
                                            </div>
                                            <div className="w-[1px] h-5 bg-[gray] bottom-100 top-0"></div>

                                            <p className=" text-[1.3rem]">
                                                <span className="font-bold">
                                                    {
                                                        doctor_detail?.numberOfExperiences
                                                    }
                                                </span>{" "}
                                                <span className="font-extralight">
                                                    năm kinh nghiệm
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 mt-5">
                                            <div className="flex items-center gap-10">
                                                <span className="min-w-[100px] text-gray-500">
                                                    Chức vụ:
                                                </span>
                                                <span className="max-w-[100px]">
                                                    {getPositionName(
                                                        doctor_detail?.position
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <span className="min-w-[100px] text-gray-500">
                                                    Nơi làm việc:
                                                </span>
                                                <span className="max-w-[100px]">
                                                    {
                                                        doctor_detail?.hospital
                                                            .name
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <span className="min-w-[100px] text-gray-500">
                                                    Số điện thoại:
                                                </span>
                                                <span className="max-w-[100px]">
                                                    {doctor_detail?.phoneNumber}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Introduction */}
                                <div>
                                    <div className="mt-5">
                                        <p className="text-[1.4rem] font-semibold text-[#248FCA]">
                                            Giới thiệu bác sĩ
                                        </p>
                                    </div>
                                    <div
                                        className="prose prose-sm max-w-none mt-5"
                                        dangerouslySetInnerHTML={{
                                            __html: introduction || "",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

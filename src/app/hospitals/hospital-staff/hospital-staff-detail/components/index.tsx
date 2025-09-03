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
import { useGetHospitalStaffDetail } from "../hooks/use-get-hospital-staff";

const Header = () => {
    return (
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
            <div>
                <div className="flex items-center gap-5">
                    <Link href={`/hospitals/hospital-staff`}>
                        <ArrowLeft color="#248fca" />
                    </Link>

                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Thông tin chi tiết
                    </h1>
                </div>
                <p className="text-gray-600 mt-1 ml-11 text-sm">
                    Thông tin chi tiết của nhân viên
                </p>
            </div>
        </div>
    );
};

export default function HospitalStaffDetailComponent({
    hospitalStaffId,
}: REQUEST.hospitalStaffId) {
    const [isOpenDialog, setIsDialogOpen] = useState(false);

    const { hospital_staff_detail, isPending, isError, error } =
        useGetHospitalStaffDetail({
            hospitalStaffId,
        });

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return;
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const getGender = (gender: number | undefined) => {
        switch (gender) {
            case 0:
                return "Nam";
            case 1:
                return "Nữ";
            default:
                return "Không xác định giới tính";
        }
    };

    const hospital_staff_info = [
        {
            label: "Nhân viên của bệnh viện:",
            value: hospital_staff_detail?.hospital.name,
            color: "black",
        },
        {
            label: "Email:",
            value: hospital_staff_detail?.email,
            color: "#248FCA",
        },
        {
            label: "Giới tính:",
            value: getGender(hospital_staff_detail?.gender),
            color: "black",
        },
        {
            label: "Ngày sinh:",
            value: formatDate(hospital_staff_detail?.dateOfBirth),
            color: "black",
        },
        {
            label: "Ngày tham gia:",
            value: formatDate(hospital_staff_detail?.createdDate),
            color: "black",
        },
    ];

    return (
        <div>
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
                                            hospital_staff_detail?.avatar ||
                                            "/images/default_img.jpg"
                                        }
                                        alt="avatar"
                                        width={350}
                                        height={150}
                                        className="rounded-2xl h-[300px] object-cover"
                                    />
                                    {/* Info */}
                                    <div className="mt-10">
                                        {/* Trình độ */}
                                        <h2 className="font-bold text-[1.7rem]">
                                            <span>
                                                {" "}
                                                {hospital_staff_detail?.name}
                                            </span>
                                        </h2>

                                        <div className="grid grid-cols-[230px_1fr] gap-y-2 mt-7">
                                            {hospital_staff_info.map(
                                                (item, index) => (
                                                    <React.Fragment key={index}>
                                                        <div className="text-gray-500">
                                                            {item.label}
                                                        </div>
                                                        <div
                                                            className={`text-[${item.color}]`}
                                                        >
                                                            {item.value}
                                                        </div>
                                                    </React.Fragment>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

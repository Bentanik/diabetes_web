"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowLeft, BadgeCheck, CircleUserRound } from "lucide-react";
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

    const getGender = (gender: any) => {
        switch (gender) {
            case 0:
                return "Nam";
            case 1:
                return "Nữ";
            default:
                return "Không xác định giới tính";
        }
    };

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
                                            doctor_detail?.avatar ||
                                            "/images/home.jpg"
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
                                    <div className="flex gap-2 mt-10 item-center">
                                        <CircleUserRound
                                            width={30}
                                            height={30}
                                        />
                                        <p className="text-[1.5rem] font-semibold">
                                            Giới thiệu bác sĩ
                                        </p>
                                    </div>
                                    <div className="mt-5">
                                        <p className="font-semibold">
                                            Phó giáo sư, Tiến sĩ, Bác sĩ{" "}
                                            <span className="font-bold">
                                                Trần Quang Nam
                                            </span>{" "}
                                            hiện đang là Trưởng khoa Nội Tiết
                                            bệnh viện Đại học Y Dược TP.HCM, Phó
                                            Trưởng Bộ môn Nội tiết tại Đại học Y
                                            Dược TP.HCM. Bác sĩ có nhiều năm
                                            kinh nghiệm trong việc chuyên khám
                                            và điều trị các bệnh như đái tháo
                                            đường, bệnh bướu cổ, bệnh nội tiết
                                            và các bệnh nội khoa.
                                        </p>

                                        <p className="mt-4">
                                            Trước khi đến thăm khám, Bác sĩ Trần
                                            Quang Nam khuyến khích bệnh nhân đặt
                                            lịch sớm qua
                                            <a
                                                href="#"
                                                className="text-blue-600 underline"
                                            >
                                                ứng dụng YouMed
                                            </a>{" "}
                                            để chọn khung giờ khám phù hợp,
                                            tránh tình trạng hết lịch và giúp
                                            phòng khám phục vụ tốt hơn.
                                            <a
                                                href="#"
                                                className="text-blue-600 underline font-medium"
                                            >
                                                Tải ứng dụng YouMed tại đây
                                            </a>{" "}
                                            để đặt khám và nhận nhiều tiện ích:
                                        </p>

                                        <ul className="list-disc pl-6 mt-4 space-y-1">
                                            <li>
                                                Đăng ký ngày, giờ khám và lấy số
                                                thứ tự sớm.
                                            </li>
                                            <li>Nhận và lưu trữ hồ sơ y tế.</li>
                                            <li>
                                                Nhắc lịch khám và lịch tái khám.
                                            </li>
                                            <li>
                                                Nhắn tin và gọi video với bác
                                                sĩ.
                                            </li>
                                            <li>Đọc tin y tế chính thống.</li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Introduction */}
                                <div className="mt-10 flex justify-end gap-4">
                                    <Dialog
                                        open={isOpenDialog}
                                        onOpenChange={setIsDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                onClick={() => {
                                                    setIsDialogOpen(true);
                                                }}
                                                variant="outline"
                                                className="cursor-pointer px-6 py-6 min-w-[180px] hover:border-red-500 hover:text-red-500"
                                            >
                                                Xóa bác sĩ
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle className="text-[1.5rem]">
                                                    Xóa bác sĩ
                                                </DialogTitle>
                                            </DialogHeader>

                                            {/* <Form {...form}> */}
                                            {/* <Form> */}
                                            <form
                                                // onSubmit={form.handleSubmit(
                                                //     handleRejectBlog
                                                // )}
                                                className="space-y-4"
                                            >
                                                <FormField
                                                    // control={form.control}
                                                    name="reasonRejected"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Lý do từ chối
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Điền lý do từ chối bài viết"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <DialogFooter className="mt-8">
                                                    <DialogClose asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="cursor-pointer"
                                                        >
                                                            Hủy
                                                        </Button>
                                                    </DialogClose>
                                                    <Button
                                                        type="submit"
                                                        // disabled={isPending}
                                                        className="cursor-pointer bg-red-500 hover:bg-red-600"
                                                    >
                                                        {/* {isPending
                                                                ? "Đang xử lý..."
                                                                : "Từ chối"} */}
                                                        Xóa bác sĩ
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                            {/* </Form> */}
                                        </DialogContent>
                                    </Dialog>
                                    <Link
                                        href={`/hospital/doctor/create-doctor`}
                                    >
                                        <Button
                                            variant="outline"
                                            className="cursor-pointer px-6 py-6 min-w-[180px] bg-[#248FCA] hover:bg-[#2490cad8] text-white hover:text-white"
                                        >
                                            Chỉnh sửa bác sĩ
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

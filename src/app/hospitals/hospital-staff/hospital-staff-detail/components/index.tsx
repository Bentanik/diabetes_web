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
import { Toaster } from "sonner";

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
            label: "Ngày tạo:",
            value: formatDate(hospital_staff_detail?.createdDate),
            color: "black",
        },
    ];

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
                                                Xóa nhân viên
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle className="text-[1.5rem]">
                                                    Xóa nhân viên
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
                                                        Xóa nhân viên
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                            {/* </Form> */}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

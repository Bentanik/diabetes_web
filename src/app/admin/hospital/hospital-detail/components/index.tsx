"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowLeft, Globe, MapPin, Phone } from "lucide-react";
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
import AutoCarousel from "@/components/auto-carousel";

const Header = () => {
    return (
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 mb-6 shadow-hospital">
            <div>
                <div className="flex items-center gap-5">
                    <Link href={`/admin/hospital`}>
                        <ArrowLeft color="#248fca" />
                    </Link>

                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Thông tin chi tiết
                    </h1>
                </div>
                <p className="text-gray-600 mt-1 ml-11 text-sm">
                    Thông tin chi tiết của bệnh viện
                </p>
            </div>
        </div>
    );
};

export default function HospitalDetailComponent({
    hospitalId,
}: REQUEST.HospitalId) {
    const [isOpenDialog, setIsDialogOpen] = useState(false);

    // Sample hospital images
    const hospitalImages = [
        "/images/home.jpg",
        "/images/home1.jpg",
        "/images/home2.jpg",
        "/images/home3.jpg",
    ];

    return (
        <div>
            <header>
                <Header />
            </header>
            <main>
                <div className="bg-white rounded-2xl border border-gray-200 mb-6 shadow-hospital overflow-hidden">
                    {/* Hospital Logo and Basic Info */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 bg-blue-50 rounded-lg flex items-center justify-center border-2 border-blue-200">
                                <div className="text-center">
                                    <div className="text-blue-600 font-bold text-lg">
                                        BV
                                    </div>
                                    <div className="text-blue-500 text-xs">
                                        UNG BƯỚU
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    Bệnh viện Ung Bướu TPHCM
                                </h1>
                                <p className="text-gray-600 mb-4">
                                    Kiểm soát ung thư - Vững tin cuộc sống
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Globe size={16} />
                                        <span>Website</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <MapPin size={16} />
                                        <span>Địa chỉ</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Phone size={16} />
                                        <span>
                                            Tổng đài đặt khám: 1900636223
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex gap-8">
                            <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
                                Thông tin
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 pb-2">
                                Chuyên khám
                            </button>
                        </div>
                    </div>

                    {/* Hospital Images Carousel */}
                    <div className="p-6">
                        <AutoCarousel images={hospitalImages} />
                    </div>

                    {/* Hospital Details */}
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Thông tin cơ bản
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex">
                                        <span className="w-24 text-gray-500 text-sm">
                                            Địa chỉ:
                                        </span>
                                        <span className="text-sm">
                                            123 Đường ABC, Quận 1, TP.HCM
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24 text-gray-500 text-sm">
                                            Điện thoại:
                                        </span>
                                        <span className="text-sm">
                                            1900636223
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24 text-gray-500 text-sm">
                                            Email:
                                        </span>
                                        <span className="text-sm">
                                            info@bvungbuou.vn
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24 text-gray-500 text-sm">
                                            Giờ làm việc:
                                        </span>
                                        <span className="text-sm">
                                            7:00 - 17:00 (Thứ 2 - Thứ 7)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Chuyên khoa
                                </h3>
                                <div className="space-y-2">
                                    <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm inline-block mr-2 mb-2">
                                        Ung bướu học
                                    </div>
                                    <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm inline-block mr-2 mb-2">
                                        Xạ trị
                                    </div>
                                    <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm inline-block mr-2 mb-2">
                                        Hóa trị
                                    </div>
                                    <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm inline-block mr-2 mb-2">
                                        Phẫu thuật ung thư
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">
                                Giới thiệu
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Bệnh viện Ung Bướu TP.HCM là bệnh viện chuyên
                                khoa hàng đầu trong lĩnh vực chẩn đoán và điều
                                trị ung thư. Với đội ngũ bác sĩ giàu kinh nghiệm
                                và trang thiết bị y tế hiện đại, bệnh viện cam
                                kết mang đến dịch vụ chăm sóc sức khỏe chất
                                lượng cao cho bệnh nhân ung thư.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-end gap-4">
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
                                        Xóa bệnh viện
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle className="text-[1.5rem]">
                                            Xóa bệnh viện
                                        </DialogTitle>
                                    </DialogHeader>

                                    <form className="space-y-4">
                                        <FormField
                                            name="reasonRejected"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Lý do xóa
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Điền lý do xóa bệnh viện"
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
                                                className="cursor-pointer bg-red-500 hover:bg-red-600"
                                            >
                                                Xóa bệnh viện
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Link href={`/hospital/edit`}>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer px-6 py-6 min-w-[180px] bg-[#248FCA] hover:bg-[#2490cad8] text-white hover:text-white"
                                >
                                    Chỉnh sửa bệnh viện
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowLeft, FileText, Globe, Images, Info, MapPin, Phone } from "lucide-react";
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
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AutoCarousel from "@/components/auto-carousel";
import { useGetHospitalDetail } from "../hooks/use-get-hospital";
import Image from "next/image";

const Header = () => {
    return (
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 mb-6 shadow-hospital">
            <div>
                <div className="flex items-center gap-5">
                    <Link href={`/admin/hospital`}>
                        <ArrowLeft color="#248fca" />
                    </Link>
                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Thông tin chi tiết về bệnh viện
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

    const { hospital_detail, isPending } = useGetHospitalDetail({ hospitalId });
    const introduction = hospital_detail?.introduction;

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
                            <Image
                                src={
                                    hospital_detail?.thumbnail ||
                                    "/images/default_img.jpg"
                                }
                                alt="thumbnail"
                                width={300}
                                height={500}
                                className="object-cover rounded-2xl"
                            />

                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-800 mb-5">
                                    {hospital_detail?.name}
                                </h1>
                                {/* Website */}
                                <div className="flex gap-3">
                                    <div className="flex gap-2">
                                        <Globe width={20} color="#808080d4" />
                                        <span className="text-[#808080d4]">
                                            Website:
                                        </span>
                                    </div>
                                    <span className="text-[#0099ff] max-w-[300px]">
                                        {hospital_detail?.website}
                                    </span>
                                </div>

                                {/* Location */}
                                <div className="flex gap-3 mt-2">
                                    <div className="flex gap-2">
                                        <MapPin width={20} color="#808080d4" />
                                        <span className="text-[#808080d4]">
                                            Địa chỉ:
                                        </span>
                                    </div>
                                    <span className="max-w-[300px]">
                                        {hospital_detail?.address}
                                    </span>
                                </div>

                                {/* Phone number */}
                                <div className="flex gap-3 mt-2">
                                    <div className="flex gap-2">
                                        <Phone width={20} color="#808080d4" />
                                        <span className="text-[#808080d4]">
                                            Số điện thoại:
                                        </span>
                                    </div>
                                    <span className="max-w-[300px]">
                                        {hospital_detail?.phoneNumber}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hospital Images Carousel */}
                    <div className="p-6">
                        <div className="flex gap-2 items-center mb-5">
                            <Images color="#248FCA" />
                            <span className="text-xl font-medium">
                                Ảnh giới thiệu về bệnh viện
                            </span>
                        </div>
                        <AutoCarousel
                            images={hospital_detail?.images || hospitalImages}
                        />
                    </div>

                    {/* Hospital Details */}
                    <div className="p-6">
                        <div className="">
                            <h3 className="text-xl font-medium mb-4 flex gap-2">
                                <Info color="#248FCA" />
                                Giới thiệu về bệnh viện
                            </h3>
                            <div
                                className="prose prose-sm max-w-none mt-5"
                                dangerouslySetInnerHTML={{
                                    __html: introduction || "",
                                }}
                            />
                        </div>

                        {/* Action Buttons */}
                        {/* <div className="mt-8 flex justify-end gap-4">
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
                        </div> */}
                    </div>
                </div>
            </main>
        </div>
    );
}

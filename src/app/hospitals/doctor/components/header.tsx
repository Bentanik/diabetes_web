import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChartIcon, BellIcon, Plus } from "lucide-react";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";

export default function Header() {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Quản lí bác sĩ
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Hiện có 6 kết quả đang hiển thị
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* <Link href="/hospitals/doctor/create-doctor">
                        <Button
                            variant="outline"
                            className="gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm bác sĩ
                        </Button>
                    </Link> */}
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
}

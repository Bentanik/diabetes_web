import React from "react";
import { motion } from "framer-motion";
import { BarChartIcon, BellIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";

export default function Header() {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shadow-lg"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#248FCA] rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#248FCA]">
                            Quản lý khung giờ tư vấn
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Tạo và quản lý lịch tư vấn theo tuần
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="gap-2 bg-transparent">
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

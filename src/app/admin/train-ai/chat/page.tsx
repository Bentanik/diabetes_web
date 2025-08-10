"use client";
import ChatMain from "@/app/admin/train-ai/chat/components";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChartIcon, BellIcon, Settings2 } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 mb-4 sm:mb-6"
                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                            Chat
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm">
                            Trao đổi với trợ lý về kiến thức tiểu đường
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="gap-2">
                            <Settings2 className="w-4 h-4" />
                            Cài đặt
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

            <ChatMain />
        </div>
    );
}

"use client";
import { Metadata } from 'next';
import ChatMain from "@/app/admin/train-ai/chat/components";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BellIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "Chat AI",
    description: "Trao đổi với trợ lý AI về kiến thức tiểu đường",
};

export default function ChatPage() {

    return (
        <div className="">
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

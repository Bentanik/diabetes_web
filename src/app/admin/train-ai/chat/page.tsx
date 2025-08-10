'use client'
import ChatMain from "@/app/admin/train-ai/chat/components";
import { motion } from "framer-motion";

export default function ChatPage() {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 mb-4 sm:mb-6"
                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
            >
                <h2 className="text-lg sm:text-xl font-semibold text-[#248fca]">Chat</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Trao đổi với trợ lý về kiến thức tiểu đường</p>
            </motion.div>

            <ChatMain />
        </div>
    );
}



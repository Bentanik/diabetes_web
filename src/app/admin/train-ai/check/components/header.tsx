"use client"
import { motion } from "framer-motion"
import { ArrowLeftIcon, SquarePercentIcon } from "lucide-react"
import ProfileHospitalMenu from "@/components/profile_hospital_menu"
import Link from "next/link"

export default function Header() {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
            style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={`/admin/train-ai`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                        </motion.button>
                    </Link>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <SquarePercentIcon className="w-5 h-5 text-[#248fca]" />
                        </div>
                        <div className="flex flex-col gap-1">
                            {" "}
                            {/* Đã điều chỉnh gap */}
                            <h1 className="text-xl font-semibold text-[#248fca]">Kiểm tra</h1>
                            <p className="text-sm text-gray-600">Kiểm tra các tài liệu đã huấn luyện.</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ProfileHospitalMenu profile={1} />
                </div>
            </div>
        </motion.div>
    )
}

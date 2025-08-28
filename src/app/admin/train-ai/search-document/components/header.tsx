"use client"
import { motion } from "framer-motion"
import { ArrowLeftIcon, SearchIcon, SettingsIcon, SquarePercentIcon } from "lucide-react"
import ProfileHospitalMenu from "@/components/profile_hospital_menu"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import NotificationDropdown from "@/components/notification"
import { useRouter } from "next/navigation"

export default function Header() {

    const router = useRouter()

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
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.back()}
                        className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors hover:cursor-pointer"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                    </motion.button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <SearchIcon className="w-5 h-5 text-[#248fca]" />
                        </div>
                        <div className="flex flex-col gap-1">
                            {" "}
                            <h1 className="text-xl font-semibold text-[#248fca]">Tìm kiếm tài liệu</h1>
                            <p className="text-sm text-gray-600">Tìm kiếm tài liệu theo ngữ nghĩa</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link href={"/admin/train-ai/chat"}>
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2 bg-transparent"
                            >
                                <SquarePercentIcon className="w-4 h-4" />
                                Kiểm tra
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link href={"/admin/train-ai/setting"}>
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2 bg-transparent"
                            >
                                <SettingsIcon className="w-4 h-4" />
                                Cài đặt
                            </Button>
                        </Link>
                    </motion.div>

                    <NotificationDropdown />
                    <div>
                        <ProfileHospitalMenu profile={1} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

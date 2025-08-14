"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    PlusIcon,
    ChevronDownIcon,
    FolderPlusIcon,
    FileTextIcon,
    SettingsIcon,
    SquarePercentIcon,
} from "lucide-react";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import CreateKnowlegeModal from "@/app/admin/train-ai/components/create_knowlege";
import NotificationDropdown from "@/components/notification";
import Link from "next/link";

export default function Header() {
    const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);

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
                <div>
                    <h1 className="text-2xl font-bold text-[#248fca]">
                        Huấn luyện AI
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Huấn luyện AI để tự động phân tích và đưa ra lời khuyên
                        cho bệnh nhân
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Create Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="outline-none">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="outline"
                                    className="gap-2 bg-transparent"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Tạo
                                    <ChevronDownIcon className="w-4 h-4" />
                                </Button>
                            </motion.div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => setCreateFolderModalOpen(true)}
                                className="gap-2 cursor-pointer"
                            >
                                <FolderPlusIcon className="w-4 h-4" />
                                <span className="text-sm text-gray-800">
                                    Tạo thư mục
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                <FileTextIcon className="w-4 h-4" />
                                <span className="text-sm text-gray-800">
                                    Tạo prompt
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

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

            {/* Create Folder Modal */}
            <CreateKnowlegeModal
                isOpen={createFolderModalOpen}
                onClose={() => setCreateFolderModalOpen(false)}
            />
        </motion.div>
    );
}

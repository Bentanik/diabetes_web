"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Trash, BarChartIcon, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useDeleteConversation from "../hooks/use-delete-conversation";
import UpdateConversationDialog from "./update-conversation";

interface HeaderProps {
    conversationId: string;
}

const Header = ({ conversationId }: HeaderProps) => {
    const { onSubmit, isPending } = useDeleteConversation({ conversationId });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [isOpenDialog, setIsDialogOpen] = useState<boolean>(false);

    const handleFormSubmit = async () => {
        if (!onSubmit || typeof onSubmit !== "function") {
            return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit(() => {
                setIsDialogOpen(false);
                setTimeout(() => {
                    router.push("/hospitals/conversation");
                }, 1000);
            });
        } catch (error) {
            console.error("Error updating post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital"
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-5">
                        <Link href="/hospitals/conversation">
                            <ArrowLeft color="#248fca" />
                        </Link>
                        <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                            Quản lí người dùng trong nhóm
                        </h1>
                    </div>
                    <p className="text-gray-600 mt-1 ml-11 text-sm">
                        Hiện có 6 kết quả hiển thị
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Dialog open={isOpenDialog} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="gap-2 cursor-pointer hover:bg-red-200 py-5"
                            >
                                <Trash className="w-4 h-4" />
                                Xóa nhóm chat
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-[1.5rem] font-medium">
                                    Xóa nhóm chat
                                </DialogTitle>
                                <DialogDescription className="text-[1.1rem]">
                                    Bạn có chắc chắn muốn xóa nhóm ra khỏi danh
                                    sách nhóm chat của bệnh viện?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-5">
                                <div>
                                    <Button
                                        variant="outline"
                                        className="gap-2 cursor-pointer hover:border-gray-300 min-w-[100px]"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Hủy
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        type="submit"
                                        onClick={() => handleFormSubmit()}
                                        variant="outline"
                                        className="gap-2 cursor-pointer hover:bg-red-200 hover:border-red-200"
                                        disabled={isSubmitting || isPending}
                                    >
                                        Xóa nhóm chat
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <UpdateConversationDialog conversationId={conversationId} />
                    <Button variant="outline" className="gap-2">
                        <BarChartIcon className="w-4 h-4" />
                        Xuất báo cáo
                    </Button>
                    <Button variant="ghost" size="icon">
                        <BellIcon className="w-5 h-5" />
                    </Button>
                    <ProfileHospitalMenu profile={1} />
                </div>
            </div>
        </motion.div>
    );
};

export default Header;

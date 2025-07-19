"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Crown,
    BarChartIcon,
    BellIcon,
    SearchIcon,
    ArrowLeft,
    Trash,
    Stethoscope,
    ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import useDeleteConversation from "../hooks/use-delete-conversation";
import useDeleteParticipant from "../hooks/use-delete-participant";

import GroupUserDialog from "./user-dialog";
import GroupDoctorDialog from "./doctor-dialog";
import { Toaster } from "sonner";
import GroupStaffDialog from "./staff-dialog";
import { useGetConversationDetail } from "../hooks/use-get-conversation";
import Image from "next/image";
import useToast from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Toggle } from "@radix-ui/react-toggle";
import { useDebounce } from "@/hooks/use-debounce";
import PaginatedComponent from "@/components/paginated";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import UpdateConversationDialog from "./update-conversation";

const sortBy = [
    { name: "Tên thành viên", value: "name" },
    { name: "Chưa biết", count: 8, color: "name" },
];

const Header = ({ conversationId }: REQUEST.ConversationId) => {
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
                    router.push("/hospital/conversation");
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
                        <Link
                            href="/hospital/conversation
                        "
                        >
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
                                className="gap-2 cursor-pointer hover:bg-red-200"
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
                                    Bạn có chắc chắn muốn xóa nhóm chat ra khỏi
                                    danh sách nhóm chat của bệnh viện ?
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

export default function GroupDetailComponent({
    conversationId,
}: REQUEST.ConversationId) {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [isSortAsc, setIsSortAsc] = useState(false);
    const [selectSortBy, setSelectSortBy] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isOpenDialog, setIsDialogOpen] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pageSize = 10;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { onSubmit, isPending: deletePending } = useDeleteParticipant({
        conversationId,
    });

    // Gọi hook useGetConversationDetail
    const { conversation_detail, isPending, isError, error } =
        useGetConversationDetail(
            { conversationId },
            {
                search: debouncedSearchTerm,
                pageIndex: currentPage,
                pageSize: pageSize,
                sortBy: selectSortBy,
                direction: isSortAsc ? 0 : 1,
            }
        );

    useEffect(() => {
        if (isError && error) {
            addToast({
                type: "error",
                description: "Fail to fetch application",
            });
        }
    }, [isError, error, addToast]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (scrollRef.current && conversation_detail) {
            scrollRef.current.scrollTop = 0;
        }
    }, [conversation_detail]);

    const getRoleIcon = (role: number) => {
        switch (role) {
            case 3:
                return <User className="h-4 w-4" />;
            case 2:
                return <Stethoscope className="h-4 w-4" />;
            default:
                return <Crown className="h-4 w-4" />;
        }
    };

    const getRoleName = (role: number) => {
        switch (role) {
            case 3:
                return "Bệnh nhân";
            case 2:
                return "Bác sĩ";
            default:
                return "Nhân viên";
        }
    };

    const handleDeleteMember = async (userId: string) => {
        if (!onSubmit || typeof onSubmit !== "function") {
            return;
        }
        setIsSubmitting(true);
        try {
            const participantId: REQUEST.DeleteParticipant = {
                participantId: userId,
            };

            await onSubmit(participantId, () => {
                setIsDialogOpen(false);
            });
        } catch (error) {
            console.error("Error updating post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <header>
                <Header conversationId={conversationId} />
            </header>

            <div className="min-h-screen bg-gray-50 flex">
                <main className="flex-1">
                    {/* Search and Filter Bar */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6"
                    >
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="relative flex-1">
                                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Tìm kiếm theo tên, số điện thoại..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                <select
                                    value={selectSortBy}
                                    onChange={(e) =>
                                        setSelectSortBy(e.target.value)
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Mặc định</option>
                                    {sortBy.map((dept) => (
                                        <option
                                            key={dept.name}
                                            value={dept.value}
                                        >
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                                <Toggle
                                    pressed={isSortAsc}
                                    onPressedChange={setIsSortAsc}
                                    className="cursor-pointer flex items-center border px-3 rounded-[10px]"
                                >
                                    <ArrowUpDown className="h-4 w-4 mr-2" />
                                    {isSortAsc ? "A → Z" : "Z → A"}
                                </Toggle>
                            </div>
                            <div className="flex gap-2">
                                <GroupUserDialog
                                    conversationId={conversationId}
                                />
                                <GroupDoctorDialog
                                    conversationId={conversationId}
                                />
                                <GroupStaffDialog
                                    conversationId={conversationId}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[20%]">
                                        Thành viên
                                    </TableHead>
                                    <TableHead className="w-[20%]">
                                        Họ và tên
                                    </TableHead>
                                    <TableHead className="w-[20%]">
                                        Vai trò
                                    </TableHead>
                                    <TableHead className="w-[20%]">
                                        Số điện thoại
                                    </TableHead>
                                    <TableHead className="w-[10%]">
                                        Xóa thành viên
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {conversation_detail?.items.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <Image
                                                        src={
                                                            user.avatar ||
                                                            "/images/default_user.png"
                                                        }
                                                        alt="avatar"
                                                        width={50}
                                                        height={50}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">
                                                {user.fullName || "Không tên"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(user.role)}
                                                {getRoleName(user.role)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                className="max-w-48 truncate"
                                                title={user.phoneNumber}
                                            >
                                                {user.phoneNumber ||
                                                    "Chưa có số điện thoại"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center max-w-[100px]">
                                                <Dialog
                                                    open={isOpenDialog}
                                                    onOpenChange={
                                                        setIsDialogOpen
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <Trash className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors duration-200" />
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle className="text-[1.5rem] font-medium">
                                                                Xóa người dùng
                                                                khỏi nhóm chat
                                                            </DialogTitle>
                                                            <DialogDescription className="text-[1.1rem] my-5">
                                                                Bạn có chắc chắn
                                                                muốn xóa người
                                                                dùng này ra khỏi
                                                                nhóm chat ?
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="flex justify-end gap-3">
                                                            <div>
                                                                <Button
                                                                    variant="outline"
                                                                    className="gap-2 cursor-pointer hover:border-gray-300 min-w-[100px]"
                                                                    onClick={() =>
                                                                        setIsDialogOpen(
                                                                            false
                                                                        )
                                                                    }
                                                                >
                                                                    Hủy
                                                                </Button>
                                                            </div>
                                                            <div>
                                                                <Button
                                                                    type="submit"
                                                                    onClick={() =>
                                                                        handleDeleteMember(
                                                                            user.id
                                                                        )
                                                                    }
                                                                    variant="outline"
                                                                    className="gap-2 cursor-pointer hover:bg-red-200 hover:border-red-200"
                                                                    disabled={
                                                                        isSubmitting ||
                                                                        isPending
                                                                    }
                                                                >
                                                                    Xóa người
                                                                    dùng
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {!isPending &&
                            conversation_detail?.items.length !== 0 && (
                                <div className="my-10">
                                    <div className="mt-5">
                                        <PaginatedComponent
                                            totalPages={
                                                conversation_detail?.totalPages ||
                                                0
                                            }
                                            currentPage={currentPage}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            )}

                        {!isPending &&
                            (!conversation_detail ||
                                conversation_detail?.items.length === 0) && (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <User className="h-12 w-12 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Không tìm thấy thành viên
                                    </h3>
                                    <p className="text-gray-500">
                                        Thử điều chỉnh bộ lọc hoặc tìm kiếm với
                                        từ khóa khác
                                    </p>
                                </div>
                            )}
                    </div>
                </main>
            </div>
        </div>
    );
}

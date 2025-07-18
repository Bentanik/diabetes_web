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
import GroupUserDialog from "@/app/hospital/group/group-detail/components/user-dialog";
import GroupDoctorDialog from "@/app/hospital/group/group-detail/components/doctor-dialog";
import { Toaster } from "sonner";
import GroupStaffDialog from "./staff-dialog";
import useGetConversationDetail from "../hooks/use-get-conversation";
import Image from "next/image";
import useToast from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const sortBy = [
    { name: "Tên thành viên", value: "name" },
    { name: "Chưa biết", count: 8, color: "name" }, // Note: `count` and `color` seem unused; verify if needed
];

interface HeaderProps {
    groupId: string;
}

const Header = ({ groupId }: HeaderProps) => {
    const { onSubmit, isPending } = useDeleteConversation(groupId);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleFormSubmit = async () => {
        if (!onSubmit || typeof onSubmit !== "function") {
            return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit(() => {
                setTimeout(() => {
                    router.push("/hospital/group");
                }, 2000);
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
                        <Link href="/hospital/group">
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
                    <Button
                        type="submit"
                        onClick={() => handleFormSubmit()}
                        variant="outline"
                        className="gap-2 cursor-pointer hover:bg-red-200"
                        disabled={isSubmitting || isPending}
                    >
                        <Trash className="w-4 h-4" />
                        Xóa nhóm chat
                    </Button>
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

export default function GroupDetailComponent({ groupId }: { groupId: string }) {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSortAsc, setIsSortAsc] = useState(false);
    const [selectSortBy, setSelectSortBy] = useState<string>("all");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const scrollRef = useRef<HTMLDivElement>(null);
    const pageSize = 6;

    // Debounce searchTerm
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Gọi hook useGetConversationDetail
    const { conversationDetail, isPending, isError, error } =
        useGetConversationDetail(groupId, {
            search: debouncedSearchTerm,
            pageIndex: currentPage,
            pageSize: pageSize,
            sortBy: selectSortBy,
            direction: isSortAsc ? 0 : 1,
        });

    // Xử lý lỗi
    useEffect(() => {
        if (isError && error) {
            addToast({
                type: "error",
                description: "Fail to fetch application",
            });
        }
    }, [isError, error, addToast]);

    // Cuộn về đầu khi dữ liệu thay đổi
    useEffect(() => {
        if (scrollRef.current && conversationDetail) {
            scrollRef.current.scrollTop = 0;
        }
    }, [conversationDetail]);

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

    const handleDeleteMember = (userId: string) => {
        console.log("userId nè m" + userId);
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <header>
                <Header groupId={groupId} />
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
                                    value={selectedDepartment}
                                    onChange={(e) =>
                                        setSelectedDepartment(e.target.value)
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
                                <select
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(e.target.value)
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">
                                        Tất cả trạng thái
                                    </option>
                                    <option value="active">
                                        Đang hoạt động
                                    </option>
                                    <option value="inactive">Tạm nghỉ</option>
                                    <option value="pending">
                                        Chờ xác thực
                                    </option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <GroupUserDialog groupId={groupId} />
                                <GroupDoctorDialog groupId={groupId} />
                                <GroupStaffDialog groupId={groupId} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thành viên</TableHead>
                                    <TableHead>Họ và tên</TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead>Số điện thoại</TableHead>
                                    <TableHead className="max-w-[40px]">
                                        Xóa thành viên
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {conversationDetail?.map((user) => (
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
                                                {user.role}
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
                                                <Trash
                                                    onClick={() =>
                                                        handleDeleteMember(
                                                            user.id
                                                        )
                                                    }
                                                    className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors duration-200"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {(!conversationDetail ||
                            conversationDetail.length === 0) && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <User className="h-12 w-12 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Không tìm thấy thành viên
                                </h3>
                                <p className="text-gray-500">
                                    Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ
                                    khóa khác
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import {
    BarChartIcon,
    BellIcon,
    PlusIcon,
    SearchIcon,
    UsersIcon,
    ClipboardType,
    CalendarClock,
    UserRound,
    Info,
    Plus,
    User,
    X,
    Crown,
    Shield,
    Clock,
    AlertCircle,
    SquareMousePointer,
} from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import useCreateConversation, {
    ConversationFormData,
} from "../hooks/use-create-conversation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Router from "next/navigation";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

const staffData = [
    {
        id: 1,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đang hoạt động",
    },
    {
        id: 2,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đang hoạt động",
    },
    {
        id: 3,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đã dừng hoạt động",
    },
    {
        id: 4,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đang hoạt động",
    },
    {
        id: 5,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đã dừng hoạt động",
    },
    {
        id: 6,
        name: "Nhóm chat cho hội tiểu đường type 1",
        avatar: "/images/auth1.jpg",
        conversationType: "Loại 1",
        createDate: "2023-01-15",
        patientsCount: 45,
        status: "Đang hoạt động",
    },
];

interface GroupUser {
    id: string;
    name: string;
    avatar?: string;
    initials: string;
    role: "doctor" | "patient" | "admin";
    email: string;
    phone: string;
    status: "online" | "offline" | "away";
    joinDate: string;
    lastActive: string;
    messagesCount: number;
}

const groupUsers: GroupUser[] = [
    {
        id: "U001",
        name: "Dr. Nguyễn Văn An",
        initials: "NA",
        role: "doctor",
        email: "dr.an@medchat.com",
        phone: "0987654321",
        status: "online",
        joinDate: "2023-01-15",
        lastActive: "2024-01-09 14:30",
        messagesCount: 245,
    },
    {
        id: "U002",
        name: "Trần Thị Mai",
        initials: "TM",
        role: "patient",
        email: "mai.tran@email.com",
        phone: "0912345678",
        status: "online",
        joinDate: "2023-03-20",
        lastActive: "2024-01-09 14:25",
        messagesCount: 89,
    },
    {
        id: "U003",
        name: "Lê Văn Hùng",
        initials: "LH",
        role: "patient",
        email: "hung.le@email.com",
        phone: "0923456789",
        status: "away",
        joinDate: "2023-02-10",
        lastActive: "2024-01-09 12:15",
        messagesCount: 156,
    },
    {
        id: "U004",
        name: "Phạm Thu Hương",
        initials: "PH",
        role: "patient",
        email: "huong.pham@email.com",
        phone: "0934567890",
        status: "offline",
        joinDate: "2023-04-05",
        lastActive: "2024-01-08 16:45",
        messagesCount: 67,
    },
    {
        id: "U005",
        name: "Admin System",
        initials: "AS",
        role: "admin",
        email: "admin@medchat.com",
        phone: "0945678901",
        status: "online",
        joinDate: "2023-01-01",
        lastActive: "2024-01-09 14:35",
        messagesCount: 12,
    },
    {
        id: "U006",
        name: "Admin System",
        initials: "AS",
        role: "admin",
        email: "admin@medchat.com",
        phone: "0945678901",
        status: "online",
        joinDate: "2023-01-01",
        lastActive: "2024-01-09 14:35",
        messagesCount: 12,
    },
    {
        id: "U007",
        name: "Admin System",
        initials: "AS",
        role: "admin",
        email: "admin@medchat.com",
        phone: "0945678901",
        status: "online",
        joinDate: "2023-01-01",
        lastActive: "2024-01-09 14:35",
        messagesCount: 12,
    },
    {
        id: "U008",
        name: "Admin System",
        initials: "AS",
        role: "admin",
        email: "admin@medchat.com",
        phone: "0945678901",
        status: "online",
        joinDate: "2023-01-01",
        lastActive: "2024-01-09 14:35",
        messagesCount: 12,
    },
    {
        id: "U009",
        name: "Admin System",
        initials: "AS",
        role: "admin",
        email: "admin@medchat.com",
        phone: "0945678901",
        status: "online",
        joinDate: "2023-01-01",
        lastActive: "2024-01-09 14:35",
        messagesCount: 12,
    },
    {
        id: "U010",
        name: "Admin System",
        initials: "AS",
        role: "admin",
        email: "admin@medchat.com",
        phone: "0945678901",
        status: "online",
        joinDate: "2023-01-01",
        lastActive: "2024-01-09 14:35",
        messagesCount: 12,
    },
    {
        id: "U011",
        name: "Admin System",
        initials: "AS",
        role: "admin",
        email: "admin@medchat.com",
        phone: "0945678901",
        status: "online",
        joinDate: "2023-01-01",
        lastActive: "2024-01-09 14:35",
        messagesCount: 12,
    },
];

const departmentStats = [
    { name: "Nội tiết", count: 12, color: "bg-blue-500" },
    { name: "Tim mạch", count: 8, color: "bg-red-500" },
    { name: "Nhi khoa", count: 15, color: "bg-green-500" },
    { name: "Ngoại khoa", count: 10, color: "bg-purple-500" },
    { name: "Cấp cứu", count: 6, color: "bg-orange-500" },
];

const Header = () => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Quản lí nhóm chat
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Hiện có 6 kết quả hiển thị
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="gap-2">
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
};

export default function GroupHospitalComponent() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const { onSubmit, form, isPending } = useCreateConversation();

    const scrollRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const filteredStaff = staffData.filter((staff) => {
        const matchesSearch = staff.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === "all";
        const matchesStatus = selectedStatus === "all";

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    const filteredUsers = groupUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [filteredUsers]);

    const toggleUser = (id: string) => {
        setSelectedUserIds((prev) => {
            const updated = prev.includes(id)
                ? prev.filter((u) => u !== id)
                : [...prev, id];
            console.log("Updated selectedIds:", updated);
            return updated;
        });
    };
    const getRoleIcon = (role: string) => {
        switch (role) {
            case "doctor":
                return <Crown className="h-4 w-4" />;
            case "admin":
                return <Shield className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const handleSubmit = (data: ConversationFormData) => {
        console.log(" Đã bấm vào submit");
        try {
            const conversationData: REQUEST.TCreateConversation = {
                name: data.name,
                members: selectedUserIds,
            };
            onSubmit(conversationData);
            setTimeout(() => {
                router.push("/hospital/group");
            }, 3000);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

            {/* Header */}
            <header>
                <Header />
            </header>

            {/* Main */}
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
                                placeholder="Tìm kiếm theo tên, email, khoa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                            <option value="all">Tất cả khoa</option>
                            {departmentStats.map((dept) => (
                                <option key={dept.name} value={dept.name}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Tạm nghỉ</option>
                            <option value="pending">Chờ xác thực</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Dialog>
                            <FormProvider {...form}>
                                <form
                                    onSubmit={form.handleSubmit(handleSubmit)}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            size="sm"
                                            className="px-6 py-5 bg-[#248FCA] hover:bg-[#2490cada] cursor-pointer"
                                        >
                                            <Plus
                                                width={20}
                                                height={20}
                                                color="white"
                                            />
                                            Thêm nhóm chat
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[800px] h-[700px] flex flex-col">
                                        <DialogHeader className="flex-shrink-0">
                                            <DialogTitle className="text-[1.5rem] text-[#248FCA]">
                                                Tạo nhóm chat
                                            </DialogTitle>
                                            <DialogDescription>
                                                Điền đầy đủ nội dung để tạo nhóm
                                                chat mới
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="flex flex-col gap-4 flex-1 min-h-0">
                                            {/* Search bar - cố định không scroll */}
                                            <div className="flex gap-5 flex-shrink-0 item-center">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Nhập tên nhóm"
                                                                    className="h-10 w-70 text-base border-2 focus:border-[#248fca] transition-colors"
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="flex items-center gap-1">
                                                                <AlertCircle className="h-4 w-4" />
                                                            </FormMessage>
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="relative flex-1">
                                                    <SearchIcon className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <Input
                                                        placeholder="Tìm kiếm theo tên, email, khoa..."
                                                        value={searchTerm}
                                                        onChange={(e) =>
                                                            setSearchTerm(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 h-10"
                                                    />
                                                </div>

                                                <Button
                                                    type="button" // Thay type="submit" thành type="button"
                                                    className="bg-[#248fca] hover:bg-[#2490cacb] cursor-pointer h-10"
                                                    onClick={() =>
                                                        form.handleSubmit(
                                                            handleSubmit
                                                        )()
                                                    }
                                                >
                                                    Thêm nhóm chat
                                                </Button>
                                            </div>

                                            {/* Label */}
                                            <div className=" flex gap-2">
                                                <SquareMousePointer
                                                    width={20}
                                                    color="#248FCA"
                                                />
                                                <span className="font-semibold text-[#248FCA]">
                                                    Chọn thành viên
                                                </span>
                                            </div>
                                            {/* Danh sách đã chọn */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {selectedUserIds
                                                    .slice(0, 3)
                                                    .map((id) => {
                                                        const user =
                                                            groupUsers.find(
                                                                (u) =>
                                                                    u.id === id
                                                            );
                                                        if (!user) return null;
                                                        return (
                                                            <div
                                                                key={id}
                                                                className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                                                            >
                                                                <Avatar className="h-5 w-5 mr-1">
                                                                    <AvatarImage
                                                                        src={
                                                                            user.avatar
                                                                        }
                                                                    />
                                                                    <AvatarFallback>
                                                                        {
                                                                            user.initials
                                                                        }
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                {user.name}
                                                                <X
                                                                    className="ml-1 w-4 h-4 cursor-pointer"
                                                                    onClick={() =>
                                                                        toggleUser(
                                                                            id
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                {selectedUserIds.length > 3 && (
                                                    <span className="text-sm text-gray-500">
                                                        +
                                                        {selectedUserIds.length -
                                                            3}{" "}
                                                        thành viên khác
                                                    </span>
                                                )}
                                            </div>

                                            {/* Scrollable content area */}
                                            {filteredUsers.length === 0 ? (
                                                <div className="flex-1 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="text-gray-400 mb-4">
                                                            <User className="h-12 w-12 mx-auto" />
                                                        </div>
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                            Không tìm thấy thành
                                                            viên
                                                        </h3>
                                                        <p className="text-gray-500">
                                                            Thử điều chỉnh bộ
                                                            lọc hoặc tìm kiếm
                                                            với từ khóa khác
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1 overflow-y-auto border rounded-md">
                                                    <Table>
                                                        <TableHeader className="sticky top-0 bg-white z-10">
                                                            <TableRow className="h-12">
                                                                <TableHead>
                                                                    Thành viên
                                                                </TableHead>
                                                                <TableHead>
                                                                    Vai trò
                                                                </TableHead>
                                                                <TableHead>
                                                                    Trạng thái
                                                                </TableHead>
                                                                <TableHead>
                                                                    Email
                                                                </TableHead>
                                                                <TableHead>
                                                                    Ngày tham
                                                                    gia
                                                                </TableHead>
                                                                <TableHead>
                                                                    Tin nhắn
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {filteredUsers.map(
                                                                (user) => (
                                                                    <TableRow
                                                                        key={
                                                                            user.id
                                                                        }
                                                                        className="h-16 hover:bg-gray-50 cursor-pointer"
                                                                        onClick={() =>
                                                                            toggleUser(
                                                                                user.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <TableCell className="py-2">
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="relative">
                                                                                    <Avatar className="h-10 w-10">
                                                                                        <AvatarImage
                                                                                            src={
                                                                                                user.avatar
                                                                                            }
                                                                                        />
                                                                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                                                                                            {
                                                                                                user.initials
                                                                                            }
                                                                                        </AvatarFallback>
                                                                                    </Avatar>
                                                                                    <div
                                                                                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                                                                            user.status ===
                                                                                            "online"
                                                                                                ? "bg-green-500"
                                                                                                : user.status ===
                                                                                                  "away"
                                                                                                ? "bg-yellow-500"
                                                                                                : "bg-gray-400"
                                                                                        }`}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="font-medium text-gray-900">
                                                                                        {
                                                                                            user.name
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-500">
                                                                                        ID:{" "}
                                                                                        {
                                                                                            user.id
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-2">
                                                                            <div className="flex items-center gap-2">
                                                                                {getRoleIcon(
                                                                                    user.role
                                                                                )}
                                                                                {
                                                                                    user.role
                                                                                }
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-2">
                                                                            {
                                                                                user.status
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell className="py-2">
                                                                            <div
                                                                                className="max-w-48 truncate"
                                                                                title={
                                                                                    user.email
                                                                                }
                                                                            >
                                                                                {
                                                                                    user.email
                                                                                }
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-2">
                                                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                                <Clock className="h-3 w-3" />
                                                                                {formatDate(
                                                                                    user.joinDate
                                                                                )}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-2">
                                                                            <span className="font-semibold text-blue-600">
                                                                                {
                                                                                    user.messagesCount
                                                                                }
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedUserIds.includes(
                                                                                    user.id
                                                                                )}
                                                                                readOnly
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </form>
                            </FormProvider>
                        </Dialog>
                    </div>
                </div>
            </motion.div>

            {/* Staff Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map((staff, index) => (
                    <motion.div
                        key={staff.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                    >
                        <Link
                            href={`/hospital/group/group-detail/${staff.id}`}
                            key={staff.id}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-12 h-12">
                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold">
                                            {staff.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-[1.5rem]">
                                            {staff.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 my-10">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <ClipboardType className="w-4 h-4" />
                                        <span>Loại nhóm chat:</span>
                                    </div>
                                    <span className="text-sm text-gray-600 border px-4 py-1 rounded-full">
                                        {staff.conversationType}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Info className="w-4 h-4" />
                                        <span>Trang thái:</span>
                                    </div>
                                    <span
                                        className={`text-sm text-gray-600 ${
                                            staff.status === "Đã dừng hoạt động"
                                                ? "bg-red-100"
                                                : "bg-green-100"
                                        } px-4 py-1 flex items-center rounded-full`}
                                    >
                                        {staff.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CalendarClock className="w-4 h-4" />
                                        <span>Ngày tạo: </span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {staff.createDate}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <UserRound className="w-4 h-4" />
                                        <span>Số lượng thành viên: </span>
                                    </div>
                                    <span className="text-[1rem] font-bold text-[#248FCA]">
                                        {staff.patientsCount}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredStaff.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                >
                    <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Không tìm thấy nhân viên
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                    <Button className="gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Thêm nhân viên mới
                    </Button>
                </motion.div>
            )}
        </div>
    );
}

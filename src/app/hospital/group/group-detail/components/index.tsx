"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Crown,
    Shield,
    Clock,
    BarChartIcon,
    BellIcon,
    SearchIcon,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import GroupUserDialog from "@/app/hospital/group/group-detail/components/user-dialog";
import GroupDoctorDialog from "@/app/hospital/group/group-detail/components/doctor-dialog";

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

// Mock data - in real app, this would come from API based on group ID
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

export default function GroupDetailComponent({ groupId }: any) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);

    const filteredUsers = groupUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus =
            statusFilter === "all" || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

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
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [filteredUsers]);

    const toggleUser = (id: string) => {
        setSelectedIds((prev) => {
            const updated = prev.includes(id)
                ? prev.filter((u) => u !== id)
                : [...prev, id];
            console.log("Updated selectedIds:", updated);
            return updated;
        });
    };

    const handleSubmit = () => {
        console.log("Danh sách ID được chọn:", selectedIds);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    return (
        <div>
            {/* Header */}
            <header>
                <Header />
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
                                        placeholder="Tìm kiếm theo tên, email, khoa..."
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
                                    <option value="all">Tất cả khoa</option>
                                    {departmentStats.map((dept) => (
                                        <option
                                            key={dept.name}
                                            value={dept.name}
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
                                <GroupUserDialog handleSubmit={handleSubmit} />
                                <GroupDoctorDialog
                                    handleSubmit={handleSubmit}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thành viên</TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Ngày tham gia</TableHead>
                                    <TableHead>Tin nhắn</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage
                                                            src={user.avatar}
                                                        />
                                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                                                            {user.initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {/* Status indicator */}
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
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(user.role)}
                                                {user.role}
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.status}</TableCell>
                                        <TableCell>
                                            <div
                                                className="max-w-48 truncate"
                                                title={user.email}
                                            >
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(user.joinDate)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-blue-600">
                                                {user.messagesCount}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredUsers.length === 0 && (
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

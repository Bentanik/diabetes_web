"use client";

import { useState } from "react";
import { SearchIcon, Plus, X, User, Clock, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
interface GroupUserDialogProps {
    handleSubmit: () => void;
}

export default function GroupDoctorDialog({
    handleSubmit,
}: GroupUserDialogProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = groupUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

    const toggleUser = (id: string) => {
        setSelectedIds((prev) => {
            const updated = prev.includes(id)
                ? prev.filter((u) => u !== id)
                : [...prev, id];
            console.log("Updated selectedIds:", updated);
            return updated;
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="px-6 py-5 bg-[#248FCA] hover:bg-[#2490cada] cursor-pointer"
                >
                    <Plus width={20} height={20} color="white" />
                    Thêm bác sĩ
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[700px] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-[1.5rem] text-[#248FCA]">
                        Thêm bác sĩ vào nhóm
                    </DialogTitle>
                    <DialogDescription>
                        Hãy tìm kiếm bác sĩ để thêm vào nhóm chat
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 flex-1 min-h-0">
                    {/* Search bar - cố định không scroll */}
                    <div className="flex gap-5 flex-shrink-0">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm theo tên, email, khoa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-[#248fca] hover:bg-[#2490cacb] cursor-pointer"
                            disabled={!selectedIds}
                            onClick={handleSubmit}
                        >
                            Thêm vào nhóm
                        </Button>
                    </div>
                    {/* Danh sách đã chọn */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {selectedIds.slice(0, 3).map((id) => {
                            const user = groupUsers.find((u) => u.id === id);
                            if (!user) return null;
                            return (
                                <div
                                    key={id}
                                    className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                                >
                                    <Avatar className="h-5 w-5 mr-1">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>
                                            {user.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    {user.name}
                                    <X
                                        className="ml-1 w-4 h-4 cursor-pointer"
                                        onClick={() => toggleUser(id)}
                                    />
                                </div>
                            );
                        })}
                        {selectedIds.length > 3 && (
                            <span className="text-sm text-gray-500">
                                +{selectedIds.length - 3} thành viên khác
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
                                    Không tìm thấy thành viên
                                </h3>
                                <p className="text-gray-500">
                                    Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ
                                    khóa khác
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto border rounded-md">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10">
                                    <TableRow className="h-12">
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
                                            className="h-16 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => toggleUser(user.id)}
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
                                                                {user.initials}
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
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {user.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <div className="flex items-center gap-2">
                                                    {getRoleIcon(user.role)}
                                                    {user.role}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2">
                                                {user.status}
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <div
                                                    className="max-w-48 truncate"
                                                    title={user.email}
                                                >
                                                    {user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(user.joinDate)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <span className="font-semibold text-blue-600">
                                                    {user.messagesCount}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        user.id
                                                    )}
                                                    readOnly
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

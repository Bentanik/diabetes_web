"use client";

import { useEffect, useState, useCallback } from "react";
import { SearchIcon, Plus, X, User, Crown } from "lucide-react";
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
import InfiniteScroll from "@/components/scroll-paginated";
import useAddStaff from "@/app/hospitals/conversation/conversation-detail/hooks/use-add-staff";
import {
    useGetUserAvailable,
    USER_AVAILABLE_QUERY_KEY,
} from "@/app/hospitals/conversation/conversation-detail/hooks/use-get-user-available";
import { useQueryClient } from "@tanstack/react-query";

type PropDialog = {
    conversationId: string;
};

export default function GroupUserDialog({ conversationId }: PropDialog) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectSortType, setSelectSortType] = useState<string>("");
    const [isSortDesc, setIsSortDesc] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isOpenDialog, setIsDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { onSubmit } = useAddStaff({ conversationId });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedId, setSelectedId] = useState<string>("");
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [isSearchOrSortChanged, setIsSearchOrSortChanged] = useState(false);

    const pageSize = 10;

    const queryClient = useQueryClient();

    const params: REQUEST.UserAvailableRequestParam = {
        search: searchTerm,
        role: "HospitalStaff",
        pageIndex: currentPage,
        pageSize: pageSize,
    };

    // Sử dụng hook useGetUserAvailable
    const { user_available, isPending } = useGetUserAvailable(
        { conversationId },
        params
    );

    // Dữ liệu người dùng từ API
    const data = user_available?.items || [];
    const hasMore = user_available?.hasNextPage || false;

    // Tích lũy dữ liệu khi user_available.items thay đổi
    useEffect(() => {
        if (data.length > 0) {
            setAllUsers((prevUsers) => {
                if (currentPage === 1 || isSearchOrSortChanged) {
                    setIsSearchOrSortChanged(false); // Reset flag
                    return data;
                }
                // Kiểm tra xem có dữ liệu trùng lặp không
                const existingIds = new Set(prevUsers.map((user) => user.id));
                const newUsers = data.filter(
                    (newUser) => !existingIds.has(newUser.id)
                );

                if (newUsers.length > 0) {
                    return [...prevUsers, ...newUsers];
                }

                return prevUsers;
            });
        }
    }, [data, currentPage, isSearchOrSortChanged]);

    const handleLoadMore = useCallback(() => {
        if (isPending || !hasMore || isLoading) {
            return;
        }
        setIsLoading(true);
        setCurrentPage((prevPage) => prevPage + 1);
    }, [isPending, hasMore, isLoading]);

    // Tách riêng useEffect để handle loading state
    useEffect(() => {
        if (!isPending && isLoading) {
            setIsLoading(false);
        }
    }, [isPending, isLoading]);

    const handleSearchOrSortChange = useCallback(() => {
        setIsSearchOrSortChanged(true);
        setCurrentPage(1);
        setAllUsers([]); // Reset danh sách khi tìm kiếm hoặc sắp xếp thay đổi

        queryClient.invalidateQueries({
            queryKey: [USER_AVAILABLE_QUERY_KEY],
        });
    }, [queryClient]);

    const handleFormSubmit = async () => {
        console.log("Bấm thành công");
        if (!onSubmit || typeof onSubmit !== "function") {
            console.error("onSubmit is not a function");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData: REQUEST.AddStaff = {
                adminId: selectedId,
            };
            await onSubmit(formData);
            setIsDialogOpen(false);
            setSelectedId("");
            setAllUsers([]);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Có lỗi xảy ra khi cập nhật bài viết.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectUser = (id: string) => {
        setSelectedId((prev) => (prev === id ? "" : id));
    };
    // Debounce search để tránh gọi API quá nhiều
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isOpenDialog) {
                handleSearchOrSortChange();
            }
        }, 300); // Delay 300ms

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectSortType, isSortDesc, isOpenDialog]);

    // Reset khi mở dialog
    useEffect(() => {
        if (isOpenDialog) {
            setCurrentPage(1);
            setSelectedId("");
            setSearchTerm("");
            setAllUsers([]);
            setIsSearchOrSortChanged(false);
        }
    }, [isOpenDialog]);

    return (
        <Dialog open={isOpenDialog} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="px-6 py-5 bg-[#248FCA] hover:bg-[#2490cada] cursor-pointer min-w-[180px]"
                >
                    <Plus width={20} height={20} color="white" />
                    Thêm quản trị viên
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[700px] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-[1.5rem] text-[#248FCA]">
                        Thêm quản trị viên vào nhóm
                    </DialogTitle>
                    <DialogDescription>
                        Hãy tìm kiếm quản trị viên để thêm vào nhóm chat
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 flex-1 min-h-0">
                    <div className="flex gap-5 flex-shrink-0">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm theo tên, số điện thoại..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-[#248fca] hover:bg-[#2490cacb] cursor-pointer"
                            disabled={!selectedId || isSubmitting}
                            onClick={() => handleFormSubmit()}
                        >
                            {isSubmitting ? "Đang thêm..." : "Thêm vào nhóm"}
                        </Button>
                    </div>

                    {selectedId && (
                        <div className="flex items-center gap-2">
                            {(() => {
                                const user = allUsers.find(
                                    (u) => u.id === selectedId
                                );
                                if (!user) return null;
                                return (
                                    <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                                        <Avatar className="h-5 w-5 mr-1">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>
                                                {user.fullName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {user.fullName}
                                        <X
                                            className="ml-1 w-4 h-4 cursor-pointer"
                                            onClick={() => setSelectedId("")}
                                        />
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {allUsers.length === 0 && !isPending && !isLoading ? (
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
                            <InfiniteScroll
                                hasMore={hasMore}
                                isLoading={isPending || isLoading}
                                onLoadMore={handleLoadMore}
                                loadingText="Đang tải thêm quản trị viên..."
                                endText="Đã tải hết tất cả quản trị viên"
                                threshold={200}
                            >
                                <Table>
                                    <TableHeader className="sticky top-0 bg-white z-10">
                                        <TableRow className="h-12">
                                            <TableHead>Thành viên</TableHead>
                                            <TableHead>Số điện thoại</TableHead>
                                            <TableHead>Vai trò</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Chọn</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allUsers.map((user) => (
                                            <TableRow
                                                key={user.id}
                                                className={`h-16 ${
                                                    user.status === 1
                                                        ? "cursor-not-allowed opacity-50"
                                                        : "hover:bg-gray-50 cursor-pointer"
                                                }`}
                                                onClick={() => {
                                                    if (user.status == 0) {
                                                        selectUser(user.id);
                                                    }
                                                }}
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
                                                                    {user.fullName.charAt(
                                                                        0
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div
                                                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                                                    user.status ===
                                                                    1
                                                                        ? "bg-green-500"
                                                                        : "bg-gray-400"
                                                                }`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {user.fullName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <div className="flex items-center gap-2">
                                                        {user.phoneNumber}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <div className="flex items-center gap-2">
                                                        <Crown className="h-4 w-4" />
                                                        <span>
                                                            Quản trị viên
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs ${
                                                            user.status === 1
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {user.status === 0
                                                            ? "Chưa vào nhóm"
                                                            : "Đã vào nhóm"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <input
                                                        type="radio"
                                                        checked={
                                                            selectedId ===
                                                            user.id
                                                        }
                                                        disabled
                                                        className="h-4 w-4 text-blue-600 border-gray300 rounded focus:ring-blue-500"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </InfiniteScroll>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

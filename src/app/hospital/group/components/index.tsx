/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react-hooks/exhaustive-deps

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
    ImageIcon,
    Upload,
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import useGetConversations from "../hooks/use-get-conversations";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import Image from "next/image";
import PaginatedComponent from "@/components/paginated";
import useUploadConversationImage from "@/app/hospital/group/hooks/use-upload-conversation";

const sortBy = [
    { name: "Tên nhóm", value: "name" },
    { name: "Ngày tạo", date: "date" },
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
    const { isPending: isUploading, onSubmit: onSubmitImage } =
        useUploadConversationImage();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { onSubmit, form, isPending } = useCreateConversation();
    const { getConversationsApi } = useGetConversations();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [data, setData] = useState<API.Conversation[]>([]);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [selectSortBy, setSelectSortBy] = useState<string>("all");
    const [isSortAsc, setIsSortAsc] = useState(0);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null
    );
    const [thumbnailId, setThumbnailId] = useState<string | null>(null);

    const router = useRouter();

    const handleGetData = async (pageIndex: number) => {
        try {
            const res = await getConversationsApi({
                search: searchTerm,
                pageIndex: pageIndex,
                pageSize: 6,
                sortBy: selectSortBy,
                direction: isSortAsc,
            });
            setTotalPage(res?.data?.totalPages || 1);
            setData(res?.data?.items || []);
        } catch (err) {
            console.log(err);
            setData([]);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        handleGetData(page);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset về page 1 khi search
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            // Convert image to base64 for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload image
            const data = { files: file };
            onSubmitImage(data, handleClearImages, (imageId) => {
                form.setValue("avatarId", imageId);
                console.log("check ảnh" + imageId);
                setThumbnailId(imageId);
            });
        }
    };

    const handleClearImages = () => {
        // setThumbnailPreview(null);
        // setThumbnailId(null);
        // form.setValue("avatarId", "");
    };

    // Gọi API khi các giá trị liên quan thay đổi
    useEffect(() => {
        handleGetData(currentPage);
    }, [debouncedSearchTerm, selectSortBy, isSortAsc, currentPage]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const handleSubmit = (data: ConversationFormData) => {
        try {
            const conversationData: REQUEST.TCreateConversation = {
                name: data.name,
                avatarId: data.avatarId,
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
                                placeholder="Tìm kiếm theo tên nhóm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={selectSortBy}
                            onChange={(e) => setSelectSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="name">Mặc định</option>
                            {sortBy.map((sort) => (
                                <option key={sort.name} value={sort.value}>
                                    {sort.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Dialog>
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
                                        Điền đầy đủ nội dung để tạo nhóm chat
                                        mới
                                    </DialogDescription>
                                </DialogHeader>

                                {/* Di chuyển FormProvider và form vào đây */}
                                <FormProvider {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(
                                            handleSubmit
                                        )}
                                        className="flex flex-col flex-1"
                                    >
                                        <div className="flex-1 space-y-6">
                                            {/* Image upload section */}
                                            <div>
                                                <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                    <ImageIcon className="h-5 w-5 text-[#248fca]" />
                                                    Chọn ảnh đại diện
                                                </Label>
                                                <div className="flex items-center gap-6 mt-2">
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={
                                                                handleImageChange
                                                            }
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            id="logo-upload"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="flex items-center gap-2 h-12 px-6 border-2 border-[#248fca] text-[#248fca] hover:bg-[#248fca] hover:text-white transition-all duration-300"
                                                            asChild
                                                        >
                                                            <label
                                                                htmlFor="logo-upload"
                                                                className="cursor-pointer"
                                                            >
                                                                <Upload className="h-5 w-5" />
                                                                Chọn ảnh
                                                            </label>
                                                        </Button>
                                                    </div>
                                                    {thumbnailPreview && (
                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            className="w-20 h-20 rounded-xl border-4 border-[#248fca]/20 overflow-hidden shadow-lg"
                                                        >
                                                            <Image
                                                                src={
                                                                    thumbnailPreview ||
                                                                    "/placeholder.svg"
                                                                }
                                                                width={20}
                                                                height={20}
                                                                alt="Logo preview"
                                                                className="w-full h-full"
                                                            />
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Chấp nhận file JPG, PNG.
                                                    Kích thước tối đa 5MB.
                                                </p>
                                            </div>

                                            {/* Name field */}
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                                            Tên nhóm
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Nhập tên nhóm"
                                                                className="h-12 text-base border-2 focus:border-[#248fca] transition-colors"
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
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                disabled={isPending}
                                                className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl"
                                            >
                                                {isPending
                                                    ? "Đang tạo..."
                                                    : "Tạo nhóm mới"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </FormProvider>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </motion.div>

            {/* Staff Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((conversation, index) => (
                    <motion.div
                        key={conversation.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                    >
                        <Link
                            href={`/hospital/group/group-detail/${conversation.id}`}
                            key={conversation.id}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={conversation.avatar}
                                        alt="avatar"
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover w-12 h-12"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-[1.5rem]">
                                            {conversation.name}
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
                                        {conversation.conversationType === 0
                                            ? "Nhóm"
                                            : "Cá nhân"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CalendarClock className="w-4 h-4" />
                                        <span>Ngày tạo: </span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {formatDate(conversation.modifiedDate)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <UserRound className="w-4 h-4" />
                                        <span>Số lượng thành viên: </span>
                                    </div>
                                    <span className="text-[1rem] font-bold text-[#248FCA]">
                                        {conversation.memberCount}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
            {data?.length > 0 && (
                <div className="my-10">
                    <div className="mt-5">
                        <PaginatedComponent
                            totalPages={totalPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}

            {/* Empty State */}
            {data.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                >
                    <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Không tìm thấy nhóm chat
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                </motion.div>
            )}
        </div>
    );
}

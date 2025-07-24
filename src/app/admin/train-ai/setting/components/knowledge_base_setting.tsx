/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
    PlusIcon,
    SettingsIcon,
    Trash2Icon,
    SearchIcon,
    FileTextIcon,
    HardDriveIcon,
    CheckCircleIcon,
    CircleIcon,
    CalendarIcon,
    BookOpenIcon,
    FileIcon,
    SaveIcon,
    FlaskConicalIcon,
    TrendingUpIcon,
    XIcon,
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import Pagination from "@/components/shared/pagination";
import { useGetKnowledgesService } from "@/services/train-ai/services";
import { useDebounce } from "@/hooks/use-debounce";
import useUpdateSetting from "@/app/admin/train-ai/setting/hook/useUpdateSetting";
import CreateKnowlegeModal from "@/app/admin/train-ai/components/create_knowlege";

interface KnowledgeBaseItemProps {
    knowledgeBase: API.TKnowledge;
    isSelected: boolean;
    onToggle: (id: string) => void;
    onSettings?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const KnowledgeBaseItem = ({
    knowledgeBase,
    isSelected,
    onToggle,
    onSettings,
    onDelete,
}: KnowledgeBaseItemProps) => {
    const formatSize = useCallback((sizeInMB: number) => {
        if (sizeInMB >= 1024) {
            return `${(sizeInMB / 1024).toFixed(2)} GB`;
        }
        return `${sizeInMB.toFixed(2)} MB`;
    }, []);

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    }, []);

    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id={knowledgeBase.id}
                    checked={isSelected}
                    onChange={() => onToggle(knowledgeBase.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                    <label
                        htmlFor={knowledgeBase.id}
                        className="font-medium text-gray-900 cursor-pointer"
                    >
                        {knowledgeBase.name}
                    </label>
                    {knowledgeBase.description && (
                        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                            {knowledgeBase.description}
                        </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                            <FileTextIcon className="w-3 h-3" />
                            {knowledgeBase.document_count.toLocaleString()} tài
                            liệu
                        </span>
                        <span className="flex items-center gap-1">
                            <HardDriveIcon className="w-3 h-3" />
                            {formatSize(knowledgeBase.total_size_bytes)}
                        </span>
                        <span
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                knowledgeBase.select_training === true
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {knowledgeBase.select_training === true ? (
                                <>
                                    <CheckCircleIcon className="w-3 h-3" />
                                    Hoạt động
                                </>
                            ) : (
                                <>
                                    <CircleIcon className="w-3 h-3" />
                                    Không hoạt động
                                </>
                            )}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                            <CalendarIcon className="w-3 h-3" />
                            Cập nhật: {formatDate(knowledgeBase.updated_at)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
                {onSettings && (
                    <button
                        onClick={() => onSettings(knowledgeBase.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Cài đặt"
                        type="button"
                    >
                        <SettingsIcon className="w-4 h-4" />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(knowledgeBase.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Xóa"
                        type="button"
                    >
                        <Trash2Icon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default function KnowledgeBaseSetting() {
    const [isOpenCreateKnowlegeModal, setIsOpenCreateKnowlegeModal] =
        useState(false);

    const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<
        string[]
    >([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 5;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { handleUpdateChatSetting } = useUpdateSetting();

    // API call with optimized parameters
    const {
        knowledge_bases: data,
        isPending,
        error,
    } = useGetKnowledgesService({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearchTerm,
        sort_by: "updated_at",
        sort_order: "desc",
    });

    // Extract data from API response
    const knowledgeBases = data?.items || [];
    const totalItems = data?.total || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const handleOpenCreateKnowlegeModal = useCallback(() => {
        setIsOpenCreateKnowlegeModal(true);
    }, []);

    const handleCloseCreateKnowlegeModal = useCallback(() => {
        setIsOpenCreateKnowlegeModal(false);
    }, []);

    // Sync selectedKnowledgeBases với select_training từ backend
    useEffect(() => {
        if (knowledgeBases.length > 0) {
            const preSelectedIds = knowledgeBases
                .filter((kb: any) => kb.select_training)
                .map((kb: any) => kb.id);

            // Chỉ update nếu có sự khác biệt để tránh re-render không cần thiết
            setSelectedKnowledgeBases((prev) => {
                const prevSet = new Set(prev);
                const newSet = new Set(preSelectedIds);

                // So sánh 2 sets
                if (prevSet.size !== newSet.size) return preSelectedIds;
                for (const id of preSelectedIds) {
                    if (!prevSet.has(id)) return preSelectedIds;
                }
                return prev;
            });
        }
    }, [knowledgeBases]);

    // Reset to first page when search changes
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleKnowledgeBaseToggle = useCallback((knowledgeBaseId: string) => {
        setSelectedKnowledgeBases((prev) =>
            prev.includes(knowledgeBaseId)
                ? prev.filter((id) => id !== knowledgeBaseId)
                : [...prev, knowledgeBaseId]
        );
    }, []);

    const handleSettings = useCallback((id: string) => {
        console.log("Settings for:", id);
        // Implement settings logic
    }, []);

    const handleDelete = useCallback((id: string) => {
        console.log("Delete:", id);
        // Implement delete logic
    }, []);

    const handleAddKnowledgeBase = useCallback(() => {
        handleOpenCreateKnowlegeModal();
    }, []);

    // Hàm lưu cài đặt - gửi selectedKnowledgeBases về backend
    const handleSaveSettings = useCallback(async () => {
        try {
            const request: REQUEST.TUpdateChatSettingRequest = {
                config: {
                    enabled_kb_ids: selectedKnowledgeBases,
                },
            };

            handleUpdateChatSetting(request);
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    }, [selectedKnowledgeBases]);

    // Calculate pagination props
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

    // Get selected knowledge bases info
    const selectedKnowledgeBasesInfo = useMemo(() => {
        return selectedKnowledgeBases
            .map((id) => knowledgeBases.find((kb: any) => kb.id === id))
            .filter(Boolean);
    }, [selectedKnowledgeBases, knowledgeBases]);

    // Loading state
    if (isPending && currentPage === 1 && !searchTerm) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 mb-2">
                        Có lỗi xảy ra khi tải dữ liệu
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                    >
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <BookOpenIcon className="w-5 h-5" />
                            Chọn Nội dung
                        </h3>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={handleAddKnowledgeBase}
                        >
                            <PlusIcon className="w-4 h-4" />
                            Thêm Nội dung
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm nội dung..."
                                value={searchTerm}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Results info */}
                    <div className="mb-3 text-sm text-gray-600">
                        {isPending ? (
                            <span>Đang tìm kiếm...</span>
                        ) : (
                            <>
                                Tìm thấy {totalItems} kết quả
                                {debouncedSearchTerm &&
                                    ` cho "${debouncedSearchTerm}"`}
                            </>
                        )}
                    </div>

                    {/* Knowledge Base List */}
                    <div className="space-y-3 min-h-[300px]">
                        {isPending ? (
                            // Loading skeleton
                            Array.from({ length: ITEMS_PER_PAGE }).map(
                                (_, index) => (
                                    <div key={index} className="animate-pulse">
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                                                    <div className="flex gap-4">
                                                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        ) : knowledgeBases.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <BookOpenIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                {debouncedSearchTerm ? (
                                    <>
                                        <p className="text-lg mb-2">
                                            Không tìm thấy nội dung nào
                                        </p>
                                        <p className="text-sm">
                                            Thử tìm kiếm với từ khóa khác
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg mb-2">
                                            Chưa có nội dung nào
                                        </p>
                                        <p className="text-sm">
                                            Hãy thêm nội dung đầu tiên của bạn
                                        </p>
                                    </>
                                )}
                            </div>
                        ) : (
                            knowledgeBases.map((knowledgeBase) => (
                                <KnowledgeBaseItem
                                    key={knowledgeBase.id}
                                    knowledgeBase={knowledgeBase}
                                    isSelected={selectedKnowledgeBases.includes(
                                        knowledgeBase.id
                                    )}
                                    onToggle={handleKnowledgeBaseToggle}
                                    onSettings={handleSettings}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {!isPending && totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            perPage={ITEMS_PER_PAGE}
                            hasNext={hasNext}
                            hasPrev={hasPrev}
                            onPageChange={handlePageChange}
                            isLoading={isPending}
                        />
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Selected Knowledge Bases */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <FileIcon className="w-5 h-5" />
                        Nội dung đã chọn ({selectedKnowledgeBases.length})
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {selectedKnowledgeBasesInfo.length === 0 ? (
                            <div className="text-center py-4">
                                <FileIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-gray-500 text-sm">
                                    Chưa chọn nội dung nào
                                </p>
                            </div>
                        ) : (
                            selectedKnowledgeBasesInfo.map((knowledgeBase) => (
                                <div
                                    key={knowledgeBase?.id}
                                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                                >
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-medium text-blue-900 block truncate">
                                            {knowledgeBase?.name}
                                        </span>
                                        <div className="text-xs text-blue-600 flex items-center gap-1">
                                            <FileTextIcon className="w-3 h-3" />
                                            {knowledgeBase?.document_count.toLocaleString()}{" "}
                                            tài liệu
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleKnowledgeBaseToggle(
                                                knowledgeBase?.id || ""
                                            )
                                        }
                                        className="text-blue-400 hover:text-blue-600 ml-2 p-1"
                                        title="Bỏ chọn"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5" />
                        Thao tác nhanh
                    </h3>
                    <div className="space-y-3">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                            onClick={handleSaveSettings}
                        >
                            <SaveIcon className="w-4 h-4" />
                            Lưu cài đặt
                        </Button>
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 gap-2"
                            disabled={selectedKnowledgeBases.length === 0}
                        >
                            <FlaskConicalIcon className="w-4 h-4" />
                            Kiểm tra Tìm kiếm
                        </Button>
                        <Button variant="outline" className="w-full gap-2">
                            <TrendingUpIcon className="w-4 h-4" />
                            Xem Hiệu suất
                        </Button>
                    </div>
                </div>
            </div>
            <CreateKnowlegeModal
                isOpen={isOpenCreateKnowlegeModal}
                onClose={handleCloseCreateKnowlegeModal}
            />
        </div>
    );
}

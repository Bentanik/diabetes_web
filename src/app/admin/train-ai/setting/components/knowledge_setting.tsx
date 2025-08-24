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
    CircleIcon,
    CalendarIcon,
    BookOpenIcon,
    FileIcon,
    SaveIcon,
    XIcon,
    CheckCircleIcon,
    MessageCircleIcon,
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import Pagination from "@/components/shared/pagination";
import { useGetKnowledgesService } from "@/services/train-ai/services";
import { useDebounce } from "@/hooks/use-debounce";
import useUpdateSetting from "@/app/admin/train-ai/setting/hook/useUpdateSetting";
import CreateKnowlegeModal from "@/app/admin/train-ai/components/create_knowlege";
import { formatFileSize } from "@/utils/file";
import DeleteKnowledgeModal from "@/app/admin/train-ai/components/delete_knowlege";

interface KnowledgeItemProps {
    knowledgeBase: API.TKnowledge;
    isSelected: boolean;
    onToggle: (id: string) => void;
    onDelete?: (folder: API.TKnowledge) => void;
}

const KnowledgeItem = ({
    knowledgeBase,
    isSelected,
    onToggle,
    onDelete,
}: KnowledgeItemProps) => {
    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    }, []);

    return (
        <div
            className="flex items-center justify-between p-5 rounded-xl bg-white shadow shadow-gray-200 border border-gray-100 hover:shadow-md hover:shadow-gray-300 transition-all group"
        >
            <div className="flex items-center gap-5">
                <input
                    type="checkbox"
                    id={knowledgeBase.id}
                    checked={isSelected}
                    onChange={() => onToggle(knowledgeBase.id)}
                    className="h-5 w-5 accent-[#248fca] rounded-md border-gray-300 focus:ring-0 focus:ring-[#248fca]/30 transition"
                />
                <div>
                    <label
                        htmlFor={knowledgeBase.id}
                        className="font-semibold text-gray-900 text-base cursor-pointer group-hover:text-[#248fca] transition"
                    >
                        {knowledgeBase.name}
                    </label>
                    {knowledgeBase.description && (
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                            {knowledgeBase.description}
                        </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                            <FileTextIcon className="w-3 h-3" />
                            {knowledgeBase.stats.document_count.toLocaleString()} tài liệu
                        </span>
                        <span className="flex items-center gap-1">
                            <HardDriveIcon className="w-3 h-3" />
                            {formatFileSize(knowledgeBase.stats.total_size_bytes)}
                        </span>
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {formatDate(knowledgeBase.updated_at)}
                        </span>
                        <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-xs transition
                                ${knowledgeBase.select_training
                                    ? "bg-[#248fca]/10 text-[#248fca]"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                        >
                            {knowledgeBase.select_training ? (
                                <>
                                    <CheckCircleIcon className="w-3 h-3" />
                                    Đã kích hoạt
                                </>
                            ) : (
                                <>
                                    <CircleIcon className="w-3 h-3" />
                                    Không hoạt động
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </div>
            <div>
                {onDelete && (
                    <button
                        onClick={() => onDelete(knowledgeBase)}
                        className="p-2 rounded-full hover:bg-[#248fca]/10 text-gray-400 hover:text-[#248fca] transition"
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

export default function KnowledgeSetting() {
    const [isOpenCreateKnowlegeModal, setIsOpenCreateKnowlegeModal] =
        useState(false);

    const [isOpenDeleteKnowlegeModal, setIsOpenDeleteKnowlegeModal] =
        useState(false);

    const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<
        string[]
    >([]);

    const [folderDelete, setFolderDelete] = useState<API.TKnowledge | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 5;
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { handleUpdateChatSetting } = useUpdateSetting();

    // API call with optimized parameters
    const {
        knowledges: data,
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

    const handleOpenDeleteKnowlegeModal = useCallback(() => {
        setIsOpenDeleteKnowlegeModal(true);
    }, []);

    const handleCloseDeleteKnowlegeModal = useCallback(() => {
        setIsOpenDeleteKnowlegeModal(false);
    }, []);

    // Sync selectedKnowledgeBases với select_training từ backend
    useEffect(() => {
        if (knowledgeBases.length > 0) {
            const preSelectedIds = knowledgeBases
                .filter((kb: API.TKnowledge) => kb.select_training)
                .map((kb: API.TKnowledge) => kb.id);

            setSelectedKnowledgeBases((prev) => {
                const prevSet = new Set(prev);
                const newSet = new Set(preSelectedIds);

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

    const handleDelete = useCallback((folder: API.TKnowledge) => {
        setFolderDelete(folder);
        handleOpenDeleteKnowlegeModal();
    }, []);

    const handleAddKnowledgeBase = useCallback(() => {
        handleOpenCreateKnowlegeModal();
    }, []);

    // Hàm lưu cài đặt - gửi selectedKnowledgeBases về backend
    const handleSaveSettings = useCallback(async () => {
        try {
            const request: REQUEST.TUpdateSettingsRequest = {
                list_knowledge_ids: selectedKnowledgeBases,
            };

            handleUpdateChatSetting(request, () => {});
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
            .map((id) => knowledgeBases.find((kb: API.TKnowledge) => kb.id === id))
            .filter(Boolean);
    }, [selectedKnowledgeBases, knowledgeBases]);

    // Loading state
    if (isPending && currentPage === 1 && !searchTerm) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#248fca]"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-[#e53935] mb-2">
                        Có lỗi xảy ra khi tải dữ liệu
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="border-[#248fca] text-[#248fca] hover:bg-[#248fca]/10"
                    >
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Main Settings */}
            <div className="flex-1 flex flex-col min-h-[600px]">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 h-full shadow shadow-gray-200 flex flex-col">
                    <div className="flex items-center justify-between gap-x-4 mb-4">
                        <div className="w-full">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm nội dung..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 h-11 rounded-lg border border-gray-200 shadow-none focus:ring-0 placeholder:text-gray-400 transition input-auth"
                                />
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-[180px] h-11 gap-2 border-[#248fca]/20 text-[#248fca] hover:text-[#248fca] hover:border-[#248fca]/40 rounded-lg font-semibold bg-white hover:cursor-pointer"
                            onClick={handleAddKnowledgeBase}
                        >
                            <PlusIcon className="w-5 h-5" />
                            Thêm cơ sở tri thức
                        </Button>
                    </div>
                    {/* Results info */}
                    <div className="my-4 text-sm text-gray-500">
                        {isPending ? (
                            <span>Đang tìm kiếm...</span>
                        ) : (
                            <>
                                Tìm thấy <span className="text-[#248fca]">{totalItems}</span> kết quả
                                {debouncedSearchTerm &&
                                    <> cho <span className="text-[#248fca]">&quot;{debouncedSearchTerm}&quot;</span></>
                                }
                            </>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col">
                        {/* Knowledge Base List */}
                        <div className="space-y-4 min-h-[300px] flex-1">
                            {isPending ? (
                                // Loading skeleton
                                Array.from({ length: ITEMS_PER_PAGE }).map(
                                    (_, index) => (
                                        <div key={index} className="animate-pulse">
                                            <div className="flex items-center justify-between p-5 border border-gray-100 rounded-xl shadow shadow-gray-100 bg-gray-50">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
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
                                            <p className="text-lg mb-2 font-semibold">
                                                Không tìm thấy cơ sở tri thức
                                            </p>
                                            <p className="text-sm">
                                                Thử tìm kiếm với từ khóa khác
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-lg mb-2 font-semibold">
                                                Chưa có cơ sở tri thức nào
                                            </p>
                                            <p className="text-sm">
                                                Hãy thêm cơ sở tri thức đầu tiên của bạn
                                            </p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                knowledgeBases.map((knowledgeBase: API.TKnowledge) => (
                                    <KnowledgeItem
                                        key={knowledgeBase.id}
                                        knowledgeBase={knowledgeBase}
                                        isSelected={selectedKnowledgeBases.includes(
                                            knowledgeBase.id
                                        )}
                                        onToggle={handleKnowledgeBaseToggle}
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
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-[370px] flex flex-col min-h-[600px]">
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 shadow shadow-gray-200 mb-8 flex-1 flex flex-col">
                    <h3 className="text-lg font-[600] text-[#248fca] mb-6 flex items-center gap-2">
                        <FileIcon className="w-5 h-5 text-[#248fca]" />
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
                                    className="flex items-center justify-between p-3 bg-[#248fca]/10 rounded-lg"
                                >
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-semibold text-[#248fca] block truncate">
                                            {knowledgeBase?.name}
                                        </span>
                                        <div className="text-xs text-[#248fca] flex items-center gap-1">
                                            <FileTextIcon className="w-3 h-3" />
                                            {knowledgeBase?.stats.document_count.toLocaleString()}{" "}
                                            tài liệu
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleKnowledgeBaseToggle(
                                                knowledgeBase?.id || ""
                                            )
                                        }
                                        className="text-[#248fca] hover:text-[#197bb5] ml-2 p-1 rounded-full transition"
                                        title="Bỏ chọn"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 shadow shadow-gray-200 flex-1 flex flex-col">
                    <h3 className="text-lg font-[600] text-[#248fca] mb-6 flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5 text-[#248fca]" />
                        Thao tác nhanh
                    </h3>
                    <div className="space-y-3">
                        <Button
                            className="w-full bg-[#248fca] hover:bg-[#197bb5] text-white rounded-lg font-semibold py-2 gap-2 transition cursor-pointer"
                            onClick={handleSaveSettings}
                        >
                            <SaveIcon className="w-4 h-4" />
                            Lưu cài đặt
                        </Button>

                        <Button
                            className="w-full bg-[#248fca] hover:bg-[#197bb5] text-white rounded-lg font-semibold py-2 gap-2 transition cursor-pointer"
                            onClick={handleSaveSettings}
                        >
                            <SearchIcon className="w-4 h-4" />
                            Tìm kiếm tài liệu theo ngữ nghĩa
                        </Button>

                        <Button
                            className="w-full bg-[#248fca] hover:bg-[#197bb5] text-white rounded-lg font-semibold py-2 gap-2 transition cursor-pointer"
                            onClick={handleSaveSettings}
                        >
                            <MessageCircleIcon className="w-4 h-4" />
                            Chat với cơ sở tri thức
                        </Button>
                    </div>
                </div>
            </div>
            <CreateKnowlegeModal
                isOpen={isOpenCreateKnowlegeModal}
                onClose={handleCloseCreateKnowlegeModal}
            />
            <DeleteKnowledgeModal
                isOpen={isOpenDeleteKnowlegeModal}
                onClose={handleCloseDeleteKnowlegeModal}
                folder={{
                    id: folderDelete?.id || "",
                    name: folderDelete?.name || "",
                    description: folderDelete?.description || "",
                    document_count: folderDelete?.stats.document_count || 0,
                }}
            />
        </div>
    );
}

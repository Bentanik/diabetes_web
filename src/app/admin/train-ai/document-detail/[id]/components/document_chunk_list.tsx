"use client"

/* eslint-disable @typescript-eslint/no-unused-expressions */
import Pagination from "@/components/shared/pagination"
import { useGetDocumentChunksService, useUpdateStatusDocumentChunkService } from "@/services/train-ai/services"
import { useState } from "react"

// Shadcn UI
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNotificationContext } from "@/context/notification_context"
import { useBackdrop } from "@/context/backdrop_context"

interface DocumentChunkListProps {
    id: string
}

export default function DocumentChunkList({ id }: DocumentChunkListProps) {
    const [qualityFilter, setQualityFilter] = useState("all")
    const [expandedChunks, setExpandedChunks] = useState<Set<string>>(new Set())
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6)

    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { mutate: updateStatusDocumentChunk } = useUpdateStatusDocumentChunkService()

    const { addSuccess } = useNotificationContext()


    const [document_chunk_changes, setDocumentChunkChanges] = useState<{ id: string; is_active: boolean }[]>([])

    let minScore: number | undefined = undefined
    let maxScore: number | undefined = undefined
    switch (qualityFilter) {
        case "high":
            minScore = 0.8
            maxScore = 1
            break
        case "medium":
            minScore = 0.5
            maxScore = 0.79
            break
        case "low":
            maxScore = 0.5
            break
    }

    const {
        data: documentChunksData,
        refetch,
        isPending,
    } = useGetDocumentChunksService(id, {
        page: currentPage,
        limit: itemsPerPage,
        min_diabetes_score: minScore,
        max_diabetes_score: maxScore,
    })

    // Toggle expand/collapse
    const toggleExpand = (chunkId: string) => {
        setExpandedChunks((prev) => {
            const newSet = new Set(prev)
            newSet.has(chunkId) ? newSet.delete(chunkId) : newSet.add(chunkId)
            return newSet
        })
    }

    // Toggle active
    const handleToggleActive = (chunkId: string, currentActive: boolean) => {
        setDocumentChunkChanges((prev) => {
            if (prev.some((c) => c.id === chunkId)) {
                return prev.map((c) => (c.id === chunkId ? { ...c, is_active: !currentActive } : c))
            }
            return [...prev, { id: chunkId, is_active: !currentActive }]
        })
    }

    const handleSaveChanges = async () => {
        const data = {
            document_chunk_ids: document_chunk_changes.map((c) => c.id),
        }

        showBackdrop()

        updateStatusDocumentChunk(data, {
            onSuccess: () => {
            },
            onSettled: () => {
                handleResetChanges()
                addSuccess("Thành công", "Đã lưu thay đổi của các đoạn văn bản!")
                refetch()
                hideBackdrop()
            }
        })
    }

    // Reset
    const handleResetChanges = () => {
        setDocumentChunkChanges([])
    }

    const currentPageChunks = documentChunksData?.items ?? []

    // Helper functions
    const shortId = (id: string) => (id.length > 8 ? id.slice(-8) : id)

    const getQualityBadge = (score: string) => {
        const numScore = Number.parseFloat(score)
        if (isNaN(numScore))
            return { variant: "secondary" as const, label: "N/A", className: "bg-slate-100 text-slate-600" }

        if (numScore >= 0.8)
            return {
                variant: "default" as const,
                label: (numScore * 100).toFixed(0) + "%",
                className: "bg-emerald-500 text-white",
            }
        if (numScore >= 0.5)
            return {
                variant: "secondary" as const,
                label: (numScore * 100).toFixed(0) + "%",
                className: "bg-amber-500 text-white",
            }
        return {
            variant: "destructive" as const,
            label: (numScore * 100).toFixed(0) + "%",
            className: "bg-orange-500 text-white",
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto">
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Left Panel - Main content */}
                    <div className="xl:w-2/3 w-full space-y-8">
                        <Card className="border-0 bg-white" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Mức độ chất lượng</label>
                                        <Select value={qualityFilter} onValueChange={setQualityFilter}>
                                            <SelectTrigger
                                                className="w-full h-12 border-slate-200 bg-white"
                                                style={{
                                                    borderColor: qualityFilter !== "all" ? "#248fca" : undefined,
                                                    boxShadow: qualityFilter !== "all" ? "0 0 0 1px #248fca" : undefined,
                                                }}
                                            >
                                                <SelectValue placeholder="Chọn mức chất lượng" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả mức độ</SelectItem>
                                                <SelectItem value="high">Chất lượng cao</SelectItem>
                                                <SelectItem value="medium">Chất lượng trung bình</SelectItem>
                                                <SelectItem value="low">Chất lượng thấp</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Chunks List */}
                        <div className="space-y-6">
                            {currentPageChunks.length === 0 ? (
                                <Card className="border-0 bg-white" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                                    <CardContent className="text-center py-20">
                                        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                                            <svg className="w-16 h-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Không tìm thấy tài liệu</h3>
                                        <p className="text-slate-500 text-sm">Thử điều chỉnh bộ lọc để xem thêm kết quả</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                currentPageChunks.map((chunk) => {
                                    const isExpanded = expandedChunks.has(chunk.id)
                                    const shouldShowExpand = chunk.content.length > 300
                                    const change = document_chunk_changes.find((c) => c.id === chunk.id)
                                    const isActive = change ? change.is_active : chunk.is_active
                                    const isModified = !!change
                                    const qualityBadge = getQualityBadge(chunk.diabetes_score)

                                    return (
                                        <Card
                                            key={chunk.id}
                                            className={`border-0 bg-white hover:shadow-lg transition-all duration-300 ${isModified ? "ring-2 ring-blue-400" : ""
                                                } ${!isActive ? "opacity-60" : ""}`}
                                            style={{
                                                boxShadow: isModified
                                                    ? "rgba(0, 0, 0, 0.16) 0px 1px 4px, 0 0 0 2px rgba(59, 130, 246, 0.5)"
                                                    : "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                                            }}
                                        >
                                            <CardHeader className="pb-6">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                                                                style={{ backgroundColor: "#248fca" }}
                                                            >
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 00-2-2V5a2 2 0 002-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-slate-800">Đoạn #{shortId(chunk.id)}</span>
                                                                <span className="text-sm text-slate-500">Nội dung tài liệu</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-medium text-slate-600">Chất lượng:</span>
                                                            <Badge className={qualityBadge.className + " font-semibold px-3 py-1"}>
                                                                {qualityBadge.label}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <Switch
                                                                checked={isActive}
                                                                onCheckedChange={() => handleToggleActive(chunk.id, isActive)}
                                                                style={{
                                                                    backgroundColor: isActive ? "#248fca" : undefined,
                                                                }}
                                                                id={`switch-${chunk.id}`}
                                                            />
                                                            <span
                                                                className={`text-sm font-semibold px-3 py-1 rounded-full ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                                                    }`}
                                                            >
                                                                {isActive ? "Đang sử dụng" : "Tạm dừng"}
                                                            </span>
                                                        </div>

                                                        {isModified && (
                                                            <Badge className="font-semibold" style={{ backgroundColor: "#248fca", color: "white" }}>
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                    />
                                                                </svg>
                                                                Đã chỉnh sửa
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="pt-0">
                                                <div className="relative">
                                                    <div
                                                        className="rounded-xl p-6 border-l-4"
                                                        style={{
                                                            backgroundColor: "#f8fafc",
                                                            borderLeftColor: "#248fca",
                                                        }}
                                                    >
                                                        <p className="text-slate-800 leading-relaxed whitespace-pre-wrap break-words text-sm">
                                                            {isExpanded
                                                                ? chunk.content
                                                                : chunk.content.length > 300
                                                                    ? chunk.content.substring(0, 300) + "..."
                                                                    : chunk.content}
                                                        </p>
                                                        {!isExpanded && shouldShowExpand && (
                                                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none rounded-b-xl"></div>
                                                        )}
                                                    </div>

                                                    {shouldShowExpand && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleExpand(chunk.id)}
                                                            className="mt-4 font-semibold hover:bg-blue-50 text-sm"
                                                            style={{ color: "#248fca" }}
                                                        >
                                                            {isExpanded ? (
                                                                <>
                                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M5 15l7-7 7 7"
                                                                        />
                                                                    </svg>
                                                                    Thu gọn nội dung
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M19 9l-7 7-7-7"
                                                                        />
                                                                    </svg>
                                                                    Xem toàn bộ nội dung
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })
                            )}
                        </div>

                        {/* Pagination */}
                        {documentChunksData?.total_pages && documentChunksData?.total_pages > 1 && (
                            <div className="mt-12">
                                <Pagination
                                    currentPage={documentChunksData?.page}
                                    totalPages={documentChunksData?.total_pages}
                                    totalItems={documentChunksData?.total}
                                    perPage={documentChunksData?.limit}
                                    hasNext={documentChunksData?.page < documentChunksData?.total_pages}
                                    hasPrev={documentChunksData?.page > 1}
                                    onPageChange={setCurrentPage}
                                    isLoading={isPending}
                                    perPageOptions={[6, 9, 12, 18, 24]}
                                    onPerPageChange={setItemsPerPage}
                                />
                            </div>
                        )}
                    </div>

                    <div className="xl:w-1/3 w-full">
                        <div className="sticky top-6 space-y-6">
                            {/* Statistics Card */}
                            <Card className="border-0 bg-white" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                                <CardHeader className="pb-6">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                                            style={{ backgroundColor: "#248fca" }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800">Tổng Quan Thay Đổi</h3>
                                            <p className="text-sm text-slate-500">Theo dõi các chỉnh sửa</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                    />
                                                </svg>
                                                Danh sách thay đổi
                                            </h4><div className="text-sm font-bold" style={{ color: "#248fca" }}>
                                                {document_chunk_changes.length}
                                            </div>

                                        </div>
                                        <div className="space-y-3 max-h-48 overflow-y-auto">
                                            {document_chunk_changes.map((c) => (
                                                <div
                                                    key={c.id}
                                                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100"
                                                >
                                                    <span className="font-mono text-slate-600 font-medium text-sm">#{shortId(c.id)}</span>
                                                    <Badge className={c.is_active ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"}>
                                                        {c.is_active ? "Kích hoạt" : "Tạm dừng"}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Card */}
                            {document_chunk_changes.length > 0 && (
                                <Card className="border-0 bg-white" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                                    <CardHeader className="pb-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                                                style={{ backgroundColor: "#248fca" }}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800">Thao Tác</h3>
                                                <p className="text-sm text-slate-500">Lưu hoặc hủy thay đổi</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Button
                                            onClick={handleSaveChanges}
                                            className="w-full text-white font-semibold py-4 hover:opacity-90 transition-all duration-200 text-sm"
                                            style={{
                                                backgroundColor: "#248fca",
                                                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                                            }}
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Lưu Thay Đổi ({document_chunk_changes.length})
                                        </Button>
                                        <Button
                                            onClick={handleResetChanges}
                                            variant="outline"
                                            className="w-full border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 font-semibold py-4 hover:bg-slate-50 transition-all duration-200 bg-transparent text-sm"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                />
                                            </svg>
                                            Đặt Lại
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="border-0 bg-white" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                                            style={{ backgroundColor: "#248fca" }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800 mb-3 text-sm">Hướng Dẫn Sử Dụng</h4>
                                            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed">
                                                <li className="flex items-start gap-2">
                                                    <span style={{ color: "#248fca" }} className="mt-1">
                                                        •
                                                    </span>
                                                    <span>Nội dung chất lượng cao được ưu tiên hiển thị</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span style={{ color: "#248fca" }} className="mt-1">
                                                        •
                                                    </span>
                                                    <span>Sử dụng công tắc để bật/tắt từng đoạn nội dung</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span style={{ color: "#248fca" }} className="mt-1">
                                                        •
                                                    </span>
                                                    <span>Thay đổi được áp dụng trên toàn bộ hệ thống</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

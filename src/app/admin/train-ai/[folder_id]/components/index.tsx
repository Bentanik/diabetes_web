"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import ProfileHospitalMenu from "@/components/profile_hospital_menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Modal } from "@/components/shared/Modal"
import { Dropdown } from "@/components/shared/Dropdown"
import { FileTypeIcon, getFileTypeName, getFileTypeColor } from "@/components/shared/FileTypeIcon"
import UploadDocument from "@/app/admin/train-ai/components/upload_document"
import {
    BellIcon,
    SettingsIcon,
    FolderIcon,
    FileTextIcon,
    MoreVerticalIcon,
    TrashIcon,
    UploadIcon,
    ArrowLeftIcon,
    DownloadIcon,
    EyeIcon,
} from "lucide-react"
import { useGetKnowledgeBaseStatService } from "@/services/train-ai/services"

// Header Skeleton Component
const HeaderSkeleton = () => (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shadow-lg">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-1" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-1" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <div className="flex items-center gap-4 mt-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded" />
                <Skeleton className="w-10 h-10 rounded" />
                <Skeleton className="w-10 h-10 rounded-full" />
            </div>
        </div>
    </div>
)

// File Card Skeleton Component
const FileCardSkeleton = () => (
    <Card className="p-4 border border-gray-200 bg-white">
        <div className="flex items-start justify-between mb-3">
            <Skeleton className="w-10 h-10 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20" />
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
    </Card>
)

// Header Component
const Header = ({
    folder,
    isPending,
}: {
    folder?: API.TKnowledgeBaseStats
    isPending: boolean
}) => {
    const router = useRouter()
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)

    if (isPending) {
        return <HeaderSkeleton />
    }

    if (!folder) {
        return null
    }

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shadow-lg"
        >
            <div className="flex items-center justify-between">
                {/* Breadcrumb và thông tin thư mục */}
                <div className="flex items-center gap-4">
                    {/* Button quay lại */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.back()}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                    </motion.button>

                    <div>
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>Huấn luyện AI</span>
                            <span>/</span>
                            <span>Thư mục</span>
                            <span>/</span>
                            <span className="text-blue-600 font-medium">{folder.collection_name}</span>
                        </div>

                        {/* Tiêu đề */}
                        <h1 className="text-2xl font-bold text-gray-900">{folder.collection_name}</h1>

                        {/* Thống kê thư mục */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <FileTextIcon className="w-4 h-4" />
                                <span>{folder.total_documents} tài liệu</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>Cập nhật {folder.last_updated}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Các button hành động */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <BellIcon className="w-5 h-5" />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={() => setSettingsModalOpen(true)}>
                        <SettingsIcon className="w-5 h-5" />
                    </Button>

                    <div>
                        <ProfileHospitalMenu profile={1} />
                    </div>
                </div>
            </div>

            {/* Modal Cài đặt thư mục */}
            <Modal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} title="Cài đặt thư mục">
                <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                        Cấu hình các thông số cho thư mục &ldquo;{folder.collection_name}&rdquo;
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Tự động phân loại tài liệu</span>
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                defaultChecked
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Thông báo khi có tài liệu mới</span>
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Backup tự động</span>
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                defaultChecked
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setSettingsModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button>Lưu cài đặt</Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    )
}

// File Card Component
const FileCard = ({
    file,
    onDelete,
    onDownload,
    onPreview,
}: {
    file: API.TKnowledgeBaseDocument
    onDelete: (id: string) => void
    onDownload: (file: API.TKnowledgeBaseDocument) => void
    onPreview: (file: API.TKnowledgeBaseDocument) => void
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)

    return (
        <motion.div whileHover={{ y: -2, transition: { duration: 0.2 } }} className="group">
            <Card className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
                {/* Header của card */}
                <div className="flex items-start justify-between mb-3">
                    <FileTypeIcon fileType={file.content_type} className="w-10 h-10" />

                    <Dropdown
                        isOpen={dropdownOpen}
                        onClose={() => setDropdownOpen(false)}
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreVerticalIcon className="w-4 h-4" />
                            </Button>
                        }
                    >
                        <div className="py-1">
                            <motion.button
                                whileHover={{ backgroundColor: "#f3f4f6" }}
                                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                                onClick={() => {
                                    onPreview(file)
                                    setDropdownOpen(false)
                                }}
                            >
                                <EyeIcon className="w-4 h-4" />
                                Xem trước
                            </motion.button>
                            <motion.button
                                whileHover={{ backgroundColor: "#f3f4f6" }}
                                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                                onClick={() => {
                                    onDownload(file)
                                    setDropdownOpen(false)
                                }}
                            >
                                <DownloadIcon className="w-4 h-4" />
                                Tải xuống
                            </motion.button>
                            <motion.button
                                whileHover={{ backgroundColor: "#fef2f2" }}
                                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 transition-colors"
                                onClick={() => {
                                    onDelete(file.filename)
                                    setDropdownOpen(false)
                                }}
                            >
                                <TrashIcon className="w-4 h-4" />
                                Xóa
                            </motion.button>
                        </div>
                    </Dropdown>
                </div>

                {/* Thông tin file */}
                <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {file.filename}
                    </h3>

                    <p className={`text-xs font-medium ${getFileTypeColor(file.content_type)}`}>
                        {getFileTypeName(file.content_type)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span>{file.size}</span>
                        <span>{file.last_modified}</span>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

// Main Component
export default function TrainAIFolderComponent({ folderId }: { folderId: string }) {
    const { knowledge_base_stat, isPending } = useGetKnowledgeBaseStatService(folderId)
    const [uploadModalOpen, setUploadModalOpen] = useState(false)

    const handleDeleteFile = (id: string) => {
        console.log("Xóa file: ", id)
        // TODO: Implement delete functionality
    }

    const handleDownloadFile = (file: API.TKnowledgeBaseDocument) => {
        console.log("Tải xuống file: ", file)
        // TODO: Implement download functionality
    }

    const handlePreviewFile = (file: API.TKnowledgeBaseDocument) => {
        console.log("Xem trước file:", file)
        // TODO: Implement preview functionality
    }

    const handleUploadFile = () => {
        setUploadModalOpen(true)
    }

    // Error state - folder not found
    if (!folderId && !isPending) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy thư mục</h3>
                    <p className="text-gray-500">Thư mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Header trang */}
            <header>
                <Header folder={knowledge_base_stat} isPending={isPending} />
            </header>

            {/* Nội dung chính */}
            <main className="space-y-6">
                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div>
                        {isPending ? (
                            <>
                                <Skeleton className="h-7 w-32 mb-2" />
                                <Skeleton className="h-4 w-48" />
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-gray-900">Tài liệu</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {knowledge_base_stat?.total_documents || 0} tài liệu trong thư mục này
                                </p>
                            </>
                        )}
                    </div>

                    <Button
                        onClick={handleUploadFile}
                        className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
                        disabled={isPending}
                    >
                        <UploadIcon className="w-4 h-4" />
                        Tải lên tài liệu
                    </Button>
                </div>

                {/* Grid hiển thị files */}
                {isPending ? (
                    // Loading skeleton
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <FileCardSkeleton key={index} />
                        ))}
                    </div>
                ) : knowledge_base_stat && knowledge_base_stat.documents?.length > 0 ? (
                    // Files grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {knowledge_base_stat.documents.map((file, index) => (
                            <motion.div
                                key={file.filename}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <FileCard
                                    file={file}
                                    onDelete={handleDeleteFile}
                                    onDownload={handleDownloadFile}
                                    onPreview={handlePreviewFile}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    // Empty state
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        >
                            <FileTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài liệu nào</h3>
                        <p className="text-gray-600 mb-4">Tải lên tài liệu đầu tiên để bắt đầu huấn luyện AI</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button onClick={handleUploadFile} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                                <UploadIcon className="w-4 h-4 mr-2" />
                                Tải lên tài liệu
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </main>

            {/* Upload Modal */}
            <UploadDocument isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} folderId={folderId} />
        </div>
    )
}

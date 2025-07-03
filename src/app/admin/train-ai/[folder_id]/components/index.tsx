"use client"

import type React from "react"
import ProfileHospitalMenu from "@/components/profile_hospital_menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Modal } from "@/components/shared/Modal"
import { Dropdown } from "@/components/shared/Dropdown"
import { FileTypeIcon, getFileTypeName, getFileTypeColor } from "@/components/shared/FileTypeIcon"
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
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"

/**
 * Interface định nghĩa cấu trúc của một thư mục
 */
interface Folder {
    id: string
    name: string
    description: string
    documentCount: number
    lastUpdated: string
}

/**
 * Interface định nghĩa cấu trúc của một tài liệu/file
 */
interface DocumentFile {
    id: string
    name: string
    type: string
    size: string
    uploadDate: string
    folderId: string
}

/**
 * Component Header cho trang chi tiết thư mục
 * Bao gồm breadcrumb, thông tin thư mục và các button hành động
 */
const Header = ({ folder }: { folder: Folder }) => {
    const router = useRouter()
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)

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
                            <span className="text-blue-600 font-medium">{folder.name}</span>
                        </div>

                        {/* Tiêu đề và mô tả */}
                        <h1 className="text-2xl font-bold text-gray-900">{folder.name}</h1>
                        <p className="text-gray-600 mt-1 text-sm max-w-2xl">{folder.description}</p>

                        {/* Thống kê thư mục */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <FileTextIcon className="w-4 h-4" />
                                <span>{folder.documentCount} tài liệu</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>Cập nhật {folder.lastUpdated}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Các button hành động */}
                <div className="flex items-center gap-4">
                    {/* Button Thông báo */}
                    <Button variant="ghost" size="icon">
                        <BellIcon className="w-5 h-5" />
                    </Button>

                    {/* Button Cài đặt */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSettingsModalOpen(true)}
                    >
                        <SettingsIcon className="w-5 h-5" />
                    </Button>

                    {/* Profile Menu */}
                    <div>
                        <ProfileHospitalMenu profile={1} />
                    </div>
                </div>
            </div>

            {/* Modal Cài đặt thư mục */}
            <Modal
                isOpen={settingsModalOpen}
                onClose={() => setSettingsModalOpen(false)}
                title="Cài đặt thư mục"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                        Cấu hình các thông số cho thư mục &ldquo;{folder.name}&rdquo;
                    </p>

                    {/* Các tùy chọn cài đặt */}
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
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
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

                    {/* Buttons hành động */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setSettingsModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button>
                            Lưu cài đặt
                        </Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    )
}

/**
 * Component hiển thị thông tin của một file/tài liệu
 * Bao gồm icon, tên file, thông tin và menu hành động
 */
const FileCard = ({
    file,
    onDelete,
    onDownload,
    onPreview,
}: {
    file: DocumentFile
    onDelete: (id: string) => void
    onDownload: (file: DocumentFile) => void
    onPreview: (file: DocumentFile) => void
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)

    return (
        <motion.div
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group"
        >
            <Card className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
                {/* Header của card */}
                <div className="flex items-start justify-between mb-3">
                    {/* Icon file */}
                    <FileTypeIcon fileType={file.type} className="w-10 h-10" />

                    {/* Menu dropdown */}
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
                                    onDelete(file.id)
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
                    {/* Tên file */}
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {file.name}
                    </h3>

                    {/* Loại file */}
                    <p className={`text-xs font-medium ${getFileTypeColor(file.type)}`}>
                        {getFileTypeName(file.type)}
                    </p>

                    {/* Footer với thông tin file */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span>{file.size}</span>
                        <span>{file.uploadDate}</span>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

/**
 * Component chính cho trang chi tiết thư mục
 * Hiển thị danh sách tài liệu trong thư mục
 */
export default function TrainAIFolderComponent({ folderId }: { folderId: string }) {
    // Dữ liệu mẫu cho các thư mục (trong thực tế sẽ fetch từ API)
    const folders = [
        {
            id: "1",
            name: "Chẩn đoán tim mạch",
            description: "Tài liệu và hướng dẫn chẩn đoán các bệnh về tim mạch",
            documentCount: 2,
            lastUpdated: "2 ngày trước",
        },
        {
            id: "2",
            name: "Điều trị tiểu đường",
            description: "Phác đồ điều trị và theo dõi bệnh nhân tiểu đường",
            documentCount: 2,
            lastUpdated: "1 tuần trước",
        },
        {
            id: "3",
            name: "Chăm sóc sức khỏe trẻ em",
            description: "Hướng dẫn chăm sóc và điều trị cho trẻ em",
            documentCount: 1,
            lastUpdated: "3 ngày trước",
        },
        {
            id: "4",
            name: "Y học cấp cứu",
            description: "Quy trình xử lý các tình huống cấp cứu",
            documentCount: 0,
            lastUpdated: "5 ngày trước",
        },
    ]

    // Dữ liệu mẫu cho các file/tài liệu (trong thực tế sẽ fetch từ API)
    const [files, setFiles] = useState<DocumentFile[]>([
        {
            id: "1",
            name: "Hướng dẫn chẩn đoán nhồi máu cơ tim.pdf",
            type: "pdf",
            size: "2.5 MB",
            uploadDate: "2 ngày trước",
            folderId: "1",
        },
        {
            id: "2",
            name: "Phác đồ điều trị suy tim.docx",
            type: "docx",
            size: "1.2 MB",
            uploadDate: "3 ngày trước",
            folderId: "1",
        },
        {
            id: "3",
            name: "Bảng theo dõi đường huyết.xlsx",
            type: "xlsx",
            size: "856 KB",
            uploadDate: "1 tuần trước",
            folderId: "2",
        },
        {
            id: "4",
            name: "Thuyết trình về tiểu đường type 2.pptx",
            type: "pptx",
            size: "4.1 MB",
            uploadDate: "1 tuần trước",
            folderId: "2",
        },
        {
            id: "5",
            name: "Ghi chú điều trị trẻ em.txt",
            type: "txt",
            size: "45 KB",
            uploadDate: "3 ngày trước",
            folderId: "3",
        },
    ])

    const folder = folders.find((f) => f.id === folderId)
    const folderFiles = files.filter((file) => file.folderId === folderId)

    /**
     * Xử lý xóa file
     */
    const handleDeleteFile = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
            setFiles((prev) => prev.filter((file) => file.id !== id))
        }
    }

    /**
     * Xử lý tải xuống file
     */
    const handleDownloadFile = (file: DocumentFile) => {
        console.log("Tải xuống file:", file)
        // TODO: Implement download functionality
    }

    /**
     * Xử lý xem trước file
     */
    const handlePreviewFile = (file: DocumentFile) => {
        console.log("Xem trước file:", file)
        // TODO: Implement preview functionality
    }

    /**
     * Xử lý upload file mới
     */
    const handleUploadFile = () => {
        console.log("Upload file mới")
        // TODO: Implement upload functionality
    }

    // Kiểm tra nếu không tìm thấy thư mục
    if (!folder) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Không tìm thấy thư mục
                    </h3>
                    <p className="text-gray-500">
                        Thư mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Header trang */}
            <header>
                <Header folder={folder} />
            </header>

            {/* Nội dung chính */}
            <main className="space-y-6">
                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Tài liệu</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {folderFiles.length} tài liệu trong thư mục này
                        </p>
                    </div>
                    <Button onClick={handleUploadFile} className="gap-2">
                        <UploadIcon className="w-4 h-4" />
                        Tải lên tài liệu
                    </Button>
                </div>

                {/* Grid hiển thị files */}
                {folderFiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {folderFiles.map((file, index) => (
                            <motion.div
                                key={file.id}
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
                    /* Empty state khi không có tài liệu */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Chưa có tài liệu nào
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Tải lên tài liệu đầu tiên để bắt đầu huấn luyện AI
                        </p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button onClick={handleUploadFile}>
                                <UploadIcon className="w-4 h-4 mr-2" />
                                Tải lên tài liệu
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </main>
        </div>
    )
}

"use client"

import { use } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeftIcon,
    FileTextIcon,
    PlusIcon,
    SearchIcon,
    DownloadIcon,
    FolderIcon,
    CalendarIcon,
    MoreHorizontalIcon,
    EyeIcon,
    EditIcon,
    TrashIcon,
    FileIcon,
    ImageIcon,
    VideoIcon,
    MusicIcon,
    ArchiveIcon,
    XIcon,
    CheckCircleIcon,
    ClockIcon,
    AlertCircleIcon,
    RefreshCwIcon,
    FilterIcon,
} from "lucide-react"
import { useState, useCallback, useMemo } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// Mock data với trạng thái huấn luyện chi tiết
const mockKnowledgeBase = {
    id: "benh-tieu-duong",
    name: "Bệnh tiểu đường",
    description: "Tài liệu và kiến thức về bệnh tiểu đường, chẩn đoán, điều trị và theo dõi bệnh nhân",
    createdAt: "2025-07-08",
    totalFiles: 15,
    totalSize: "2.4 MB",
    files: [
        {
            id: 1,
            name: "Hướng dẫn chẩn đoán tiểu đường type 2",
            type: "PDF",
            size: "245 KB",
            uploadedAt: "2025-07-05",
            description: "Tài liệu hướng dẫn chi tiết về quy trình chẩn đoán bệnh tiểu đường type 2 theo tiêu chuẩn quốc tế",
            status: "completed",
            progress: 100,
            accuracy: 96.2,
            tokens: 1250,
            lastTrained: "2025-07-08 10:15",
            trainingTime: "2 phút 30 giây",
        },
        {
            id: 2,
            name: "Phác đồ điều trị tiểu đường",
            type: "DOCX",
            size: "180 KB",
            uploadedAt: "2025-07-03",
            description: "Phác đồ điều trị chuẩn cho bệnh nhân tiểu đường các type khác nhau",
            status: "training",
            progress: 65,
            accuracy: 0,
            tokens: 980,
            estimatedTime: "1 phút 20 giây",
        },
        {
            id: 3,
            name: "Biến chứng tiểu đường và cách phòng ngừa",
            type: "PDF",
            size: "320 KB",
            uploadedAt: "2025-07-01",
            description: "Tổng quan về các biến chứng thường gặp và phương pháp phòng ngừa hiệu quả",
            status: "processing",
            progress: 25,
            accuracy: 0,
            tokens: 1580,
            estimatedTime: "3 phút 45 giây",
        },
        {
            id: 4,
            name: "Chế độ dinh dưỡng cho bệnh nhân tiểu đường",
            type: "PDF",
            size: "156 KB",
            uploadedAt: "2025-06-28",
            description: "Hướng dẫn xây dựng chế độ ăn uống phù hợp cho bệnh nhân tiểu đường",
            status: "pending",
            progress: 0,
            accuracy: 0,
            tokens: 750,
            queuePosition: 2,
        },
        {
            id: 5,
            name: "Hướng dẫn tự theo dõi đường huyết tại nhà",
            type: "DOCX",
            size: "98 KB",
            uploadedAt: "2025-06-25",
            description: "Cách sử dụng máy đo đường huyết và theo dõi chỉ số tại nhà",
            status: "error",
            progress: 0,
            accuracy: 0,
            tokens: 420,
            error: "Định dạng file không được hỗ trợ",
            errorCode: "UNSUPPORTED_FORMAT",
        },
        {
            id: 6,
            name: "Thuốc điều trị tiểu đường mới nhất 2025",
            type: "PDF",
            size: "278 KB",
            uploadedAt: "2025-06-20",
            description: "Cập nhật về các loại thuốc điều trị tiểu đường mới và hiệu quả",
            status: "completed",
            progress: 100,
            accuracy: 94.8,
            tokens: 1340,
            lastTrained: "2025-07-07 16:45",
            trainingTime: "3 phút 10 giây",
        },
        {
            id: 7,
            name: "Bài tập thể dục cho bệnh nhân tiểu đường",
            type: "PDF",
            size: "198 KB",
            uploadedAt: "2025-06-15",
            description: "Hướng dẫn các bài tập thể dục phù hợp và an toàn",
            status: "not_trained",
            progress: 0,
            accuracy: 0,
            tokens: 0,
        },
        {
            id: 8,
            name: "Kiểm soát stress và tiểu đường",
            type: "DOCX",
            size: "134 KB",
            uploadedAt: "2025-06-10",
            description: "Mối liên hệ giữa stress và bệnh tiểu đường",
            status: "not_trained",
            progress: 0,
            accuracy: 0,
            tokens: 0,
        },
    ],
}

/**
 * Component search input với icon và clear button
 */
const SearchInput = ({
    value,
    onChange,
    onClear,
    placeholder = "Tìm kiếm tài liệu...",
}: {
    value: string
    onChange: (value: string) => void
    onClear: () => void
    placeholder?: string
}) => {
    return (
        <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 pr-10 border-gray-200 focus:border-[#248fca] 
                 border-2 focus-visible:border-[#248fca] rounded-full focus-visible:ring-0"
            />
            {value && (
                <button
                    onClick={onClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                >
                    <XIcon className="h-4 w-4 text-gray-400" />
                </button>
            )}
        </div>
    )
}

const Header = () => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
            style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                    </motion.button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FolderIcon className="w-5 h-5 text-[#248fca]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-semibold text-[#248fca]">{mockKnowledgeBase.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{mockKnowledgeBase.totalFiles} tài liệu</span>
                                <span>•</span>
                                <span>{mockKnowledgeBase.totalSize}</span>
                                <span>•</span>
                                <span>Cập nhật mới nhất {mockKnowledgeBase.createdAt}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" className="gap-2 bg-[#248fca] hover:bg-[#248fca]/80">
                        <PlusIcon className="w-4 h-4" />
                        Thêm tài liệu
                    </Button>
                </div>
            </div>

            {/* Description - Optional, only if needed */}
            {mockKnowledgeBase.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">{mockKnowledgeBase.description}</p>
                </div>
            )}
        </motion.div>
    )
}

const getStatusInfo = (status: string) => {
    switch (status) {
        case "completed":
            return {
                label: "Đã huấn luyện",
                color: "bg-green-100 text-green-800 border-green-200",
                icon: <CheckCircleIcon className="w-3 h-3" />,
                dotColor: "bg-green-500",
            }
        case "training":
            return {
                label: "Đang huấn luyện",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: <RefreshCwIcon className="w-3 h-3 animate-spin" />,
                dotColor: "bg-blue-500",
            }
        case "processing":
            return {
                label: "Đang xử lý",
                color: "bg-purple-100 text-purple-800 border-purple-200",
                icon: <RefreshCwIcon className="w-3 h-3 animate-spin" />,
                dotColor: "bg-purple-500",
            }
        case "pending":
            return {
                label: "Chờ xử lý",
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: <ClockIcon className="w-3 h-3" />,
                dotColor: "bg-yellow-500",
            }
        case "error":
            return {
                label: "Lỗi",
                color: "bg-red-100 text-red-800 border-red-200",
                icon: <AlertCircleIcon className="w-3 h-3" />,
                dotColor: "bg-red-500",
            }
        case "not_trained":
            return {
                label: "Chưa huấn luyện",
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: <ClockIcon className="w-3 h-3" />,
                dotColor: "bg-gray-500",
            }
        default:
            return {
                label: "Không xác định",
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: <ClockIcon className="w-3 h-3" />,
                dotColor: "bg-gray-500",
            }
    }
}

const StatusBadge = ({ status }: { status: string }) => {
    const statusInfo = getStatusInfo(status)
    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
        >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
        </div>
    )
}

const TrainingProgress = ({ file }: { file: any }) => {
    const statusInfo = getStatusInfo(file.status)

    if (file.status === "pending") {
        return (
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor} animate-pulse`}></div>
                        <span className="text-sm font-medium text-yellow-800">Đang chờ trong hàng đợi</span>
                    </div>
                    <span className="text-xs text-yellow-600">Vị trí: #{file.queuePosition}</span>
                </div>
                <p className="text-xs text-yellow-700">Tài liệu sẽ được xử lý trong thời gian sớm nhất</p>
            </div>
        )
    }

    if (file.status === "processing") {
        return (
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor} animate-pulse`}></div>
                        <span className="text-sm font-medium text-purple-800">Đang xử lý tài liệu</span>
                    </div>
                    <span className="text-xs text-purple-600">{file.progress}%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                    <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                    ></div>
                </div>
                <p className="text-xs text-purple-700">Thời gian ước tính: {file.estimatedTime}</p>
            </div>
        )
    }

    if (file.status === "training") {
        return (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor} animate-pulse`}></div>
                        <span className="text-sm font-medium text-blue-800">Đang huấn luyện AI</span>
                    </div>
                    <span className="text-xs text-blue-600">{file.progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                    ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-blue-700">
                    <span>Tokens: {file.tokens.toLocaleString()}</span>
                    <span>Còn lại: {file.estimatedTime}</span>
                </div>
            </div>
        )
    }

    if (file.status === "completed") {
        return (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></div>
                        <span className="text-sm font-medium text-green-800">Huấn luyện hoàn thành</span>
                    </div>
                    <span className="text-xs text-green-600">Độ chính xác: {file.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-green-700">
                    <span>Tokens: {file.tokens.toLocaleString()}</span>
                    <span>Thời gian: {file.trainingTime}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Lần cuối: {file.lastTrained}</p>
            </div>
        )
    }

    if (file.status === "error") {
        return (
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></div>
                    <span className="text-sm font-medium text-red-800">Lỗi xử lý</span>
                </div>
                <p className="text-xs text-red-700 mb-2">{file.error}</p>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-red-600">Mã lỗi: {file.errorCode}</span>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                    >
                        Thử lại
                    </Button>
                </div>
            </div>
        )
    }

    return null
}

const FileCard = ({ file, showProgress = false }: { file: any; showProgress?: boolean }) => {
    const getFileIcon = (type: string) => {
        const iconClass = "w-6 h-6"
        switch (type) {
            case "PDF":
                return <FileTextIcon className={`${iconClass} text-red-500`} />
            case "DOCX":
                return <FileIcon className={`${iconClass} text-blue-500`} />
            case "JPG":
            case "PNG":
                return <ImageIcon className={`${iconClass} text-green-500`} />
            case "MP4":
                return <VideoIcon className={`${iconClass} text-purple-500`} />
            case "MP3":
                return <MusicIcon className={`${iconClass} text-orange-500`} />
            default:
                return <ArchiveIcon className={`${iconClass} text-gray-500`} />
        }
    }

    const getFileTypeColor = (type: string) => {
        switch (type) {
            case "PDF":
                return "bg-red-100 text-red-800"
            case "DOCX":
                return "bg-blue-100 text-blue-800"
            case "JPG":
            case "PNG":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="group bg-white border border-gray-200 rounded-xl hover:border-[#248fca]/30 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-4 p-4">
                {/* File Icon */}
                <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    {getFileIcon(file.type)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                        <Badge className={`${getFileTypeColor(file.type)} text-xs`}>{file.type}</Badge>
                        <StatusBadge status={file.status} />
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1 mb-2">{file.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{file.uploadedAt}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ArchiveIcon className="w-3 h-3" />
                            <span>{file.size}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#248fca]/10 hover:text-[#248fca]"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#248fca]/10 hover:text-[#248fca]"
                    >
                        <DownloadIcon className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontalIcon className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                                <EyeIcon className="w-4 h-4" />
                                Xem trước
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <DownloadIcon className="w-4 h-4" />
                                Tải xuống
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <EditIcon className="w-4 h-4" />
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-red-600">
                                <TrashIcon className="w-4 h-4" />
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Training Progress - Full width khi hiển thị */}
            {showProgress && (
                <div className="px-4 pb-4">
                    <TrainingProgress file={file} />
                </div>
            )}
        </div>
    )
}

export default function KnowledgeBaseDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    /**
     * Xử lý thay đổi search term
     */
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value)
    }, [])

    /**
     * Xử lý clear search
     */
    const handleClearSearch = useCallback(() => {
        setSearchTerm("")
    }, [])

    // Filter files based on tab and search
    const filteredFiles = useMemo(() => {
        let files = mockKnowledgeBase.files

        // Filter by search term
        if (searchTerm) {
            files = files.filter(
                (file) =>
                    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    file.description.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        // Filter by tab
        if (activeTab === "training") {
            files = files.filter((file) => ["pending", "processing", "training"].includes(file.status))
        } else if (activeTab === "all") {
            // Filter by status if selected
            if (statusFilter === "trained") {
                files = files.filter((file) => file.status === "completed")
            } else if (statusFilter === "not_trained") {
                files = files.filter((file) => ["not_trained", "error"].includes(file.status))
            }
        }

        return files
    }, [searchTerm, activeTab, statusFilter])

    const trainingFiles = mockKnowledgeBase.files.filter((file) =>
        ["pending", "processing", "training"].includes(file.status),
    )

    const isSearching = searchTerm.length > 0

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Compact & Clean */}
            <header>
                <Header />
            </header>

            {/* Main Content with Tabs */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="border-b border-gray-100">
                            {/* Tabs List */}
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="all" className="data-[state=active]:bg-[#248fca] data-[state=active]:text-white">
                                    Tất cả tài liệu ({mockKnowledgeBase.files.length})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="training"
                                    className="data-[state=active]:bg-[#248fca] data-[state=active]:text-white"
                                >
                                    Đang huấn luyện ({trainingFiles.length})
                                </TabsTrigger>
                            </TabsList>

                            {/* Search and Filter */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <SearchInput
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onClear={handleClearSearch}
                                    placeholder="Tìm kiếm tài liệu, mô tả..."
                                />

                                {/* Status Filter - chỉ hiển thị trong tab "Tất cả" */}
                                {activeTab === "all" && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="gap-2 bg-transparent whitespace-nowrap">
                                                <FilterIcon className="w-4 h-4" />
                                                {statusFilter === "all"
                                                    ? "Tất cả trạng thái"
                                                    : statusFilter === "trained"
                                                        ? "Đã huấn luyện"
                                                        : "Chưa huấn luyện"}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setStatusFilter("all")}>Tất cả trạng thái</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setStatusFilter("trained")}>Đã huấn luyện</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setStatusFilter("not_trained")}>
                                                Chưa huấn luyện
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="px-6">
                            {/* Tab Content - Tất cả tài liệu */}
                            <TabsContent value="all" className="mt-0">
                                <div className="space-y-3">
                                    {filteredFiles.length > 0 ? (
                                        filteredFiles.map((file, index) => (
                                            <motion.div
                                                key={file.id}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <FileCard file={file} showProgress={false} />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                                            {isSearching ? (
                                                <>
                                                    <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                                                    <p className="text-gray-500 mb-6">
                                                        Không có tài liệu nào phù hợp với từ khóa &quot;{searchTerm}&quot;
                                                    </p>
                                                    <Button onClick={handleClearSearch} variant="outline" className="gap-2 bg-transparent">
                                                        <XIcon className="w-4 h-4" />
                                                        Xóa bộ lọc
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài liệu nào</h3>
                                                    <p className="text-gray-500 mb-6">Thêm tài liệu đầu tiên vào thư mục này</p>
                                                    <Button className="gap-2 bg-[#248fca] hover:bg-[#248fca]/80">
                                                        <PlusIcon className="w-4 h-4" />
                                                        Thêm tài liệu đầu tiên
                                                    </Button>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Tab Content - Đang huấn luyện */}
                            <TabsContent value="training" className="mt-0">
                                <div className="space-y-3">
                                    {filteredFiles.length > 0 ? (
                                        filteredFiles.map((file, index) => (
                                            <motion.div
                                                key={file.id}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <FileCard file={file} showProgress={true} />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                                            {isSearching ? (
                                                <>
                                                    <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                                                    <p className="text-gray-500 mb-6">
                                                        Không có tài liệu đang huấn luyện nào phù hợp với từ khóa &quot;{searchTerm}&quot;
                                                    </p>
                                                    <Button onClick={handleClearSearch} variant="outline" className="gap-2 bg-transparent">
                                                        <XIcon className="w-4 h-4" />
                                                        Xóa bộ lọc
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCwIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có tài liệu đang huấn luyện</h3>
                                                    <p className="text-gray-500 mb-6">
                                                        Tất cả tài liệu đã được xử lý hoặc chưa bắt đầu huấn luyện
                                                    </p>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            </motion.div>
        </div>
    )
}

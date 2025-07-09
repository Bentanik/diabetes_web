"use client"

import type React from "react"

import { use, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeftIcon,
    UploadIcon,
    FileTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    AlertTriangleIcon,
    FileIcon,
    ImageIcon,
    VideoIcon,
    MusicIcon,
    ArchiveIcon,
    RefreshCwIcon,
    TrashIcon,
    FolderIcon,
    InfoIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"

// ===== INTERFACES =====
interface ValidationResults {
    isValid: boolean
    confidence: number
    reasons: string[]
    suggestions?: string[]
    keyTopics?: string[]
    error?: string
    errorCode?: string
}

interface UploadedFile {
    id: number
    name: string
    size: string
    type: string
    status: "uploading" | "validating" | "valid" | "invalid" | "error"
    progress: number
    validationResults: ValidationResults | null
}

interface StatusInfo {
    label: string
    color: string
    icon: React.ReactNode
}

interface KnowledgeBase {
    id: string
    name: string
    description: string
}

// ===== API FUNCTIONS =====

// Simulate file upload API call
const uploadFileToServer = async (
    file: File,
    onProgress: (progress: number) => void,
): Promise<{ success: boolean; fileId?: string; error?: string }> => {
    return new Promise((resolve) => {
        let progress = 0
        const interval = setInterval(() => {
            progress += 10
            onProgress(progress)

            if (progress >= 100) {
                clearInterval(interval)
                // Simulate random upload success/failure
                const success = Math.random() > 0.1 // 90% success rate
                if (success) {
                    resolve({ success: true, fileId: `file_${Date.now()}` })
                } else {
                    resolve({ success: false, error: "Lỗi kết nối mạng" })
                }
            }
        }, 200)
    })
}

// Simulate document validation API call
const validateDocument = async (
    fileId: string,
    filename: string,
    knowledgeBaseId: string,
    onProgress: (progress: number) => void,
): Promise<ValidationResults> => {
    return new Promise((resolve) => {
        let progress = 0
        const interval = setInterval(() => {
            progress += 15
            onProgress(progress)

            if (progress >= 100) {
                clearInterval(interval)
                resolve(generateValidationResults(filename, knowledgeBaseId))
            }
        }, 300)
    })
}

// ===== UTILITY FUNCTIONS =====
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const getFileType = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase()
    switch (extension) {
        case "pdf":
            return "PDF"
        case "docx":
            return "DOCX"
        case "txt":
            return "TXT"
        default:
            return "FILE"
    }
}

const getFileIcon = (type: string) => {
    const iconClass = "w-6 h-6"
    switch (type) {
        case "PDF":
            return <FileTextIcon className={`${iconClass} text-red-500`} />
        case "DOCX":
            return <FileIcon className={`${iconClass} text-blue-500`} />
        case "JPG":
            return <ImageIcon className={`${iconClass} text-green-500`} />
        case "MP4":
            return <VideoIcon className={`${iconClass} text-purple-500`} />
        case "MP3":
            return <MusicIcon className={`${iconClass} text-orange-500`} />
        default:
            return <ArchiveIcon className={`${iconClass} text-gray-500`} />
    }
}

const getFileTypeColor = (type: string): string => {
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

const getStatusInfo = (status: string): StatusInfo => {
    switch (status) {
        case "uploading":
            return {
                label: "Đang tải lên",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: <RefreshCwIcon className="w-3 h-3 animate-spin" />,
            }
        case "validating":
            return {
                label: "Đang kiểm tra",
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: <RefreshCwIcon className="w-3 h-3 animate-spin" />,
            }
        case "valid":
            return {
                label: "Phù hợp",
                color: "bg-green-100 text-green-800 border-green-200",
                icon: <CheckCircleIcon className="w-3 h-3" />,
            }
        case "invalid":
            return {
                label: "Phù hợp một phần",
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: <XCircleIcon className="w-3 h-3" />,
            }
        case "error":
            return {
                label: "Lỗi",
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: <AlertTriangleIcon className="w-3 h-3" />,
            }
        default:
            return {
                label: "Không xác định",
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: <InfoIcon className="w-3 h-3" />,
            }
    }
}

const generateValidationResults = (filename: string, knowledgeBaseId: string): ValidationResults => {
    // Analyze filename for relevance
    const lowerFilename = filename.toLowerCase()
    const diabetesKeywords = ["tiểu đường", "diabetes", "đường huyết", "insulin", "glucose", "hba1c"]
    const hasRelevantKeywords = diabetesKeywords.some((keyword) => lowerFilename.includes(keyword))

    // Determine if valid based on filename and random factor
    const isValid = hasRelevantKeywords && Math.random() > 0.3
    const confidence = isValid
        ? Math.floor(Math.random() * 20) + 80 // 80-99% for valid
        : Math.floor(Math.random() * 40) + 20 // 20-59% for invalid

    if (isValid) {
        return {
            isValid: true,
            confidence,
            reasons: [
                `Tên file "${filename}" phù hợp với chủ đề tiểu đường`,
                "Nội dung hoàn toàn phù hợp với knowledge base hiện tại",
                "Có đầy đủ thông tin về chẩn đoán và điều trị",
                "Sử dụng thuật ngữ y khoa chính xác",
                "Cấu trúc tài liệu rõ ràng và logic",
            ],
            keyTopics: ["Chẩn đoán", "Điều trị", "Theo dõi", "Biến chứng"],
        }
    } else {
        const reasons = [
            `Tên file "${filename}" chỉ một phần liên quan đến chủ đề tiểu đường`,
            "Thiếu thông tin chi tiết về insulin và kiểm soát đường huyết",
            "Một số thuật ngữ cần được cập nhật theo tiêu chuẩn mới",
        ]

        // Add specific reasons based on filename
        if (!hasRelevantKeywords) {
            reasons.unshift("Tên file không chứa từ khóa liên quan đến tiểu đường")
        }

        return {
            isValid: false,
            confidence,
            reasons,
            suggestions: [
                "Nên đổi tên file để phản ánh đúng nội dung về tiểu đường",
                "Bổ sung thêm thông tin về quản lý tiểu đường",
                "Cập nhật thuật ngữ y khoa theo tiêu chuẩn mới nhất",
            ],
        }
    }
}

// ===== COMPONENTS =====

// Status Badge Component
interface StatusBadgeProps {
    status: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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

// Validation Results Component
interface ValidationResultsProps {
    file: UploadedFile
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ file }) => {
    if (!file.validationResults) return null

    if (file.status === "error") {
        return (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangleIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">Lỗi xử lý tài liệu</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{file.validationResults.error}</p>
                <span className="text-xs text-gray-500">Mã lỗi: {file.validationResults.errorCode}</span>
            </div>
        )
    }

    if (file.status === "valid") {
        return (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Tài liệu phù hợp</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Độ tin cậy: {file.validationResults.confidence}%</span>
                </div>

                <div className="space-y-3">
                    <div>
                        <h4 className="text-xs font-medium text-green-800 mb-2">Lý do phù hợp:</h4>
                        <ul className="space-y-1">
                            {file.validationResults.reasons.map((reason: string, index: number) => (
                                <li key={index} className="text-xs text-green-700 flex items-start gap-2">
                                    <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {file.validationResults.keyTopics && (
                        <div>
                            <h4 className="text-xs font-medium text-green-800 mb-2">Chủ đề chính:</h4>
                            <div className="flex flex-wrap gap-1">
                                {file.validationResults.keyTopics.map((topic: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                                        {topic}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (file.status === "invalid") {
        return (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <XCircleIcon className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Tài liệu phù hợp một phần</span>
                    </div>
                    <span className="text-xs text-yellow-600 font-medium">Độ tin cậy: {file.validationResults.confidence}%</span>
                </div>

                <div className="space-y-3">
                    <div>
                        <h4 className="text-xs font-medium text-yellow-800 mb-2">Vấn đề được phát hiện:</h4>
                        <ul className="space-y-1">
                            {file.validationResults.reasons.map((reason: string, index: number) => (
                                <li key={index} className="text-xs text-yellow-700 flex items-start gap-2">
                                    <span className="w-1 h-1 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {file.validationResults.suggestions && (
                        <div>
                            <h4 className="text-xs font-medium text-yellow-800 mb-2">Gợi ý cải thiện:</h4>
                            <ul className="space-y-1">
                                {file.validationResults.suggestions.map((suggestion: string, index: number) => (
                                    <li key={index} className="text-xs text-yellow-700 flex items-start gap-2">
                                        <span className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Admin Override Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                        <div className="flex items-start gap-2">
                            <InfoIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-blue-800 mb-1">Quyền Admin</p>
                                <p className="text-xs text-blue-700">
                                    Bạn có thể thêm tài liệu này vào Knowledge Base. Hệ thống sẽ ghi nhận và theo dõi hiệu quả sử dụng.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

// File Upload Card Component
interface FileUploadCardProps {
    file: UploadedFile
    onAddToKB: () => void
    onReset: () => void
    isProcessing: boolean
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({ file, onAddToKB, onReset, isProcessing }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-4 p-4">
                {/* File Icon */}
                <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">{getFileIcon(file.type)}</div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                        <Badge className={`${getFileTypeColor(file.type)} text-xs`}>{file.type}</Badge>
                        <StatusBadge status={file.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{file.size}</span>
                        {file.status === "uploading" && <span>Đang tải file lên server...</span>}
                        {file.status === "validating" && <span>Đang phân tích nội dung và kiểm tra phù hợp...</span>}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {(file.status === "valid" || file.status === "invalid") && (
                        <Button
                            size="sm"
                            className="bg-[#248fca] hover:bg-[#248fca]/80"
                            onClick={onAddToKB}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Đang thêm..." : file.status === "valid" ? "Thêm vào KB" : "Vẫn thêm vào KB"}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                        onClick={onReset}
                        disabled={isProcessing}
                    >
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Progress Bar */}
            {(file.status === "uploading" || file.status === "validating") && (
                <div className="px-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            {file.status === "uploading" ? "Đang tải lên server..." : "Đang kiểm tra tài liệu..."}
                        </span>
                        <span className="text-sm font-medium text-[#248fca]">{file.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-[#248fca] h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${file.progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Validation Results */}
            {file.validationResults && (
                <div className="px-4 pb-4">
                    <ValidationResults file={file} />
                </div>
            )}
        </div>
    )
}

// Upload Area Component
interface UploadAreaProps {
    uploadedFile: UploadedFile | null
    isDragOver: boolean
    onDragOver: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
    onFileUpload: () => void
}

const UploadArea: React.FC<UploadAreaProps> = ({
    uploadedFile,
    isDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileUpload,
}) => {
    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg text-[#248fca]">Tải tài liệu</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Drag & Drop Area - chỉ hiển thị khi chưa có file */}
                {!uploadedFile && (
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragOver ? "border-[#248fca] bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Kéo thả tài liệu vào đây</h3>
                        <p className="text-sm text-gray-500 mb-4">hoặc</p>
                        <Button className="bg-[#248fca] hover:bg-[#248fca]/80" onClick={onFileUpload}>
                            Chọn tài liệu
                        </Button>
                        <p className="text-xs text-gray-400 mt-4">Hỗ trợ: PDF, DOCX, TXT (tối đa 10MB)</p>
                    </div>
                )}

                {/* Upload Status */}
                {uploadedFile && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Trạng thái:</span>
                            <StatusBadge status={uploadedFile.status} />
                        </div>
                        {uploadedFile.status === "valid" && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Độ tin cậy:</span>
                                <span className="font-medium text-green-600">{uploadedFile.validationResults?.confidence}%</span>
                            </div>
                        )}
                        {uploadedFile.status === "invalid" && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Độ tin cậy:</span>
                                <span className="font-medium text-yellow-600">{uploadedFile.validationResults?.confidence}%</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// Validation Info Component
const ValidationInfo: React.FC = () => {
    return (
        <Card className="shadow-sm border-gray-200 mt-6">
            <CardHeader>
                <CardTitle className="text-lg text-[#248fca] flex items-center gap-2">
                    <InfoIcon className="w-5 h-5" />
                    Kiểm tra tự động
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                    <p className="mb-2">Hệ thống sẽ tự động kiểm tra:</p>
                    <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Tên file có phù hợp với chủ đề không</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Nội dung có phù hợp với knowledge base không</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Chất lượng và độ chính xác thông tin</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Định dạng và cấu trúc tài liệu</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Trùng lặp với tài liệu hiện có</span>
                        </li>
                    </ul>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                        <p className="text-xs text-blue-800 font-medium mb-1">Lưu ý cho Admin:</p>
                        <p className="text-xs text-blue-700">
                            Bạn có quyền thêm tài liệu vào Knowledge Base dù kết quả kiểm tra không hoàn toàn phù hợp.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Header Component
interface HeaderProps {
    knowledgeBase: KnowledgeBase
    canAddToKB: boolean
    uploadedFile: UploadedFile | null
    isProcessing: boolean
    onGoBack: () => void
    onAddToKB: () => void
}

const Header: React.FC<HeaderProps> = ({
    knowledgeBase,
    canAddToKB,
    uploadedFile,
    isProcessing,
    onGoBack,
    onAddToKB,
}) => {
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
                        onClick={onGoBack}
                        className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                    </motion.button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <UploadIcon className="w-5 h-5 text-[#248fca]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-semibold text-[#248fca]">Tải tài liệu lên</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Knowledge Base: {knowledgeBase.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {canAddToKB && (
                        <Button className="gap-2 bg-[#248fca] hover:bg-[#248fca]/80" onClick={onAddToKB} disabled={isProcessing}>
                            {isProcessing ? "Đang thêm..." : uploadedFile?.status === "valid" ? "Thêm tài liệu" : "Vẫn thêm tài liệu"}
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

// File Display Component
interface FileDisplayProps {
    uploadedFile: UploadedFile | null
    onAddToKB: () => void
    onReset: () => void
    isProcessing: boolean
}

const FileDisplay: React.FC<FileDisplayProps> = ({ uploadedFile, onAddToKB, onReset, isProcessing }) => {
    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg text-[#248fca]">
                    {uploadedFile ? "Tài liệu đã tải lên" : "Chưa có tài liệu"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {uploadedFile ? (
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <FileUploadCard file={uploadedFile} onAddToKB={onAddToKB} onReset={onReset} isProcessing={isProcessing} />
                    </motion.div>
                ) : (
                    <div className="text-center py-12">
                        <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài liệu nào</h3>
                        <p className="text-gray-500">Tải lên tài liệu để bắt đầu kiểm tra</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ===== MAIN COMPONENT =====
const UploadPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const router = useRouter()
    const { id } = use(params)
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    // Mock data cho knowledge base
    const mockKnowledgeBase: KnowledgeBase = {
        id: "benh-tieu-duong",
        name: "Bệnh tiểu đường",
        description: "Tài liệu và kiến thức về bệnh tiểu đường, chẩn đoán, điều trị và theo dõi bệnh nhân",
    }

    const processFileUpload = useCallback(
        async (file: File) => {
            setIsProcessing(true)

            // Tạo file object với trạng thái uploading
            const newFile: UploadedFile = {
                id: Date.now(),
                name: file.name,
                size: formatFileSize(file.size),
                type: getFileType(file.name),
                status: "uploading",
                progress: 0,
                validationResults: null,
            }

            setUploadedFile(newFile)

            try {
                // Step 1: Upload file to server
                const uploadResult = await uploadFileToServer(file, (progress) => {
                    setUploadedFile((prev) => (prev ? { ...prev, progress } : null))
                })

                if (!uploadResult.success) {
                    setUploadedFile((prev) =>
                        prev
                            ? {
                                ...prev,
                                status: "error",
                                validationResults: {
                                    isValid: false,
                                    confidence: 0,
                                    reasons: [],
                                    error: uploadResult.error || "Lỗi không xác định",
                                    errorCode: "UPLOAD_FAILED",
                                },
                            }
                            : null,
                    )
                    setIsProcessing(false)
                    return
                }

                // Step 2: Start validation
                setUploadedFile((prev) =>
                    prev
                        ? {
                            ...prev,
                            status: "validating",
                            progress: 0,
                        }
                        : null,
                )

                // Step 3: Validate document
                const validationResult = await validateDocument(
                    uploadResult.fileId!,
                    file.name,
                    mockKnowledgeBase.id,
                    (progress) => {
                        setUploadedFile((prev) => (prev ? { ...prev, progress } : null))
                    },
                )

                // Step 4: Complete validation
                setUploadedFile((prev) =>
                    prev
                        ? {
                            ...prev,
                            status: validationResult.isValid ? "valid" : "invalid",
                            progress: 100,
                            validationResults: validationResult,
                        }
                        : null,
                )
            } catch (error) {
                setUploadedFile((prev) =>
                    prev
                        ? {
                            ...prev,
                            status: "error",
                            validationResults: {
                                isValid: false,
                                confidence: 0,
                                reasons: [],
                                error: "Lỗi hệ thống",
                                errorCode: "SYSTEM_ERROR",
                            },
                        }
                        : null,
                )
            } finally {
                setIsProcessing(false)
            }
        },
        [mockKnowledgeBase.id],
    )

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (file) {
                processFileUpload(file)
            }
        },
        [processFileUpload],
    )

    const handleFileUpload = useCallback(() => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".pdf,.docx,.txt"
        input.onchange = (e) => handleFileSelect(e as any)
        input.click()
    }, [handleFileSelect])

    const handleGoBack = useCallback(() => {
        router.push(`/admin/train-ai/knowledge-base/${id}`)
    }, [id, router])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragOver(false)

            const files = e.dataTransfer.files
            if (files.length > 0) {
                processFileUpload(files[0])
            }
        },
        [processFileUpload],
    )

    const handleAddToKB = useCallback(() => {
        if (!uploadedFile) return

        setIsProcessing(true)

        // Simulate adding to KB
        setTimeout(() => {
            setIsProcessing(false)
            // Navigate back to main page or show success message
            router.push(`/admin/train-ai/knowledge-base/${id}`)
        }, 1500)
    }, [uploadedFile, id, router])

    const handleReset = useCallback(() => {
        setUploadedFile(null)
        setIsProcessing(false)
    }, [])

    const canAddToKB = uploadedFile && (uploadedFile.status === "valid" || uploadedFile.status === "invalid")

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header
                knowledgeBase={mockKnowledgeBase}
                canAddToKB={!!canAddToKB}
                uploadedFile={uploadedFile}
                isProcessing={isProcessing}
                onGoBack={handleGoBack}
                onAddToKB={handleAddToKB}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Area */}
                <div className="lg:col-span-1">
                    <UploadArea
                        uploadedFile={uploadedFile}
                        isDragOver={isDragOver}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onFileUpload={handleFileUpload}
                    />

                    <ValidationInfo />
                </div>

                {/* File Display */}
                <div className="lg:col-span-2">
                    <FileDisplay
                        uploadedFile={uploadedFile}
                        onAddToKB={handleAddToKB}
                        onReset={handleReset}
                        isProcessing={isProcessing}
                    />
                </div>
            </div>
        </div>
    )
}

export default UploadPage

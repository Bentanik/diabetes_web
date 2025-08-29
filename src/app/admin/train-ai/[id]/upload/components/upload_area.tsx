'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadIcon, FileText } from "lucide-react"

interface UploadAreaProps {
    isDragOver: boolean
    onDragOver: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
    onFileUpload: () => void
    job: API.TJob | null
    fileCount?: number
}

export default function UploadArea({
    isDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileUpload,
    job,
    fileCount = 0,
}: UploadAreaProps) {
    const isDisabled = job !== null

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg text-[#248fca]">Tải tài liệu</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
            ${isDisabled
                            ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                            : isDragOver
                                ? "border-[#248fca] bg-blue-50"
                                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                    onDragOver={isDisabled ? undefined : onDragOver}
                    onDragLeave={isDisabled ? undefined : onDragLeave}
                    onDrop={isDisabled ? undefined : onDrop}
                >
                    <UploadIcon className={`w-12 h-12 mx-auto mb-4 ${isDisabled ? "text-gray-300" : "text-gray-400"}`} />
                    <h3 className={`text-lg font-medium mb-2 ${isDisabled ? "text-gray-500" : "text-gray-900"}`}>
                        {isDisabled ? "Đang xử lý tài liệu..." : "Kéo thả tài liệu vào đây"}
                    </h3>
                    {!isDisabled && <p className="text-sm text-gray-500 mb-4">hoặc</p>}
                    <Button
                        className="bg-[#248fca] hover:bg-[#248fca]/80"
                        onClick={onFileUpload}
                        disabled={isDisabled}
                    >
                        Chọn tài liệu
                    </Button>

                    {/* File count display */}
                    {fileCount > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-center gap-2 text-[#248fca]">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {fileCount} tài liệu đã được chọn
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Improved file types display */}
                    <div className="mt-4 space-y-1">
                        <p className="text-sm text-gray-600 font-medium">
                            Định dạng hỗ trợ: PDF, DOCX, TXT
                        </p>
                        <p className="text-xs text-gray-500">
                            Bạn có thể chọn nhiều tài liệu cùng lúc
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
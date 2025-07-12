'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadIcon } from "lucide-react"

interface UploadAreaProps {
    isDragOver: boolean
    onDragOver: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
    onFileUpload: () => void
    job: API.TJob | null
}

export default function UploadArea({
    isDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileUpload,
    job,
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
                </div>
            </CardContent>
        </Card>
    )
}

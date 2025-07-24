import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFileIcon } from "@/utils/file";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

type FileUploadCardProps = {
    uploadingFile: File | null;
    uploadProgress: number;
    job: API.TJob | null;
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case "completed":
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Hoàn thành
                </Badge>
            )
        case "processing":
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Đang xử lý
                </Badge>
            )
        case "queued":
            return (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Đang chờ
                </Badge>
            )
        case "failed":
            return (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Thất bại
                </Badge>
            )
        default:
            return null
    }
}

const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB"
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`
}

export default function FileUploadCard({
    uploadingFile,
    uploadProgress,
    job,
}: FileUploadCardProps) {
    // Đang upload lên
    if (uploadingFile) {
        return (
            <Card className="overflow-hidden border-2 border-dashed border-[#248fca]/30 shadow-sm bg-gradient-to-br from-[#f8fcff] to-white">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        {/* File Icon */}
                        <div className="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm border border-[#248fca]/20">
                            {getFileIcon(uploadingFile.type)}
                        </div>

                        {/* Upload Info */}
                        <div className="flex-1 min-w-0">
                            {/* File name */}
                            <div className="font-semibold text-lg text-gray-900 truncate mb-1">
                                {uploadingFile.name}
                            </div>

                            {/* File size */}
                            <div className="text-sm text-gray-500 mb-3">
                                {formatFileSize(uploadingFile.size)}
                            </div>

                            {/* Progress */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#248fca]">Đang tải lên</span>
                                    <span className="text-sm font-medium text-[#248fca]">{uploadProgress}%</span>
                                </div>
                                <Progress
                                    value={uploadProgress}
                                    className="h-2 rounded-full bg-[#e7f3fa] [&_[data-slot=progress-indicator]]:bg-[#248fca]"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Đang xử lý job
    if (job && (job.status === "processing" || job.status === "queued" || job.status === "completed")) {
        return (
            <Card className="overflow-hidden border-2 border-gray-200 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        {/* File Icon */}
                        <div className="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                            {getFileIcon(job.file_type)}
                        </div>

                        {/* Job Info */}
                        <div className="flex-1 min-w-0 space-y-3">
                            {/* Header: Title + Status */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    {/* Title - Tên tài liệu chính */}
                                    <h4 className="font-semibold text-lg text-gray-900 truncate mb-1">
                                        {job.title || job.file_name}
                                    </h4>

                                    {/* File name - Tên file gốc (nếu khác title) */}
                                    {job.title && job.title !== job.file_name && (
                                        <p className="text-sm text-gray-500 truncate">
                                            <span className="font-medium">File:</span> {job.file_name}
                                        </p>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <div className="flex-shrink-0">
                                    {getStatusBadge(job.status)}
                                </div>
                            </div>

                            {/* Progress Section */}
                            {job.status !== "completed" && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Tiến độ xử lý</span>
                                        <span className="text-sm font-medium text-gray-700">{job.progress || 0}%</span>
                                    </div>
                                    <Progress
                                        value={job.progress || 0}
                                        className="h-2 rounded-full bg-[#e7f3fa] [&_[data-slot=progress-indicator]]:bg-[#248fca]"
                                    />
                                    {job.current_step && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {job.current_step}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Completed Info */}
                            {job.status === "completed" && (
                                <div className="text-sm text-green-600 font-medium">
                                    ✓ Xử lý hoàn tất
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return null;
}

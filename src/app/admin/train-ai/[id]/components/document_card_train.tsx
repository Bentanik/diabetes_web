"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    ClockIcon,
    LoaderIcon,
    CheckCircleIcon,
    XCircleIcon,
    CalendarIcon,
    ArchiveIcon,
} from "lucide-react"
import { getFileIcon, formatFileSize } from "@/utils/file"

type DocumentCardTrainProps = {
    job: API.TJob
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'processing':
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <LoaderIcon className="w-3 h-3 mr-1 animate-spin" />
                    Đang xử lý
                </Badge>
            );
        case 'completed':
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    Hoàn thành
                </Badge>
            );
        case 'failed':
            return (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    Thất bại
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    Chờ xử lý
                </Badge>
            );
    }
};

export const DocumentCardTrain = ({ job }: DocumentCardTrainProps) => {
    const fileIcon = getFileIcon(job.file.file_type);

    return (
        <div className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded">
                    {fileIcon}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-gray-900 truncate">
                            {job.file.file_name}
                        </h3>
                        {getStatusBadge(job.status.status)}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                            <ArchiveIcon className="w-3 h-3 mr-1" />
                            {formatFileSize(job.file.file_size_bytes)}
                        </Badge>

                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {formatDate(job.created_at)}
                        </Badge>

                    </div>

                    {job.status.status === 'processing' && (
                        <div className="mt-3">
                            <Progress value={job.status.progress || 0} className="h-1" />
                            <p className="mt-1 text-xs text-gray-500">
                                Đang xử lý: {job.status.progress || 0}%
                            </p>
                        </div>
                    )}

                    {job.status.progress_message && (
                        <p className="mt-2 text-sm text-blue-600">
                            Tiến trình: {job.status.progress_message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};


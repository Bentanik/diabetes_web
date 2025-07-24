"use client"

import { Progress } from "@/components/ui/progress"
import {
    FileIcon,
    InfoIcon,
    ClockIcon,
    LoaderIcon,
    AlertCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "lucide-react"
import { getFileIcon } from "@/utils/file"

type DocumentCardTrainProps = {
    job: API.TJob
}

export default function DocumentCardTrain({ job }: DocumentCardTrainProps) {
    const isTraining = job.type === 'training'
    const isQueued = job.status === 'queued'
    const isFailed = job.status === 'failed'
    const isCompleted = job.status === 'completed'

    return (
        <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#248fca]/30">

            {/* Main Content */}
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center relative">
                            {getFileIcon(job.file_type)}
                            {/* Status indicator */}
                            {isTraining && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#248fca] rounded-full flex items-center justify-center">
                                    <LoaderIcon className="w-2.5 h-2.5 text-white animate-spin" />
                                </div>
                            )}
                            {isCompleted && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckCircleIcon className="w-2.5 h-2.5 text-white" />
                                </div>
                            )}
                            {isFailed && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <XCircleIcon className="w-2.5 h-2.5 text-white" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Title Row */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                                    {job.title || job.file_name}
                                </h3>
                                {job.title && job.title !== job.file_name && (
                                    <div className="flex items-center gap-1 text-sm text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                        <FileIcon className="w-3.5 h-3.5" />
                                        <span className="truncate max-w-24">{job.file_name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2 ml-3">
                                {isTraining && (
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${isQueued
                                        ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                                        : "bg-blue-50 text-blue-600 border border-blue-200"
                                        }`}>
                                        {isQueued ? (
                                            <ClockIcon className="w-4 h-4" />
                                        ) : (
                                            <LoaderIcon className="w-4 h-4 animate-spin" />
                                        )}
                                        {isQueued ? "Đang chờ" : "Đang xử lý"}
                                    </div>
                                )}

                                {isCompleted && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-600 border border-green-200">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Hoàn thành
                                    </div>
                                )}

                                {isFailed && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-600 border border-red-200">
                                        <XCircleIcon className="w-4 h-4" />
                                        Thất bại
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {job.description && (
                            <div className="flex items-start gap-2 mb-4">
                                <InfoIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                    {job.description}
                                </p>
                            </div>
                        )}

                        {/* Training Progress */}
                        {isTraining && (
                            <div className="mb-4 p-3 bg-[#f8fcff] border border-[#e7f3fa] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#248fca]">
                                        Tiến độ huấn luyện
                                    </span>
                                    <span className="text-sm font-medium text-[#248fca]">
                                        {job.progress}%
                                    </span>
                                </div>

                                <Progress
                                    value={job.progress}
                                    className="h-2 rounded-full bg-[#e7f3fa] [&_[data-slot=progress-indicator]]:bg-[#248fca] mb-2"
                                />

                                {job.current_step && (
                                    <p className="text-xs text-gray-600">
                                        {job.current_step}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Error Message */}
                        {isFailed && job.error_message && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertCircleIcon className="w-4 h-4 text-red-500" />
                                    <span className="text-sm font-medium text-red-700">
                                        Lỗi huấn luyện
                                    </span>
                                </div>
                                <p className="text-xs text-red-600">
                                    {job.error_message}
                                </p>
                            </div>
                        )}

                        {/* Rejection Reason */}
                        {job.rejection_reason && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <InfoIcon className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-yellow-700">
                                        Lý do từ chối
                                    </span>
                                </div>
                                <p className="text-xs text-yellow-600">
                                    {job.rejection_reason}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

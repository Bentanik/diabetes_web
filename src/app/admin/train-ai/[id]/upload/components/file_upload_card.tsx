import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { getFileIcon } from "@/utils/file";

type FileUploadCardProps = {
    uploadingFile: File | null;
    uploadProgress: number;
    job: API.TJob | null;
};

export default function FileUploadCard({
    uploadingFile,
    uploadProgress,
    job,
}: FileUploadCardProps) {
    // Đang upload lên
    if (uploadingFile) {
        return (
            <Card className="overflow-hidden border-2 border-gray-200 shadow-sm">
                <CardContent className="p-0">
                    <div className="space-y-4">
                        <div className="p-6 pb-2">
                            <div className="font-semibold text-lg text-[#248fca] truncate">
                                {uploadingFile.name}
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-[#248fca]">Đang tải lên</span>
                                <span className="text-sm text-[#248fca]">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="rounded-full bg-[#e7f3fa] [&_[data-slot=progress-indicator]]:bg-[#248fca]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Đang xử lý job
    if (job && (job.status === "processing" || job.status === "queued" || job.status === "completed")) {
        return (
            <Card className="overflow-hidden border-2 border-gray-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                    {/* File Icon */}
                    <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                        {getFileIcon(job.file_type)}
                    </div>

                    {/* Job Info and Progress */}
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg text-gray-900 truncate mb-1">{job.file_name}</div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Tiến độ xử lý</span>
                            <span className="text-sm text-gray-500 font-medium">{job.progress}%</span>
                        </div>
                        <Progress
                            value={job.progress}
                            className="rounded-full h-2 bg-[#e7f3fa] [&_[data-slot=progress-indicator]]:bg-[#248fca]"
                        />
                        <div className="text-xs text-gray-500 mt-2">{job.current_step || "Đang xử lý..."}</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return null;
}
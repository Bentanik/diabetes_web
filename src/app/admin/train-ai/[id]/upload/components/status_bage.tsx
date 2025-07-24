'use client'

import { RefreshCwIcon } from "lucide-react";

interface StatusInfo {
    label: string;
    color: string;
    icon: React.ReactNode;
}

interface StatusBadgeProps {
    status: string;
}

const getStatusInfo = (status: string): StatusInfo => {
    switch (status) {
        case "uploading":
            return {
                label: "Đang tải lên",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: <RefreshCwIcon className="w-3 h-3 animate-spin" />,
            };
        case "uploaded":
            return {
                label: "Đã tải lên",
                color: "bg-green-100 text-green-800 border-green-200",
                icon: <RefreshCwIcon className="w-3 h-3" />,
            };
        default:
            return {
                label: "Không xác định",
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: <RefreshCwIcon className="w-3 h-3" />,
            };
    }
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const statusInfo = getStatusInfo(status);
    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
        >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
        </div>
    );
};

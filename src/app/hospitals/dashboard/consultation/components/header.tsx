import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Header() {
    return (
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
            <div>
                <div className="flex items-center gap-5">
                    <Link href={`/hospitals/doctor`}>
                        <ArrowLeft color="#248fca" />
                    </Link>

                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Quản lý tiền và lượt tư vấn
                    </h1>
                </div>
                <p className="text-gray-600 mt-1 ml-11 text-sm">
                    Thống kê doanh thu và quản lý cuộc tư vấn của bác sĩ
                </p>
            </div>
        </div>
    );
}

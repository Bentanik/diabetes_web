"use client";

import React from "react";
import CreateHospitalStaffForm from "./create-hospital-staff-form";
// import { Button } from "@/components/ui/button";
// import { BarChartIcon, BellIcon, Plus, ArrowLeft } from "lucide-react";
// import Link from "next/link";

export default function CreateHospitalStaffComponent() {
    const Header = () => {
        return (
            <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
                <div>
                    <div className="flex items-center gap-5">
                        {/* <Link href="/hospitals/doctor">
                            <ArrowLeft color="#248fca" />
                        </Link> */}

                        <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                            Thêm nhân viên bệnh viện
                        </h1>
                    </div>
                    <p className="text-gray-600 mt-1 text-sm">
                        Thêm thông tin tạo nhân viên mới
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div>
            <header>
                <Header />
            </header>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
                <CreateHospitalStaffForm />
            </div>
        </div>
    );
}

"use client";

import React from "react";
import CreateHospitalForm from "./create-hospital-form";
import { Button } from "@/components/ui/button";
import { BarChartIcon, BellIcon, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateHospitalComponent() {
    const Header = () => {
        return (
            <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
                <div>
                    <div className="flex items-center gap-5">
                        <Link href="/hospital/doctor">
                            <ArrowLeft color="#248fca" />
                        </Link>

                        <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                            Thêm bác sĩ
                        </h1>
                    </div>
                    <p className="text-gray-600 mt-1 text-sm ml-11">
                        Thêm thông tin tạo bác sĩ mới
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
                <CreateHospitalForm blogId="" />
            </div>
        </div>
    );
}

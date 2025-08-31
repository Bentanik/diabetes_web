import React from "react";
import { Metadata } from 'next';
import HomeHospitalComponent from "@/app/hospitals/home/components";

export const metadata: Metadata = {
    title: "Trang chủ Bệnh viện",
    description: "Quản lý và điều hành bệnh viện",
};

export default function HomeHospital() {
    return (
        <div>
            <HomeHospitalComponent />
        </div>
    );
}

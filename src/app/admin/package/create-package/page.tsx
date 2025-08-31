import React from "react";
import { Metadata } from 'next';
import CreatePackage from "./components";

export const metadata: Metadata = {
    title: "Tạo Gói dịch vụ",
    description: "Tạo mới gói dịch vụ cho bệnh viện",
};

export default function CreatePackagePage() {
    return (
        <div>
            <CreatePackage />
        </div>
    );
}

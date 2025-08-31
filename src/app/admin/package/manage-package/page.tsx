import React from "react";
import { Metadata } from 'next';
import ManagePackage from "./components";

export const metadata: Metadata = {
    title: "Quản lý Gói dịch vụ",
    description: "Quản lý và điều chỉnh các gói dịch vụ",
};

export default function ManagePackagePage() {
    return (
        <div>
            <ManagePackage />
        </div>
    );
}

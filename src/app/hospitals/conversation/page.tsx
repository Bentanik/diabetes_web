import React from "react";
import { Metadata } from 'next';
import GroupHospitalComponent from "./components";

export const metadata: Metadata = {
    title: "Quản lý Nhóm Chat",
    description: "Quản lý các nhóm chat và hội thoại",
};

export default function ManageGroupPage() {
    return (
        <div>
            <GroupHospitalComponent />
        </div>
    );
}

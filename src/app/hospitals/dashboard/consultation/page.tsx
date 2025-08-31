import React from "react";
import { Metadata } from 'next';
import ManageConsultation from "./components";

export const metadata: Metadata = {
    title: "Quản lý Tư vấn",
    description: "Quản lý các cuộc tư vấn và đặt lịch",
};

export default function ManageConsultationPage() {
    return (
        <div>
            <ManageConsultation />
        </div>
    );
}

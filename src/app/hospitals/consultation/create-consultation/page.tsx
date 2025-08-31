import React from "react";
import { Metadata } from 'next';
import CreateDoctorSchedule from "./components";

export const metadata: Metadata = {
    title: "Tạo Lịch Tư vấn",
    description: "Tạo mới lịch tư vấn với bác sĩ",
};

export default function CreateConsultationPage() {
    return (
        <div>
            <CreateDoctorSchedule />
        </div>
    );
}

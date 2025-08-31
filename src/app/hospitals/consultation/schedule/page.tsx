import React from "react";
import { Metadata } from 'next';
import DoctorSchedule from "./components";

export const metadata: Metadata = {
    title: "Lịch Bác sĩ",
    description: "Xem và quản lý lịch làm việc của bác sĩ",
};

export default function Doctor() {
    return (
        <div>
            <DoctorSchedule />
        </div>
    );
}

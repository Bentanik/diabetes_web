import { Metadata } from 'next';
import EmployeeHospitalComponent from "@/app/hospitals/doctor/components";

export const metadata: Metadata = {
    title: "Tư vấn",
    description: "Đặt lịch và quản lý tư vấn với bác sĩ",
};

export default function EmployeeHospitalPage() {
    return (
        <div>
            <EmployeeHospitalComponent />
        </div>
    );
}

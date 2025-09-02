import { Metadata } from 'next';
import EmployeeHospitalComponent from "@/app/hospitals/doctor/components";

export const metadata: Metadata = {
    title: "Quản lý Bác sĩ",
    description: "Quản lý thông tin và lịch làm việc của bác sĩ",
};

export default function EmployeeHospitalPage() {
    return (
        <div>
            <EmployeeHospitalComponent />
        </div>
    );
}

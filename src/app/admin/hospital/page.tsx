import { Metadata } from 'next';
import ManageHospitalComponent from "@/app/admin/hospital/components";

export const metadata: Metadata = {
    title: "Quản lý Bệnh viện",
    description: "Quản lý thông tin và cài đặt bệnh viện",
};

export default function EmployeeHospitalPage() {
    return (
        <div>
            <ManageHospitalComponent />
        </div>
    );
}

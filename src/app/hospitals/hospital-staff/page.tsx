import { Metadata } from 'next';
import HospitalStaffComponent from "./components";

export const metadata: Metadata = {
    title: "Quản lý Nhân viên",
    description: "Quản lý nhân viên và cán bộ bệnh viện",
};

export default function HospitalStaffComponentPage() {
    return (
        <div>
            <HospitalStaffComponent />
        </div>
    );
}

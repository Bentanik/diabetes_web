import CreateHospitalComponent from "@/app/admin/hospitals/create-hospital/components";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Thêm bệnh viện",
    description: "Thêm bệnh viện mới",
}

export default function CreateHospitalPage() {
  return (
    <div>
        <CreateHospitalComponent/>
    </div>
  )
}

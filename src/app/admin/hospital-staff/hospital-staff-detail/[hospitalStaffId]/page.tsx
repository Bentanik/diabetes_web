import React from "react";
import DoctorDetailComponent from "../components";

type HospitalStaffDetailPageProps = {
    params: Promise<{
        hospitalStaffId: string;
    }>;
};

export default async function HospitalStaffDetailPage({
    params,
}: HospitalStaffDetailPageProps) {
    const { hospitalStaffId } = await params;

    return (
        <div>
            <DoctorDetailComponent hospitalStaffId={hospitalStaffId} />
        </div>
    );
}

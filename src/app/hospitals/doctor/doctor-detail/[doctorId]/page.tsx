import React from "react";
import DoctorDetailComponent from "../components";

type DoctorDetailPageProps = {
    params: Promise<{
        doctorId: string;
    }>;
};

export default async function DoctorDetailPage({
    params,
}: DoctorDetailPageProps) {
    const { doctorId } = await params;

    return (
        <div>
            <DoctorDetailComponent doctorId={doctorId} />
        </div>
    );
}

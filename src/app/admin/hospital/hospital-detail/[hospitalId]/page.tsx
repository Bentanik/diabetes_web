import React from "react";
import HospitalDetailComponent from "../components";

type HospitalDetailPageProps = {
    params: Promise<{
        hospitalId: string;
    }>;
};

export default async function HospitalDetailPage({
    params,
}: HospitalDetailPageProps) {
    const { hospitalId } = await params;

    return (
        <div>
            <HospitalDetailComponent hospitalId={hospitalId} />
        </div>
    );
}

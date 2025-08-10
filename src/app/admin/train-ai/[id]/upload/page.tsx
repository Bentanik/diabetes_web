import UploadPageComponent from "@/app/admin/train-ai/[id]/upload/components"
import { Metadata } from "next"
import { use } from "react";

export const metadata: Metadata = {
    title: "Tải lên tài liệu",
    description: "Tải lên tài liệu",
}

type UploadPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default function UploadPage({ params }: UploadPageProps) {
    const { id } = use(params);
    return (
        <UploadPageComponent id={id} />
    )
}

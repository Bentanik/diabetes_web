import UploadPageComponent from "@/app/admin/train-ai/[id]/upload/components"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Tải lên tài liệu",
    description: "Tải lên tài liệu",
}

export default function UploadPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <UploadPageComponent params={params} />
    )
}

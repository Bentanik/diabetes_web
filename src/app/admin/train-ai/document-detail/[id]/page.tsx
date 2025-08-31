import { Metadata } from 'next';
import DocumentDetailComponent from "@/app/admin/train-ai/document-detail/[id]/components";
import { use } from "react";

export const metadata: Metadata = {
    title: "Chi tiết Tài liệu",
    description: "Xem và quản lý chi tiết tài liệu huấn luyện AI",
};

export default function DocumentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    return (
        <div>
            <DocumentDetailComponent id={id} />
        </div>
    );
}

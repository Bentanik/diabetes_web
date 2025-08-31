import { Metadata } from 'next';
import KnowledgeBaseDetail from "@/app/admin/train-ai/[id]/components"
import { use } from "react"

export const metadata: Metadata = {
    title: "Chi tiết Cơ sở Kiến thức",
    description: "Xem và quản lý chi tiết cơ sở kiến thức AI",
};

export default function KnowledgeBaseDetailPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = use(params)
    return (
        <div>
            <KnowledgeBaseDetail id={id} />
        </div>
    )
}

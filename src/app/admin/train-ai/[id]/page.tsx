import KnowledgeBaseDetail from "@/app/admin/train-ai/[id]/components"
import { use } from "react"

export default function KnowledgeBaseDetailPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = use(params)
    return (
        <div>
            <KnowledgeBaseDetail id={id} />
        </div>
    )
}

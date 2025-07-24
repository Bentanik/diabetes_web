"use client"

import DocumentMain from "@/app/admin/train-ai/[id]/components/document_main"
import { LoadingSkeleton } from "@/app/admin/train-ai/[id]/components/document_main_skeleton"
import Header from "@/app/admin/train-ai/[id]/components/header"
import { useGetKnowledgeBaseByIdService } from "@/services/train-ai/services"

interface KnowledgeBaseDetailProps {
    id: string
}


export default function KnowledgeBaseDetail({ id }: KnowledgeBaseDetailProps) {
    const { data: knowledgeBase } = useGetKnowledgeBaseByIdService(id)

    if (!knowledgeBase) {
        return <LoadingSkeleton />
    }

    return (
        <div>
            <Header knowledgeBase={knowledgeBase} />

            <main>
                <DocumentMain knowledgeBaseId={id} />
            </main>
        </div>
    )
}

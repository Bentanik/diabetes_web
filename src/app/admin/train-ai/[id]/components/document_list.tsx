"use client"

import { motion } from "framer-motion"
import DocumentCard from "@/app/admin/train-ai/[id]/components/document_card"
import DocumentListSkeleton from "@/app/admin/train-ai/[id]/components/document_skeleton"
import DocumentEmptyState from "@/app/admin/train-ai/[id]/components/document_empty"
import Pagination from "@/components/shared/pagination"

type DocumentListProps = {
    knowledgeBaseId: string
    isPending: boolean
    documentsData: API.TGetKnowledgeBaseDocumentsResponse
    document_limit: number
    onPageChange: (page: number) => void
}

export default function DocumentList({
    knowledgeBaseId,
    documentsData,
    isPending,
    document_limit,
    onPageChange,
}: DocumentListProps) {

    if (isPending) {
        return <DocumentListSkeleton />
    }

    if (documentsData.documents.length === 0) {
        return <DocumentEmptyState
            knowledgeBaseId={knowledgeBaseId}
            isSearching={false}
            searchQuery=""
            statusFilter="all"
            onClearSearch={() => { }}
            onClearFilter={() => { }}
        />
    }



    return (
        <div className="space-y-6">
            {/* Document Grid */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-4"
                >
                    {documentsData.documents.map((document, index) => (
                        <motion.div
                            key={document.id || index} // Sử dụng document.id thay vì index
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <DocumentCard document={document} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <div>
                <Pagination
                    currentPage={documentsData.page}
                    totalPages={documentsData.total_pages}
                    totalItems={documentsData.total}
                    perPage={document_limit}
                    hasNext={documentsData.total_pages > documentsData.page}
                    hasPrev={documentsData.page > 1}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}
"use client"

import { motion } from "framer-motion"
import DocumentCard from "@/app/admin/train-ai/[id]/components/document_card"
import DocumentListSkeleton from "@/app/admin/train-ai/[id]/components/document_skeleton"
import DocumentEmptyState from "@/app/admin/train-ai/[id]/components/document_empty"
import Pagination from "@/components/shared/pagination"

type DocumentListProps = {
    knowledgeBaseId: string
    isPending: boolean
    documentsData: TPagination<API.TDocument>
    onPageChange: (page: number) => void
    onPerPageChange: (perPage: number) => void
}

export default function DocumentList({
    knowledgeBaseId,
    documentsData,
    isPending,
    onPageChange,
    onPerPageChange,
}: DocumentListProps) {

    if (isPending) {
        return <DocumentListSkeleton />
    }

    if (documentsData.items.length === 0) {
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
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 justify-center w-full"
                >
                    {documentsData.items.map((document) => (
                        <DocumentCard key={document.id} document={document} />
                    ))}
                </motion.div>
            </div>
            {documentsData.total_pages > 1 && (
                <Pagination
                    currentPage={documentsData.page}
                    totalPages={documentsData.total_pages}
                    totalItems={documentsData.total}
                    perPage={documentsData.limit}
                    hasNext={documentsData.page < documentsData.total_pages}
                    hasPrev={documentsData.page > 1}
                    onPageChange={onPageChange}
                    perPageOptions={[12, 18, 24, 36, 48]}
                    onPerPageChange={onPerPageChange}
                />
            )}
        </div>
    )
}
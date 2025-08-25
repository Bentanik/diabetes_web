"use client"

import { motion } from "framer-motion"
import DocumentCard from "@/app/admin/train-ai/[id]/components/document_card"
import DocumentListSkeleton from "@/app/admin/train-ai/[id]/components/document_skeleton"
import DocumentEmptyState from "@/app/admin/train-ai/[id]/components/document_empty"
import Pagination from "@/components/shared/pagination"
import DeleteDocumentModal from "@/app/admin/train-ai/[id]/components/delete_document"
import { useState } from "react"
import EditDocumentModal from "@/app/admin/train-ai/[id]/upload/components/edit-document"

type DocumentListProps = {
    knowledgeBaseId: string
    isPending: boolean
    documentsData: TPagination<API.TDocument>
    onPageChange: (page: number) => void
    onPerPageChange: (perPage: number) => void
    onTrainSuccess?: () => void
    isSearching?: boolean
    searchQuery?: string
    onClearSearch?: () => void
}

export default function DocumentList({
    knowledgeBaseId,
    documentsData,
    isPending,
    onPageChange,
    onPerPageChange,
    onTrainSuccess = () => { },
    isSearching = false,
    searchQuery = "",
    onClearSearch = () => { },
}: DocumentListProps) {
    const [isDeleteDocumentOpen, setIsDeleteDocumentOpen] = useState(false);
    const [deleteDocument, setDeleteDocument] = useState<API.TDocument | null>(null);
    const [isEditDocumentModalOpen, setIsEditDocumentModalOpen] = useState(false);
    const [editDocument, setEditDocument] = useState<API.TDocument | null>(null);

    const handleCloseDeleteDocument = () => {
        setIsDeleteDocumentOpen(false);
    };

    const handleDeleteDocument = (document: API.TDocument) => {

        setDeleteDocument(document);
        setIsDeleteDocumentOpen(true);
    };

    const handleEditDocument = (document: API.TDocument) => {
        setEditDocument(document);
        setIsEditDocumentModalOpen(true);
    };

    const handleCloseEditDocument = () => {
        setIsEditDocumentModalOpen(false);
        setEditDocument(null);
    };


    if (isPending) {
        return <DocumentListSkeleton />
    }


    if (documentsData.items.length === 0) {
        return <DocumentEmptyState
            knowledgeBaseId={knowledgeBaseId}
            isSearching={isSearching}
            searchQuery={searchQuery}
            onClearSearch={onClearSearch}
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
                    className="flex flex-wrap gap-4"
                >
                    {documentsData.items.map((document) => (
                        <DocumentCard
                            key={document.id}
                            document={document}
                            onTrainSuccess={onTrainSuccess}
                            onDelete={handleDeleteDocument}
                            onEdit={handleEditDocument}
                        />
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
            {deleteDocument && (
                <DeleteDocumentModal
                    isOpen={isDeleteDocumentOpen}
                    onClose={handleCloseDeleteDocument}
                    document={deleteDocument}
                />
            )}

            {editDocument && (
                <EditDocumentModal
                    isOpen={isEditDocumentModalOpen}
                    onClose={handleCloseEditDocument}
                    document={editDocument}
                />)}
        </div>
    )
}
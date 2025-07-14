// app/admin/train-ai/[id]/components/main-content.tsx
"use client"

import { useState } from "react"
import DocumentList from "@/app/admin/train-ai/[id]/components/document_list"
import DocumentSearch from "@/app/admin/train-ai/[id]/components/document_search"
import { useGetKnowledgeBaseDocumentsService } from "@/services/train-ai/services"
import { useDebounce } from "@/hooks/use-debounce"

type DocumentMainProps = {
    knowledgeBaseId: string
}

export default function DocumentMain({ knowledgeBaseId }: DocumentMainProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "failed">("all")
    const ITEMS_PER_PAGE = 6

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const { data, isPending } = useGetKnowledgeBaseDocumentsService(knowledgeBaseId, {
        search_name: debouncedSearchTerm,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sort_by: "updated_at",
        sort_order: "desc",
    })

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1) // Reset về trang đầu khi search
    }

    const handleStatusFilterChange = (status: "all" | "completed" | "failed") => {
        setStatusFilter(status)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <div className="space-y-6">
            {/* Search và Filter Section */}
            <DocumentSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
                totalCount={data?.total || 0}
                isSearching={debouncedSearchTerm.length > 0}
                searchQuery={debouncedSearchTerm}
            />

            {/* Document List */}
            {data && <DocumentList knowledgeBaseId={knowledgeBaseId} isPending={isPending} documentsData={data} onPageChange={handlePageChange} />}
        </div>
    )
}

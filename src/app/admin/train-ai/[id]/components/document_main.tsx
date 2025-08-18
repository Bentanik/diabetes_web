"use client"

import { useEffect, useState } from "react"
import DocumentList from "@/app/admin/train-ai/[id]/components/document_list"
import DocumentSearch from "@/app/admin/train-ai/[id]/components/document_search"
import { useGetDocumentsService } from "@/services/train-ai/services"
import { useDebounce } from "@/hooks/use-debounce"
import { FileTextIcon, BrainIcon } from "lucide-react"
import { useGetJobDocumentHistoryService } from "@/services/job/services"
import { DocumentCardTrain } from "@/app/admin/train-ai/[id]/components/document_card_train"

type DocumentMainProps = {
    knowledgeBaseId: string
}

export default function DocumentMain({ knowledgeBaseId }: DocumentMainProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "failed" | "processing" | "queued">("all")
    const [activeTab, setActiveTab] = useState<"documents" | "training">("documents")
    const [itemsPerPage, setItemsPerPage] = useState(12)

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    // API call cho documents
    const { data: documentsData, isPending: isDocumentsPending, refetch: refetchDocuments } = useGetDocumentsService(knowledgeBaseId, {
        search: debouncedSearchTerm,
        page: currentPage,
        limit: itemsPerPage,
        sort_by: "updated_at",
        sort_order: "desc",
    })

    const {
        data: trainingData,
        isPending: isTrainingPending,
        refetch: refetchTraining
    } = useGetJobDocumentHistoryService({
        page: currentPage,
        limit: itemsPerPage,
        sort_by: "created_at",
        sort_order: "desc",
        search: debouncedSearchTerm,
        type: "training_document",
        status: "processing",
        enabled: activeTab === "training",
        knowledge_id: knowledgeBaseId,
    })

    useEffect(() => {
        if (activeTab === "documents") {
            refetchDocuments()
        } else if (activeTab === "training") {
            refetchTraining()
        }
    }, [activeTab, refetchDocuments, refetchTraining])

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleStatusFilterChange = (status: "all" | "completed" | "failed" | "processing" | "queued") => {
        setStatusFilter(status)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePerPageChange = (perPage: number) => {
        setItemsPerPage(perPage)
        setCurrentPage(1)
    }

    const handleTrainSuccess = () => {
        refetchDocuments()
    }

    const handleTabChange = (value: "documents" | "training") => {
        setActiveTab(value)
        setCurrentPage(1)
        setSearchTerm("")
        setStatusFilter("all")
    }

    // Tính toán training count
    const trainingCount = trainingData?.total || 0

    return (
        <div className="space-y-6">
            {/* Custom Tabs Section */}
            <div className="w-full">
                {/* Tab List */}
                <div className="grid grid-cols-2 lg:w-[400px] rounded-lg bg-[#248fca] p-1">
                    <button
                        onClick={() => handleTabChange("documents")}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "documents"
                                ? "bg-white text-[#248fca] shadow-sm"
                                : "text-white hover:text-orange-100"
                        }`}
                    >
                        <FileTextIcon className="w-4 h-4" />
                        Tài liệu
                    </button>
                    <button
                        onClick={() => handleTabChange("training")}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "training"
                                ? "bg-white text-[#248fca] shadow-sm"
                                : "text-white hover:text-orange-100"
                        }`}
                    >
                        <BrainIcon className="w-4 h-4" />
                        Đang huấn luyện
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {/* Documents Tab Content */}
                    {activeTab === "documents" && (
                        <div className="space-y-6">
                            {/* Search và Filter Section cho Documents */}
                            <DocumentSearch
                                searchTerm={searchTerm}
                                onSearchChange={handleSearchChange}
                                statusFilter={statusFilter}
                                onStatusFilterChange={handleStatusFilterChange}
                                totalCount={documentsData?.total || 0}
                                isSearching={debouncedSearchTerm.length > 0}
                                searchQuery={debouncedSearchTerm}
                                isTrainingTab={false}
                            />

                            {/* Document List */}
                            {documentsData && (
                                <DocumentList
                                    knowledgeBaseId={knowledgeBaseId}
                                    isPending={isDocumentsPending}
                                    documentsData={documentsData}
                                    onPageChange={handlePageChange}
                                    onPerPageChange={handlePerPageChange}
                                    onTrainSuccess={handleTrainSuccess}
                                />
                            )}
                        </div>
                    )}

                    {/* Training Tab Content */}
                    {activeTab === "training" && (
                        <div>
                            {/* Search và Filter Section cho Training Jobs */}
                            <DocumentSearch
                                searchTerm={searchTerm}
                                onSearchChange={handleSearchChange}
                                statusFilter={statusFilter}
                                onStatusFilterChange={handleStatusFilterChange}
                                totalCount={trainingCount}
                                isSearching={debouncedSearchTerm.length > 0}
                                searchQuery={debouncedSearchTerm}
                                isTrainingTab={true}
                            />

                            {/* Training Jobs List */}
                            <div className="mt-6">
                                {isTrainingPending ? (
                                    <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm">
                                        <div className="text-center">
                                            <div className="w-8 h-8 mx-auto mb-4 border-2 border-[#248fca] border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-500">Đang tải dữ liệu huấn luyện...</p>
                                        </div>
                                    </div>
                                ) : trainingData && trainingData.items.length > 0 ? (
                                    <div className="w-full max-w-full overflow-hidden">
                                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm w-full max-w-full overflow-hidden">
                                            <div className="space-y-4">
                                                {trainingData.items.map((job: API.TJob, index: number) => (
                                                    <DocumentCardTrain key={index} job={job} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm">
                                        <div className="text-center text-gray-500">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-[#248fca]/10 rounded-full flex items-center justify-center">
                                                <BrainIcon className="w-8 h-8 text-[#248fca]" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Không có công việc huấn luyện nào
                                            </h3>
                                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                                                Hiện tại không có công việc huấn luyện AI nào đang chạy.
                                                Các công việc huấn luyện sẽ hiển thị tại đây khi được khởi tạo.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
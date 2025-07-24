"use client"

import { useEffect, useState } from "react"
import DocumentList from "@/app/admin/train-ai/[id]/components/document_list"
import DocumentSearch from "@/app/admin/train-ai/[id]/components/document_search"
import { useGetKnowledgeBaseDocumentsService } from "@/services/train-ai/services"
import { useDebounce } from "@/hooks/use-debounce"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileTextIcon, BrainIcon } from "lucide-react"
import { useGetActiveTrainingJobService } from "@/services/job/services"
import DocumentCardTrain from "@/app/admin/train-ai/[id]/components/document_card_train"

type DocumentMainProps = {
    knowledgeBaseId: string
}

export default function DocumentMain({ knowledgeBaseId }: DocumentMainProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "failed" | "processing" | "queued">("all")
    const [activeTab, setActiveTab] = useState<"documents" | "training">("documents")
    const ITEMS_PER_PAGE = 3

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    // API call cho documents
    const { data: documentsData, isPending: isDocumentsPending, refetch: refetchDocuments } = useGetKnowledgeBaseDocumentsService(knowledgeBaseId, {
        search_name: debouncedSearchTerm,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sort_by: "updated_at",
        sort_order: "desc",
    })

    // API call cho training jobs - chỉ gọi khi activeTab là "training"
    const {
        jobs: trainingData,
        isPending: isTrainingPending,
        refetch: refetchTraining
    } = useGetActiveTrainingJobService({
        enabled: activeTab === "training"
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
        setCurrentPage(1) // Reset về trang đầu khi search
    }

    const handleStatusFilterChange = (status: "all" | "completed" | "failed" | "processing" | "queued") => {
        setStatusFilter(status)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleTabChange = (value: string) => {
        setActiveTab(value as "documents" | "training")
        setCurrentPage(1) // Reset page khi đổi tab
        setSearchTerm("") // Reset search khi đổi tab
        setStatusFilter("all") // Reset filter khi đổi tab
    }

    // Tính toán training count
    const trainingCount = trainingData?.length || 0

    return (
        <div className="space-y-6">
            {/* Tabs Section với màu chủ đạo */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger
                        value="documents"
                        className="flex items-center gap-2 data-[state=active]:bg-[#248fca] data-[state=active]:text-white 
                        data-[state=active]:shadow-sm transition-all duration-200 rounded-md py-2.5"
                    >
                        <FileTextIcon className="w-4 h-4" />
                        Tài liệu
                    </TabsTrigger>
                    <TabsTrigger
                        value="training"
                        className="flex items-center gap-2 data-[state=active]:bg-[#248fca] data-[state=active]:text-white 
                        data-[state=active]:shadow-sm transition-all duration-200 rounded-md py-2.5"
                    >
                        <BrainIcon className="w-4 h-4" />
                        Đang huấn luyện
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="documents" className="space-y-6 mt-6">
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
                            document_limit={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                        />
                    )}
                </TabsContent>

                <TabsContent value="training" className="space-y-6 mt-6">
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
                    {isTrainingPending ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm">
                            <div className="text-center">
                                <div className="w-8 h-8 mx-auto mb-4 border-2 border-[#248fca] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-500">Đang tải dữ liệu huấn luyện...</p>
                            </div>
                        </div>
                    ) : trainingData && trainingData.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="space-y-4">
                                {trainingData.map((job: API.TJob, index: number) => (
                                    <DocumentCardTrain key={index} job={job} />
                                ))}
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
                </TabsContent>
            </Tabs>
        </div>
    )
}

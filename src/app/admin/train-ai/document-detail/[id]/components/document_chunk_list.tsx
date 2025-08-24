import Pagination from '@/components/shared/pagination'
import { useGetDocumentChunksService } from '@/services/train-ai/services'
import React, { useState, useMemo } from 'react'

interface DocumentChunkListProps {
    id: string
}

export default function DocumentChunkList({ id }: DocumentChunkListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [diabetesScoreFilter, setDiabetesScoreFilter] = useState('all')
    const [showInactive, setShowInactive] = useState(false)
    const [expandedChunks, setExpandedChunks] = useState<Set<string>>(new Set())
    const [updatingChunks, setUpdatingChunks] = useState<Set<string>>(new Set())

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const handlePageChange = async (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (perPage: number) => {
        setItemsPerPage(perPage);
        setCurrentPage(1);
    };


    const { data: documentChunksData, refetch, isPending } = useGetDocumentChunksService(id, {
        page: currentPage,
        limit: itemsPerPage,
    })

    // Toggle expand/collapse for individual chunks
    const toggleExpand = (chunkId: string) => {
        const newExpanded = new Set(expandedChunks)
        if (newExpanded.has(chunkId)) {
            newExpanded.delete(chunkId)
        } else {
            newExpanded.add(chunkId)
        }
        setExpandedChunks(newExpanded)
    }

    // Toggle active status for chunk
    const toggleActiveStatus = async (chunkId: string, currentStatus: boolean) => {
        // Add to updating set
        setUpdatingChunks(prev => new Set(prev).add(chunkId))

        try {
            // TODO: Replace with your actual API call
            // await updateChunkActiveStatus(chunkId, !currentStatus)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800))

            console.log(`Toggling chunk ${chunkId} from ${currentStatus} to ${!currentStatus}`)

            // Refetch data after successful update
            await refetch()

        } catch (error) {
            console.error('Failed to update chunk status:', error)
            // TODO: Show error toast notification
        } finally {
            // Remove from updating set
            setUpdatingChunks(prev => {
                const newSet = new Set(prev)
                newSet.delete(chunkId)
                return newSet
            })
        }
    }

    // Filter logic
    const filteredChunks = useMemo(() => {
        if (!documentChunksData?.items) return []

        let filtered = documentChunksData.items

        // Filter by active status
        if (!showInactive) {
            filtered = filtered.filter(chunk => chunk.is_active)
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(chunk =>
                chunk.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Diabetes score filter
        if (diabetesScoreFilter !== 'all') {
            filtered = filtered.filter(chunk => {
                const score = parseFloat(chunk.diabetes_score)
                switch (diabetesScoreFilter) {
                    case 'high':
                        return score >= 0.8
                    case 'medium':
                        return score >= 0.5 && score < 0.8
                    case 'low':
                        return score < 0.5
                    case 'no-score':
                        return !chunk.diabetes_score || isNaN(score)
                    default:
                        return true
                }
            })
        }

        return filtered
    }, [documentChunksData?.items, searchQuery, diabetesScoreFilter, showInactive])

    const getScoreBadgeClasses = (score: string) => {
        const numScore = parseFloat(score)
        if (isNaN(numScore)) return 'bg-gray-500 text-white'
        if (numScore >= 0.8) return 'bg-green-500 text-white'
        if (numScore >= 0.5) return 'bg-yellow-500 text-black'
        return 'bg-red-500 text-white'
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Truncate content for preview
    const getTruncatedContent = (content: string, limit: number = 300) => {
        if (content.length <= limit) return content
        return content.substring(0, limit) + '...'
    }

    return (
        <div className="mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 pb-4 border-b-2 border-gray-200 gap-3">
                <h2 className="text-2xl font-semibold text-[#248fca]"> Danh sách các đoạn văn bản</h2>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-200">
                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search in content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                    <select
                        value={diabetesScoreFilter}
                        onChange={(e) => setDiabetesScoreFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả điểm</option>
                        <option value="high">Điểm cao (≥ 0.8)</option>
                        <option value="medium">Điểm trung bình (0.5-0.8)</option>
                        <option value="low">Điểm thấp (&lt; 0.5)</option>
                        <option value="no-score">Không có điểm</option>
                    </select>

                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Hiển thị các đoạn văn bản không được chọn</span>
                    </label>
                </div>
            </div>

            {/* Chunks List */}
            <div className="space-y-3">
                {filteredChunks.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <div className="text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg font-medium">No chunks found</p>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                    </div>
                ) : (
                    filteredChunks.map((chunk) => {
                        const isExpanded = expandedChunks.has(chunk.id)
                        const shouldShowExpand = chunk.content.length > 300
                        const isUpdating = updatingChunks.has(chunk.id)

                        return (
                            <div
                                key={chunk.id}
                                className={`border rounded-lg bg-white transition-all duration-200 hover:shadow-md hover:border-blue-300 ${!chunk.is_active ? 'bg-gray-50 border-gray-300 opacity-70' : 'border-gray-200'
                                    } ${isUpdating ? 'animate-pulse' : ''}`}
                            >
                                {/* Chunk Header */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 pb-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                        <span className="font-mono text-sm font-semibold text-gray-600">
                                            #{chunk.id.slice(-8)}
                                        </span>

                                        {/* Toggle Switch */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleActiveStatus(chunk.id, chunk.is_active)}
                                                disabled={isUpdating}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${chunk.is_active ? 'bg-green-600' : 'bg-gray-300'
                                                    }`}
                                                title={`Click to ${chunk.is_active ? 'deactivate' : 'activate'} chunk`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${chunk.is_active ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>

                                            {/* Status Badge */}
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${chunk.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {chunk.is_active ? 'Active' : 'Inactive'}
                                            </span>

                                            {/* Loading indicator */}
                                            {isUpdating && (
                                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                                    <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Updating...
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 items-center">
                                        {chunk.diabetes_score && (
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${getScoreBadgeClasses(chunk.diabetes_score)}`}>
                                                Score: {parseFloat(chunk.diabetes_score).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Chunk Content */}
                                <div className="p-4 pt-3">
                                    <div className="relative">
                                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words text-sm mb-0">
                                            {isExpanded ? chunk.content : getTruncatedContent(chunk.content)}
                                        </p>

                                        {/* Fade effect when collapsed */}
                                        {!isExpanded && shouldShowExpand && (
                                            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                                        )}
                                    </div>

                                    {/* Expand/Collapse Button */}
                                    {shouldShowExpand && (
                                        <button
                                            onClick={() => toggleExpand(chunk.id)}
                                            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
                                        >
                                            {isExpanded ? (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                    Show Less
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                    Show More
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Pagination Info */}
            {documentChunksData?.total_pages && documentChunksData?.total_pages > 1 && <Pagination
                currentPage={documentChunksData?.page}
                totalPages={documentChunksData?.total_pages}
                totalItems={documentChunksData?.total}
                perPage={documentChunksData?.limit}
                hasNext={documentChunksData?.page < documentChunksData?.total_pages}
                hasPrev={documentChunksData?.page > 1}
                onPageChange={handlePageChange}
                isLoading={isPending}
                perPageOptions={[6, 9, 12, 18, 24]}
                onPerPageChange={handlePerPageChange}
            />}
        </div>
    )
}

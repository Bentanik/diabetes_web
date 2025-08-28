import React from 'react'
import { motion } from 'framer-motion'
import { formatFileSize, getFileIcon } from '@/utils/file'
import { Calendar, FileText, SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-[#248fca]'
    if (score >= 0.6) return 'text-yellow-500'
    if (score >= 0.4) return 'text-red-500'
    return 'text-gray-500'
}

interface DocumentItemProps {
    document: API.TDocument
    score: number
    index: number
    content: string
}

export default function DocumentItem({ document, score, index, content }: DocumentItemProps) {

    const router = useRouter()

    const handleViewDetail = () => {
        router.push(`/admin/train-ai/document-detail/${document.id}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
        >
            <div className="p-5">
                <div className="flex gap-3">
                    <div className="mt-1 text-gray-400">
                        {getFileIcon(document.file?.type || 'pdf')}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Title + Score */}
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
                                {document.title}
                            </h3>
                            <div className={`flex items-center gap-1 whitespace-nowrap ml-2`}>
                                <SearchIcon className={`w-3 h-3 ${getScoreColor(score)}`} />
                                <span className={`text-xs font-medium ${getScoreColor(score)}`}>
                                    {(score * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>

                        {/* Snippet */}
                        {content && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                {content}
                            </p>
                        )}

                        {/* Meta */}
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-gray-500">
                            <div className='flex items-center gap-1'>
                                <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3 text-gray-400" />
                                    {formatFileSize(document.file?.size_bytes || 0)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-gray-400" />
                                    {formatDate(document.created_at)}
                                </span>
                            </div>
                            <div>
                                <button
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors group"
                                    onClick={handleViewDetail}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
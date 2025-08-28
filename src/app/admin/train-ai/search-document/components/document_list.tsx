import React from "react"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import DocumentItem from "@/app/admin/train-ai/search-document/components/document_item"

interface DocumentListProps {
    documents: API.TSearchDocument[]
}

export default function DocumentList({ documents }: DocumentListProps) {
    if (documents.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Không có tài liệu nào
                </h3>
                <p className="text-gray-500">Danh sách tài liệu trống</p>
            </motion.div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#248fca]" />
                    Danh sách tài liệu
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {documents.length} tài liệu
                </span>
            </div>

            <div className="space-y-3">
                {documents.map((item, index) => (
                    <DocumentItem
                        key={item.document.id + index}
                        document={item.document}
                        content={item.content}
                        score={item.score}
                        index={index}
                    />
                ))}
            </div>
        </div>
    )
}

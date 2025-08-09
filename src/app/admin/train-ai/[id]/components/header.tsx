import { motion } from "framer-motion"
import { ArrowLeftIcon, FolderIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeaderProps {
    knowledgeBase: API.TKnowledge
}

export default function Header({ knowledgeBase }: HeaderProps) {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
            style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={`/admin/train-ai`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                        </motion.button>
                    </Link>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FolderIcon className="w-5 h-5 text-[#248fca]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-semibold text-[#248fca]">{knowledgeBase.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{knowledgeBase.stats.document_count} tài liệu</span>
                                <span>Cập nhật mới nhất {new Date(knowledgeBase.updated_at).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/train-ai/${knowledgeBase.id}/upload`}>
                        <Button size="sm" className="gap-2 bg-[#248fca] hover:bg-[#248fca]/80">
                            <PlusIcon className="w-4 h-4" />
                            Thêm tài liệu
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Description - Optional, only if needed */}
            {knowledgeBase.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">{knowledgeBase.description}</p>
                </div>
            )}
        </motion.div>
    )
}
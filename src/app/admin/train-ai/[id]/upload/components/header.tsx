// "use client"

// import { motion } from "framer-motion"
// import { ArrowLeftIcon, UploadIcon } from "lucide-react"
// import { Button } from "@/components/ui/button"

// interface HeaderProps {
//     knowledgeBase: API.TKnowledgeBase
//     canAddToKB: boolean
//     uploadedFile: REQUEST.TCreateDocumentRequest | null
//     isProcessing: boolean
//     onGoBack: () => void
//     onAddToKB: () => void
// }

// export function Header({ knowledgeBase, canAddToKB, uploadedFile, isProcessing, onGoBack, onAddToKB }: HeaderProps) {
//     return (
//         <motion.div
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
//             style={{
//                 boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
//             }}
//         >
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={onGoBack}
//                         className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
//                     >
//                         <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
//                     </motion.button>
//                     <div className="h-6 w-px bg-gray-300"></div>
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 bg-blue-50 rounded-lg">
//                             <UploadIcon className="w-5 h-5 text-[#248fca]" />
//                         </div>
//                         <div className="flex flex-col gap-2">
//                             <h1 className="text-xl font-semibold text-[#248fca]">Tải tài liệu lên</h1>
//                             <div className="flex items-center gap-4 text-sm text-gray-500">
//                                 <span>Knowledge Base: {knowledgeBase.name}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     {canAddToKB && (
//                         <Button className="gap-2 bg-[#248fca] hover:bg-[#248fca]/80" onClick={onAddToKB} disabled={isProcessing}>
//                             {isProcessing ? "Đang thêm..." : uploadedFile?.status === "valid" ? "Thêm tài liệu" : "Vẫn thêm tài liệu"}
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </motion.div>
//     )
// }

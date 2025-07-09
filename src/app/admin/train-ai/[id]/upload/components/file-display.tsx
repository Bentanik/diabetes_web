// "use client"

// import { motion } from "framer-motion"
// import { FolderIcon } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// interface FileDisplayProps {
//     uploadedFile: REQUEST.TCreateDocumentRequest | null
//     onAddToKB: () => void
//     onReset: () => void
//     isProcessing: boolean
// }

// export function FileDisplay({ uploadedFile, onAddToKB, onReset, isProcessing }: FileDisplayProps) {
//     return (
//         <Card className="shadow-sm border-gray-200">
//             <CardHeader>
//                 <CardTitle className="text-lg text-[#248fca]">
//                     {uploadedFile ? "Tài liệu đã tải lên" : "Chưa có tài liệu"}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 {uploadedFile ? (
//                     <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
//                         <FileUploadCard file={uploadedFile} onAddToKB={onAddToKB} onReset={onReset} isProcessing={isProcessing} />
//                     </motion.div>
//                 ) : (
//                     <div className="text-center py-12">
//                         <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài liệu nào</h3>
//                         <p className="text-gray-500">Tải lên tài liệu để bắt đầu kiểm tra</p>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }

// "use client"

// import { TrashIcon } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"

// interface FileUploadCardProps {
//     file: REQUEST.TCreateDocumentRequest
//     onAddToKB: () => void
//     onReset: () => void
//     isProcessing: boolean
// }

// export function FileUploadCard({ file, onAddToKB, onReset, isProcessing }: FileUploadCardProps) {
//     return (
//         <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//             <div className="flex items-center gap-4 p-4">
//                 {/* File Icon */}
//                 <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">{getFileIcon(file.type)}</div>

//                 {/* File Info */}
//                 <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-3 mb-1">
//                         <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
//                         <Badge className={`${getFileTypeColor(file.type)} text-xs`}>{file.type}</Badge>
//                         <StatusBadge status={file.status} />
//                     </div>
//                     <div className="flex items-center gap-4 text-xs text-gray-500">
//                         <span>{file.size}</span>
//                         {file.status === "uploading" && <span>Đang tải file lên server...</span>}
//                         {file.status === "validating" && <span>Đang phân tích nội dung và kiểm tra phù hợp...</span>}
//                     </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex items-center gap-2">
//                     {(file.status === "valid" || file.status === "invalid") && (
//                         <Button
//                             size="sm"
//                             className="bg-[#248fca] hover:bg-[#248fca]/80"
//                             onClick={onAddToKB}
//                             disabled={isProcessing}
//                         >
//                             {isProcessing ? "Đang thêm..." : file.status === "valid" ? "Thêm vào KB" : "Vẫn thêm vào KB"}
//                         </Button>
//                     )}
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
//                         onClick={onReset}
//                         disabled={isProcessing}
//                     >
//                         <TrashIcon className="w-4 h-4" />
//                     </Button>
//                 </div>
//             </div>

//             {/* Progress Bar */}
//             {(file.status === "uploading" || file.status === "validating") && (
//                 <div className="px-4 pb-4">
//                     <div className="flex items-center justify-between mb-2">
//                         <span className="text-sm font-medium text-gray-700">
//                             {file.status === "uploading" ? "Đang tải lên server..." : "Đang kiểm tra tài liệu..."}
//                         </span>
//                         <span className="text-sm font-medium text-[#248fca]">{file.progress}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div
//                             className="bg-[#248fca] h-2 rounded-full transition-all duration-300 ease-out"
//                             style={{ width: `${file.progress}%` }}
//                         ></div>
//                     </div>
//                 </div>
//             )}

//             {/* Validation Results */}
//             {file.validationResults && (
//                 <div className="px-4 pb-4">
//                     <ValidationResults file={file} />
//                 </div>
//             )}
//         </div>
//     )
// }

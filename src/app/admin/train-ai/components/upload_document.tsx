// "use client"
// import { useState, useRef, useCallback } from "react"
// import { motion } from "framer-motion"
// import { Modal } from "@/components/shared/Modal"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { UploadIcon, FileIcon, XIcon, CheckCircleIcon, AlertCircleIcon, FileTextIcon, ImageIcon, FileSpreadsheetIcon } from 'lucide-react'
// import { useCreateKnowledgeDocumentService } from "@/services/train-ai/services"
// import { useBackdrop } from "@/context/backdrop_context"

// interface UploadDocumentProps {
//     isOpen: boolean
//     onClose: () => void
//     folderId: string
// }

// interface FileUpload {
//     file: File
//     id: string
//     progress: number
//     status: 'pending' | 'uploading' | 'success' | 'error'
//     error?: string
// }

// const getFileIcon = (fileType: string) => {
//     if (fileType.startsWith('image/')) return <ImageIcon className="w-6 h-6" />
//     if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheetIcon className="w-6 h-6" />
//     if (fileType.includes('text') || fileType.includes('document')) return <FileTextIcon className="w-6 h-6" />
//     return <FileIcon className="w-6 h-6" />
// }

// const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return '0 Bytes'
//     const k = 1024
//     const sizes = ['Bytes', 'KB', 'MB', 'GB']
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
// }

// export default function UploadDocument({
//     isOpen,
//     onClose,
//     folderId,
// }: UploadDocumentProps) {
//     const [files, setFiles] = useState<FileUpload[]>([])
//     const [isDragOver, setIsDragOver] = useState(false)
//     const fileInputRef = useRef<HTMLInputElement>(null)

//     const mutation = useCreateKnowledgeDocumentService(folderId)
//     const { showBackdrop, hideBackdrop } = useBackdrop();



//     const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
//         if (!selectedFiles) return

//         const newFiles: FileUpload[] = Array.from(selectedFiles).map((file) => ({
//             file,
//             id: Math.random().toString(36).substr(2, 9),
//             progress: 0,
//             status: 'pending',
//         }))

//         setFiles((prev) => [...prev, ...newFiles])
//     }, [])

//     const handleDragOver = useCallback((e: React.DragEvent) => {
//         e.preventDefault()
//         setIsDragOver(true)
//     }, [])

//     const handleDragLeave = useCallback((e: React.DragEvent) => {
//         e.preventDefault()
//         setIsDragOver(false)
//     }, [])

//     const handleDrop = useCallback((e: React.DragEvent) => {
//         e.preventDefault()
//         setIsDragOver(false)
//         handleFileSelect(e.dataTransfer.files)
//     }, [handleFileSelect])

//     const removeFile = useCallback((id: string) => {
//         setFiles((prev) => prev.filter((file) => file.id !== id))
//     }, [])

//     const handleUpload = async () => {
//         if (files.length === 0) return

//         try {
//             showBackdrop();
//             mutation.mutate({
//                 file: files[0].file,
//                 chunk_size: 1000,
//                 chunk_overlap: 200,
//             }, {
//                 onSuccess: () => {
//                     hideBackdrop();
//                     handleClose();
//                 },
//                 onError: () => {
//                     hideBackdrop();
//                     handleClose();
//                 }
//             })
//         } catch (error) {
//             console.error('Upload failed:', error)
//         }
//     }

//     const handleClose = () => {
//         setFiles([])
//         onClose()
//     }

//     const allFilesUploaded = files.length > 0 && files.every((f) => f.status === 'success')
//     const hasFiles = files.length > 0

//     return (
//         <Modal isOpen={isOpen} onClose={handleClose} title="Tải lên tài liệu">
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="space-y-6"
//             >
//                 {/* Drag & Drop Area */}
//                 <div
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                     onClick={() => fileInputRef.current?.click()}
//                     className={`
//             relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
//             ${isDragOver
//                             ? 'border-blue-500 bg-blue-50'
//                             : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
//                         }
//           `}
//                 >
//                     <input
//                         ref={fileInputRef}
//                         type="file"
//                         multiple
//                         className="hidden"
//                         onChange={(e) => handleFileSelect(e.target.files)}
//                         accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.csv"
//                     />

//                     <motion.div
//                         animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
//                         transition={{ duration: 0.2 }}
//                     >
//                         <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">
//                             {isDragOver ? 'Thả file vào đây' : 'Chọn file hoặc kéo thả'}
//                         </h3>
//                         <p className="text-sm text-gray-500">
//                             Hỗ trợ: PDF, DOC, TXT, JPG, PNG, XLSX và nhiều định dạng khác
//                         </p>
//                     </motion.div>
//                 </div>

//                 {/* File List */}
//                 {hasFiles && (
//                     <div className="space-y-3 max-h-60 overflow-y-auto">
//                         <h4 className="font-medium text-gray-900">
//                             Danh sách file ({files.length})
//                         </h4>

//                         {files.map((fileUpload, index) => (
//                             <motion.div
//                                 key={fileUpload.id}
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ delay: index * 0.1 }}
//                                 className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
//                             >
//                                 {/* File Icon */}
//                                 <div className="text-gray-500">
//                                     {getFileIcon(fileUpload.file.type)}
//                                 </div>

//                                 {/* File Info */}
//                                 <div className="flex-1 min-w-0">
//                                     <p className="text-sm font-medium text-gray-900 truncate">
//                                         {fileUpload.file.name}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                         {formatFileSize(fileUpload.file.size)}
//                                     </p>

//                                     {/* Progress Bar */}
//                                     {fileUpload.status === 'uploading' && (
//                                         <div className="mt-2">
//                                             <Progress value={fileUpload.progress} className="h-1" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Status Icon */}
//                                 <div className="flex items-center gap-2">
//                                     {fileUpload.status === 'success' && (
//                                         <CheckCircleIcon className="w-5 h-5 text-green-500" />
//                                     )}
//                                     {fileUpload.status === 'error' && (
//                                         <AlertCircleIcon className="w-5 h-5 text-red-500" />
//                                     )}
//                                     {fileUpload.status === 'pending' && (
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             onClick={() => removeFile(fileUpload.id)}
//                                             className="w-6 h-6 hover:bg-red-100"
//                                         >
//                                             <XIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
//                                         </Button>
//                                     )}
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>
//                 )}

//                 {/* Upload Summary */}
//                 {allFilesUploaded && (
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="p-4 bg-green-50 border border-green-200 rounded-lg"
//                     >
//                         <div className="flex items-center gap-2">
//                             <CheckCircleIcon className="w-5 h-5 text-green-500" />
//                             <p className="text-sm font-medium text-green-800">
//                                 Tải lên thành công {files.length} file!
//                             </p>
//                         </div>
//                     </motion.div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex justify-end gap-2 pt-4">
//                     <Button
//                         variant="outline"
//                         onClick={handleClose}
//                     >
//                         {allFilesUploaded ? 'Đóng' : 'Hủy'}
//                     </Button>

//                     {hasFiles && !allFilesUploaded && (
//                         <Button
//                             onClick={handleUpload}
//                             className="bg-blue-600 text-white hover:bg-blue-700"
//                         >
//                             Tải lên file
//                         </Button>
//                     )}
//                 </div>
//             </motion.div>
//         </Modal>
//     )
// }

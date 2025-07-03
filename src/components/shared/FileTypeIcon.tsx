import React from "react"
import { FileTextIcon } from "lucide-react"

/**
 * Interface cho props của FileTypeIcon component
 */
interface FileTypeIconProps {
    fileType: string
    className?: string
}

/**
 * Component hiển thị icon tương ứng với loại file
 * Hỗ trợ các định dạng: PDF, Word, Excel, PowerPoint, TXT
 */
export const FileTypeIcon: React.FC<FileTypeIconProps> = ({
    fileType,
    className = "w-8 h-8"
}) => {
    /**
     * Lấy icon SVG tương ứng với loại file
     */
    const getFileIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "pdf":
                return (
                    <div className={`${className} bg-red-100 rounded-lg flex items-center justify-center`}>
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-600" fill="currentColor">
                            <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z" />
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            <path d="M14 2v6h6" />
                            <path d="M7.5 13.5h.75v3H7.5z" />
                            <path d="M10.5 13.5H12v3h-1.5z" />
                        </svg>
                    </div>
                )

            case "docx":
            case "doc":
                return (
                    <div className={`${className} bg-blue-100 rounded-lg flex items-center justify-center`}>
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            <path d="M14 2v6h6" />
                            <path d="M10.5 11h-2v6h2v-2.5h1.5V16h2v-6h-2v2.5H10.5V11z" />
                        </svg>
                    </div>
                )

            case "xlsx":
            case "xls":
                return (
                    <div className={`${className} bg-green-100 rounded-lg flex items-center justify-center`}>
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-600" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            <path d="M14 2v6h6" />
                            <path d="M8 11h8v6H8z" />
                            <path d="M10 13h4" />
                            <path d="M10 15h4" />
                        </svg>
                    </div>
                )

            case "pptx":
            case "ppt":
                return (
                    <div className={`${className} bg-orange-100 rounded-lg flex items-center justify-center`}>
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-600" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            <path d="M14 2v6h6" />
                            <path d="M8 11h8v6H8z" />
                        </svg>
                    </div>
                )

            case "txt":
                return (
                    <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
                        <FileTextIcon className="w-5 h-5 text-gray-600" />
                    </div>
                )

            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
            case "svg":
                return (
                    <div className={`${className} bg-purple-100 rounded-lg flex items-center justify-center`}>
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-600" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            <path d="M14 2v6h6" />
                            <circle cx="10" cy="13" r="2" />
                            <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" />
                        </svg>
                    </div>
                )

            default:
                return (
                    <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
                        <FileTextIcon className="w-5 h-5 text-gray-600" />
                    </div>
                )
        }
    }

    return getFileIcon(fileType)
}

/**
 * Lấy tên loại file hiển thị cho người dùng
 */
export const getFileTypeName = (fileType: string): string => {
    switch (fileType.toLowerCase()) {
        case "pdf":
            return "Tài liệu PDF"
        case "docx":
        case "doc":
            return "Tài liệu Word"
        case "xlsx":
        case "xls":
            return "Bảng tính Excel"
        case "pptx":
        case "ppt":
            return "Bài thuyết trình PowerPoint"
        case "txt":
            return "Tệp văn bản"
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "svg":
            return "Hình ảnh"
        default:
            return "Tệp tin"
    }
}

/**
 * Lấy màu theme tương ứng với loại file
 */
export const getFileTypeColor = (fileType: string): string => {
    switch (fileType.toLowerCase()) {
        case "pdf":
            return "text-red-600"
        case "docx":
        case "doc":
            return "text-blue-600"
        case "xlsx":
        case "xls":
            return "text-green-600"
        case "pptx":
        case "ppt":
            return "text-orange-600"
        case "txt":
            return "text-gray-600"
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "svg":
            return "text-purple-600"
        default:
            return "text-gray-600"
    }
} 
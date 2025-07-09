// import {
//   FileTextIcon,
//   FileIcon,
//   ImageIcon,
//   VideoIcon,
//   MusicIcon,
//   ArchiveIcon,
//   RefreshCwIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   AlertTriangleIcon,
//   InfoIcon,
// } from "lucide-react";
// import type { StatusInfo, ValidationResults } from "./types";

// export const formatFileSize = (bytes: number): string => {
//   if (bytes === 0) return "0 Bytes";
//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return (
//     Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   );
// };

// export const getFileType = (filename: string): string => {
//   const extension = filename.split(".").pop()?.toLowerCase();
//   switch (extension) {
//     case "pdf":
//       return "PDF";
//     case "docx":
//       return "DOCX";
//     case "txt":
//       return "TXT";
//     default:
//       return "FILE";
//   }
// };

// export const getFileIcon = (type: string) => {
//   const iconClass = "w-6 h-6";
//   switch (type) {
//     case "PDF":
//       return <FileTextIcon className={`${iconClass} text-red-500`} />;
//     case "DOCX":
//       return <FileIcon className={`${iconClass} text-blue-500`} />;
//     case "JPG":
//       return <ImageIcon className={`${iconClass} text-green-500`} />;
//     case "MP4":
//       return <VideoIcon className={`${iconClass} text-purple-500`} />;
//     case "MP3":
//       return <MusicIcon className={`${iconClass} text-orange-500`} />;
//     default:
//       return <ArchiveIcon className={`${iconClass} text-gray-500`} />;
//   }
// };

// export const getFileTypeColor = (type: string): string => {
//   switch (type) {
//     case "PDF":
//       return "bg-red-100 text-red-800";
//     case "DOCX":
//       return "bg-blue-100 text-blue-800";
//     case "JPG":
//     case "PNG":
//       return "bg-green-100 text-green-800";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// };

// export const getStatusInfo = (status: string): StatusInfo => {
//   switch (status) {
//     case "uploading":
//       return {
//         label: "Đang tải lên",
//         color: "bg-blue-100 text-blue-800 border-blue-200",
//         icon: <RefreshCwIcon className="w-3 h-3 animate-spin" />,
//       };
//     case "validating":
//       return {
//         label: "Đang kiểm tra",
//         color: "bg-yellow-100 text-yellow-800 border-yellow-200",
//         icon: <RefreshCwIcon className="w-3 h-3 animate-spin" />,
//       };
//     case "valid":
//       return {
//         label: "Phù hợp",
//         color: "bg-green-100 text-green-800 border-green-200",
//         icon: <CheckCircleIcon className="w-3 h-3" />,
//       };
//     case "invalid":
//       return {
//         label: "Phù hợp một phần",
//         color: "bg-yellow-100 text-yellow-800 border-yellow-200",
//         icon: <XCircleIcon className="w-3 h-3" />,
//       };
//     case "error":
//       return {
//         label: "Lỗi",
//         color: "bg-gray-100 text-gray-800 border-gray-200",
//         icon: <AlertTriangleIcon className="w-3 h-3" />,
//       };
//     default:
//       return {
//         label: "Không xác định",
//         color: "bg-gray-100 text-gray-800 border-gray-200",
//         icon: <InfoIcon className="w-3 h-3" />,
//       };
//   }
// };

// export const generateValidationResults = (
//   filename: string,
//   knowledgeBaseId: string
// ): ValidationResults => {
//   // Analyze filename for relevance
//   const lowerFilename = filename.toLowerCase();
//   const diabetesKeywords = [
//     "tiểu đường",
//     "diabetes",
//     "đường huyết",
//     "insulin",
//     "glucose",
//     "hba1c",
//   ];
//   const hasRelevantKeywords = diabetesKeywords.some((keyword) =>
//     lowerFilename.includes(keyword)
//   );

//   // Determine if valid based on filename and random factor
//   const isValid = hasRelevantKeywords && Math.random() > 0.3;
//   const confidence = isValid
//     ? Math.floor(Math.random() * 20) + 80 // 80-99% for valid
//     : Math.floor(Math.random() * 40) + 20; // 20-59% for invalid

//   if (isValid) {
//     return {
//       isValid: true,
//       confidence,
//       reasons: [
//         `Tên file "${filename}" phù hợp với chủ đề tiểu đường`,
//         "Nội dung hoàn toàn phù hợp với knowledge base hiện tại",
//         "Có đầy đủ thông tin về chẩn đoán và điều trị",
//         "Sử dụng thuật ngữ y khoa chính xác",
//         "Cấu trúc tài liệu rõ ràng và logic",
//       ],
//       keyTopics: ["Chẩn đoán", "Điều trị", "Theo dõi", "Biến chứng"],
//     };
//   } else {
//     const reasons = [
//       `Tên file "${filename}" chỉ một phần liên quan đến chủ đề tiểu đường`,
//       "Thiếu thông tin chi tiết về insulin và kiểm soát đường huyết",
//       "Một số thuật ngữ cần được cập nhật theo tiêu chuẩn mới",
//     ];

//     // Add specific reasons based on filename
//     if (!hasRelevantKeywords) {
//       reasons.unshift("Tên file không chứa từ khóa liên quan đến tiểu đường");
//     }

//     return {
//       isValid: false,
//       confidence,
//       reasons,
//       suggestions: [
//         "Nên đổi tên file để phản ánh đúng nội dung về tiểu đường",
//         "Bổ sung thêm thông tin về quản lý tiểu đường",
//         "Cập nhật thuật ngữ y khoa theo tiêu chuẩn mới nhất",
//       ],
//     };
//   }
// };

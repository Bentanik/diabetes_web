import { FileTextIcon } from 'lucide-react';

export const getFileIcon = (type: string) => {
  const iconClass = "w-5 h-5";

  switch (true) {
    case [".pdf", "application/pdf", "pdf"].includes(type):
      return <FileTextIcon className={`${iconClass} text-red-500`} />;
    case [".docx", "application/msword", "docx"].includes(type):
      return <FileTextIcon className={`${iconClass} text-blue-500`} />;
    default:
      return <FileTextIcon className={`${iconClass} text-gray-500`} />;
  }
};


export const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 KB"
  const mb = bytes / (1024 * 1024)
  return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`
}
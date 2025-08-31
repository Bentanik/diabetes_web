"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Clock, Trash2, Upload, FileText, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DocumentUpload {
    name: string;
    description: string;
    file: File;
    validationErrors?: string[];
    isProcessing?: boolean;
    apiErrors?: {
        title?: string;
        description?: string;
    };
}

interface CreateListDocumentProps {
    knowledge_id: string;
    documents: DocumentUpload[];
    onDocumentsChange: (updatedDocuments: DocumentUpload[]) => void;
    onEditDocument: (index: number, field: "name" | "description", value: string) => void;
    onDeleteDocument: (index: number) => void;
    onProcessDocument: (index: number) => void;
    onUploadAll: () => Promise<void>;
}

export default function CreateListDocument({
    documents,
    onEditDocument,
    onDeleteDocument,
    onProcessDocument,
    onUploadAll,
}: CreateListDocumentProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleUploadAll = async () => {
        setIsUploading(true);
        setUploadError(null);
        try {
            await onUploadAll();
        } catch {
            setUploadError("Failed to upload documents. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const getValidDocumentsCount = () => {
        return documents.filter(doc =>
            !doc.validationErrors || doc.validationErrors.length === 0
        ).filter(doc =>
            doc.name.trim() && doc.description.trim()
        ).length;
    };

    const getProcessingDocumentsCount = () => {
        return documents.filter(doc => doc.isProcessing).length;
    };

    const getInvalidDocumentsCount = () => {
        return documents.filter(doc =>
            !doc.name.trim() || !doc.description.trim()
        ).length;
    };

    const hasValidationErrors = () => {
        return documents.some(doc =>
            !doc.name.trim() || !doc.description.trim() || doc.apiErrors?.title || doc.apiErrors?.description
        );
    };

    return (
        <Card className="overflow-hidden border border-gray-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.06)] bg-white">
            <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#248fca]/10 text-[#248fca] flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[#248fca] font-semibold">Quản lý tài liệu</span>
                            <span className="text-sm text-gray-500">
                                {documents.length > 0
                                    ? `${getValidDocumentsCount()} tài liệu sẵn sàng tải lên`
                                    : "Chưa có tài liệu nào được chọn"
                                }
                            </span>
                        </div>
                    </div>
                    <Link
                        href={`#`}
                        className="text-sm text-[#248fca] hover:text-[#1f7fb2] transition-colors"
                    >
                        Xem lịch sử
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col">
                {isUploading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center space-y-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                                <Clock className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">Đang xử lý tài liệu...</p>
                        </div>
                    </div>
                ) : uploadError ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center space-y-3">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 mb-1">Lỗi tải lên</p>
                                <p className="text-xs text-gray-500">{uploadError}</p>
                            </div>
                        </div>
                    </div>
                ) : documents.length > 0 ? (
                    <div className="p-4 space-y-6">
                        {/* Upload All Button */}
                        <div className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${hasValidationErrors()
                                ? 'bg-red-50 border-red-200'
                                : 'bg-[#248fca]/10 border-[#248fca]/20'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${hasValidationErrors()
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-[#248fca]/10 text-[#248fca]'
                                    }`}>
                                    {isUploading ? (
                                        <Clock className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Upload className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${hasValidationErrors() ? 'text-red-900' : 'text-[#248fca]'
                                        }`}>
                                        {isUploading ? 'Đang tải lên tất cả tài liệu...' : 'Tải lên tất cả tài liệu'}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`${hasValidationErrors() ? 'text-red-700' : 'text-[#248fca]'
                                            }`}>
                                            {getValidDocumentsCount()} tài liệu sẵn sàng, {getProcessingDocumentsCount()} đang xử lý
                                        </span>
                                        {getInvalidDocumentsCount() > 0 && (
                                            <span className="text-red-600 font-medium">
                                                • {getInvalidDocumentsCount()} cần bổ sung thông tin
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Progress indicator for upload all */}
                                {isUploading && (
                                    <div className="flex items-center gap-2 text-[#248fca]">
                                        <div className="w-4 h-4 border-2 border-[#248fca] border-t-[#248fca] rounded-full animate-spin"></div>
                                        <span className="text-xs font-medium">Đang xử lý...</span>
                                    </div>
                                )}

                                <Button
                                    onClick={handleUploadAll}
                                    className={`transition-all duration-200 ${getValidDocumentsCount() === 0 || isUploading || hasValidationErrors()
                                            ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
                                            : 'bg-[#248fca] hover:bg-[#1f7fb2] hover:shadow-md transform hover:scale-[1.02]'
                                        } text-white`}
                                    disabled={getValidDocumentsCount() === 0 || isUploading || hasValidationErrors()}
                                >
                                    {isUploading ? (
                                        <>
                                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                                            Đang tải lên...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Tải lên tất cả
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Documents List */}
                        {documents.map((doc, index) => {
                            const hasTitleError = !doc.name.trim() || !!doc.apiErrors?.title;
                            const hasDescriptionError = !doc.description.trim() || !!doc.apiErrors?.description;
                            const hasFieldErrors = hasTitleError || hasDescriptionError;

                            return (
                                <div key={index} className={`border rounded-lg p-4 transition-all duration-200 ${hasFieldErrors
                                        ? 'border-red-200 bg-red-50'
                                        : doc.isProcessing
                                            ? 'border-[#248fca]/20 bg-[#248fca]/10 shadow-md'
                                            : 'border-gray-200 bg-gray-50 hover:shadow-sm'
                                    }`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${doc.isProcessing
                                                    ? 'bg-[#248fca]/10 text-[#248fca]'
                                                    : hasFieldErrors
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-[#248fca]/10 text-[#248fca]'
                                                }`}>
                                                {doc.isProcessing ? (
                                                    <Clock className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <FileText className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className={`text-sm font-medium transition-colors ${doc.isProcessing ? 'text-[#248fca]' : 'text-gray-900'
                                                    }`}>
                                                    {doc.file.name}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {doc.isProcessing && (
                                                <div className="flex items-center gap-2 text-[#248fca] bg-[#248fca]/10 px-3 py-1 rounded-full">
                                                    <Clock className="w-4 h-4 animate-spin" />
                                                    <span className="text-xs font-medium">Đang tải lên...</span>
                                                </div>
                                            )}
                                            {doc.validationErrors && doc.validationErrors.length > 0 && (
                                                <div className="flex items-center gap-2 text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    <span className="text-xs font-medium">Có cảnh báo</span>
                                                </div>
                                            )}
                                            {hasFieldErrors && (
                                                <div className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-1 rounded-full">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-xs font-medium">
                                                        {doc.apiErrors?.title || doc.apiErrors?.description ? "Lỗi từ hệ thống" : "Thiếu thông tin"}
                                                    </span>
                                                </div>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDeleteDocument(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                disabled={doc.isProcessing}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Field Validation Errors */}
                                    {hasFieldErrors && (
                                        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                            <div className="flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm text-red-800">
                                                    <p className="font-medium mb-1">Thông tin bắt buộc:</p>
                                                    <ul className="text-xs space-y-1">
                                                        {hasTitleError && (
                                                            <li className="flex items-start gap-1">
                                                                <span className="text-red-600">•</span>
                                                                <span>{doc.apiErrors?.title || "Tiêu đề không được để trống"}</span>
                                                            </li>
                                                        )}
                                                        {hasDescriptionError && (
                                                            <li className="flex items-start gap-1">
                                                                <span className="text-red-600">•</span>
                                                                <span>{doc.apiErrors?.description || "Mô tả không được để trống"}</span>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Validation Errors Display */}
                                    {doc.validationErrors && doc.validationErrors.length > 0 && (
                                        <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm text-orange-800">
                                                    <p className="font-medium mb-1">Cảnh báo:</p>
                                                    <ul className="text-xs space-y-1">
                                                        {doc.validationErrors.map((error, errorIndex) => (
                                                            <li key={errorIndex} className="flex items-start gap-1">
                                                                <span className="text-orange-600">•</span>
                                                                <span>{error}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor={`name-${index}`} className="text-sm font-medium text-gray-700">
                                                Tiêu đề <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={`name-${index}`}
                                                value={doc.name}
                                                onChange={(e) => onEditDocument(index, "name", e.target.value)}
                                                placeholder="Nhập tiêu đề tài liệu"
                                                className={`mt-1 focus-visible:ring-0 transition-colors input-auth ${hasTitleError
                                                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                                                        : doc.isProcessing
                                                            ? 'border-[#248fca]/30 bg-[#248fca]/10'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                disabled={doc.isProcessing}
                                            />
                                            {hasTitleError && (
                                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {doc.apiErrors?.title || "Tiêu đề là bắt buộc"}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor={`description-${index}`} className="text-sm font-medium text-gray-700">
                                                Mô tả <span className="text-red-500">*</span>
                                            </Label>
                                            <Textarea
                                                id={`description-${index}`}
                                                value={doc.description}
                                                onChange={(e) => onEditDocument(index, "description", e.target.value)}
                                                placeholder="Nhập mô tả tài liệu"
                                                className={`mt-1 focus-visible:ring-0 transition-colors input-auth ${hasDescriptionError
                                                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                                                        : doc.isProcessing
                                                            ? 'border-[#248fca]/30 bg-[#248fca]/10'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                rows={3}
                                                disabled={doc.isProcessing}
                                            />
                                            {hasDescriptionError && (
                                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {doc.apiErrors?.description || "Mô tả là bắt buộc"}
                                                </p>
                                            )}
                                        </div>

                                        {/* Process Document Button */}
                                        {!doc.isProcessing && (
                                            <Button
                                                onClick={() => onProcessDocument(index)}
                                                className={`w-full transition-all duration-200 ${hasFieldErrors || (doc.validationErrors && doc.validationErrors.length > 0)
                                                        ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
                                                        : 'bg-[#248fca] hover:bg-[#1f7fb2] hover:shadow-md transform hover:scale-[1.02]'
                                                    } text-white`}
                                                disabled={doc.validationErrors && doc.validationErrors.length > 0 || hasFieldErrors}
                                            >
                                                {doc.validationErrors && doc.validationErrors.length > 0
                                                    ? "Xem cảnh báo trước"
                                                    : hasFieldErrors
                                                        ? doc.apiErrors?.title || doc.apiErrors?.description 
                                                            ? "Vui lòng sửa lỗi trước"
                                                            : "Vui lòng nhập đầy đủ thông tin"
                                                        : "Tải lên tài liệu này"
                                                }
                                            </Button>
                                        )}

                                        {/* Upload Progress Indicator */}
                                        {doc.isProcessing && (
                                            <div className="w-full bg-[#248fca]/10 rounded-full h-2 overflow-hidden">
                                                <div className="bg-[#248fca] h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center space-y-4">
                            <div className="text-center py-8 text-gray-500 space-y-2">
                                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Chưa có tài liệu nào được tải lên</p>
                                <p className="text-sm">Chọn tệp để tải lên và chúng sẽ xuất hiện ở đây</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

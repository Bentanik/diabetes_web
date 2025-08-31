"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/admin/train-ai/[id]/upload/components/header";
import UploadArea from "@/app/admin/train-ai/[id]/upload/components/upload_area";
import ValidationInfo from "@/app/admin/train-ai/[id]/upload/components/validation_info";

import { useNotificationContext } from "@/context/notification_context";
import { useUploadDocument } from "@/app/admin/train-ai/[id]/upload/hooks/useUploadDocument";
import { fileForTrainAI } from "@/lib/validations/file_train_ai";
import { useGetKnowledgeByIdService } from "@/services/train-ai/services";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import CreateListDocument from "@/app/admin/train-ai/[id]/upload/components/create_list_document";
import { getJobDocumentHistoryAsync } from "@/services/job/api-services";
import HistoryUploadFileDisplay from "@/app/admin/train-ai/[id]/upload/components/history_upload_file_display";

interface FileToUpload {
    file: File;
    name: string;
    description: string;
    validationErrors?: string[];
    isProcessing?: boolean;
    apiErrors?: {
        title?: string;
        description?: string;
    };
}

export default function UploadPageComponent({ id }: { id: string }) {
    const router = useRouter();

    const [isDragOver, setIsDragOver] = useState(false);

    // State cho multiple files
    const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]>([]);
    
    // State cho timeout handling
    const [loadingTimeout, setLoadingTimeout] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const { handleUploadDocument } = useUploadDocument();
    const { addSuccess, addError } = useNotificationContext();

    const { data: knowledgeBase, isLoading, error, refetch: refetchKB } = useGetKnowledgeByIdService(id);

    // Fetch job history
    const fetchJobHistory = useCallback(async () => {
        try {
            const response = await getJobDocumentHistoryAsync({
                search: "",
                sort_by: "created_at",
                sort_order: "desc",
                page: 1,
                limit: 50,
                type: "upload_document",
                knowledge_id: id,
            });
            
            if (response && response.data) {
            }
        } catch (error) {
            console.error("Failed to fetch job history:", error);
            addError("Lỗi", "Không thể tải lịch sử upload");
        }
    }, [id, addError]);

    // Load jobs on component mount
    useEffect(() => {
        fetchJobHistory();
    }, [fetchJobHistory]);

    // Auto-refresh jobs every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchJobHistory();
        }, 10000);

        return () => clearInterval(interval);
    }, [fetchJobHistory]);

    useEffect(() => {
        if (isLoading && !knowledgeBase) {
            const timer = setTimeout(() => {
                setLoadingTimeout(true);
            }, 10000);

            return () => clearTimeout(timer);
        } else {
            setLoadingTimeout(false);
        }
    }, [isLoading, knowledgeBase]);

    const handleRetry = useCallback(() => {
        setLoadingTimeout(false);
        setRetryCount(prev => prev + 1);
        refetchKB();
    }, [refetchKB]);

    const validateAndAddFiles = useCallback((files: FileList | File[]) => {
        const newFiles: FileToUpload[] = [];
        const errors: string[] = [];

        Array.from(files).forEach((file) => {
            const validationResult = fileForTrainAI.validate(file);
            
            if (validationResult.blockingErrors.length > 0) {
                errors.push(`${file.name}: ${validationResult.blockingErrors.join(", ")}`);
                return;
            }

            const fileToUpload: FileToUpload = {
                file,
                name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for default name
                description: "",
                validationErrors: validationResult.warningErrors,
            };

            newFiles.push(fileToUpload);
        });

        if (errors.length > 0) {
            addError(
                "Tệp không hợp lệ",
                errors.join("\n")
            );
        }

        if (newFiles.length > 0) {
            setFilesToUpload(prev => [...prev, ...newFiles]);
        }
    }, [addError]);

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                validateAndAddFiles(files);
            }
        },
        [validateAndAddFiles]
    );

    const handleFileUpload = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true; // Enable multiple file selection
        input.accept = ".pdf,.docx,.txt";
        input.onchange = (e) =>
            handleFileSelect(e as unknown as React.ChangeEvent<HTMLInputElement>);
        input.click();
    }, [handleFileSelect]);

    const handleGoBack = useCallback(() => {
        router.push(`/admin/train-ai/knowledge-base/${id}`);
    }, [id, router]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                validateAndAddFiles(files);
            }
        },
        [validateAndAddFiles]
    );

    const handleEditDocument = (index: number, field: "name" | "description", value: string) => {
        setFilesToUpload(prev => prev.map((file, i) => 
            i === index ? { 
                ...file, 
                [field]: value,
                // Clear API errors when user edits
                apiErrors: field === 'name' 
                    ? { ...file.apiErrors, title: undefined }
                    : { ...file.apiErrors, description: undefined }
            } : file
        ));
    };

    const handleDeleteDocument = (index: number) => {
        setFilesToUpload(prev => prev.filter((_, i) => i !== index));
    };

    // Common upload function
    const uploadDocument = async (fileData: FileToUpload, index: number) => {
        // Set processing state for this specific document
        setFilesToUpload(prev => prev.map((file, i) => 
            i === index ? { ...file, isProcessing: true } : file
        ));

        try {
            // Create form data and upload
            const formData = new FormData();
            formData.append("files", fileData.file);
            formData.append("knowledge_id", id);
            formData.append("titles", fileData.name);
            formData.append("descriptions", fileData.description);

            await new Promise((resolve, reject) => {
                handleUploadDocument(formData, {
                    onSuccess: () => {
                        resolve(true);
                    },
                    onError: (error: TMeta) => {
                        if (error.errorCode === "DOCUMENT_TITLE_EXISTS") {
                            setFilesToUpload(prev => prev.map((file, i) => 
                                i === index ? { ...file, apiErrors: { title: "Tên tài liệu đã tồn tại" } } : file
                            ));
                            reject(new Error("DOCUMENT_TITLE_EXISTS"));
                        } else {
                            reject(new Error("Upload failed"));
                        }
                    },
                });
            });
            
            addSuccess(
                "Tải lên thành công",
                `Tài liệu "${fileData.name}" đã được tải lên thành công`
            );

            // Remove the successfully uploaded file from the list
            setFilesToUpload(prev => prev.filter((_, i) => i !== index));
            
            return true;
        } catch {
            addError(
                "Lỗi tải lên",
                `Đã xảy ra lỗi khi tải lên tài liệu "${fileData.name}"`
            );
            return false;
        } finally {
            // Remove processing state
            setFilesToUpload(prev => prev.map((file, i) => 
                i === index ? { ...file, isProcessing: false } : file
            ));
        }
    };

    const handleProcessDocument = async (index: number) => {
        const fileData = filesToUpload[index];
        
        // Check for API errors first
        if (fileData.apiErrors?.title || fileData.apiErrors?.description) {
            addError(
                "Lỗi từ hệ thống",
                "Vui lòng sửa lỗi trước khi tải lên"
            );
            return;
        }
        
        // Validate title and description
        if (!fileData.name.trim()) {
            addError(
                "Lỗi validation",
                "Tiêu đề tài liệu không được để trống"
            );
            return;
        }
        
        if (!fileData.description.trim()) {
            addError(
                "Mô tả tài liệu không được để trống",
                "Mô tả tài liệu không được để trống"
            );
            return;
        }
        
        if (fileData.validationErrors && fileData.validationErrors.length > 0) {
            // For files with validation errors, just open the modal directly
            // The validation errors will be displayed in the CreateListDocument component
            return;
        }

        // Upload single document
        await uploadDocument(fileData, index);
        
        // Refresh job history to show new job
        setTimeout(() => {
            fetchJobHistory();
        }, 1000);
    };

    const handleUploadAllDocuments = async () => {
        // Check for API errors first
        const documentsWithApiErrors = filesToUpload.filter(doc => 
            doc.apiErrors?.title || doc.apiErrors?.description
        );
        
        if (documentsWithApiErrors.length > 0) {
            addError(
                "Lỗi từ hệ thống",
                `Có ${documentsWithApiErrors.length} tài liệu có lỗi từ hệ thống. Vui lòng sửa lỗi trước khi tải lên.`
            );
            return;
        }
        
        // Validate all documents before uploading
        const invalidDocuments = filesToUpload.filter(doc => 
            !doc.name.trim() || !doc.description.trim()
        );
        
        if (invalidDocuments.length > 0) {
            addError(
                "Lỗi validation",
                `Có ${invalidDocuments.length} tài liệu chưa nhập đầy đủ thông tin. Vui lòng kiểm tra lại tiêu đề và mô tả.`
            );
            return;
        }

        // Get valid documents for upload
        const validDocuments = filesToUpload.filter(doc => 
            !doc.validationErrors || doc.validationErrors.length === 0
        );

        if (validDocuments.length === 0) {
            addError("Lỗi", "Không có tài liệu nào hợp lệ để upload");
            return;
        }

        // Set processing state for all documents
        setFilesToUpload(prev => prev.map(file => ({ ...file, isProcessing: true })));

        try {
            // Create single FormData for all documents
            const formData = new FormData();
            formData.append("knowledge_id", id);
            
            // Append all files, titles, and descriptions
            validDocuments.forEach((doc) => {
                formData.append("files", doc.file);
                formData.append("titles", doc.name);
                formData.append("descriptions", doc.description);
            });

            // Upload all documents at once
            await new Promise((resolve, reject) => {
                handleUploadDocument(formData, {
                    onSuccess: () => {
                        resolve(true);
                    },
                    onError: (error: TMeta) => {
                        if (error.errorCode === "DOCUMENT_TITLE_EXISTS") {
                            setFilesToUpload(prev => prev.map(file => ({ ...file, apiErrors: { title: "Tên tài liệu đã tồn tại" } })));
                            reject(new Error("DOCUMENT_TITLE_EXISTS"));
                        } else {
                            reject(new Error("Bulk upload failed"));
                        }
                    },
                });
            });
            
            addSuccess(
                "Tải lên thành công",
                `Đã tải lên thành công ${validDocuments.length} tài liệu`
            );

            // Clear all successfully uploaded files
            setFilesToUpload(prev => prev.filter(file => 
                file.validationErrors && file.validationErrors.length > 0
            ));

        } catch {
            addError(
                "Lỗi tải lên",
                `Đã xảy ra lỗi khi tải lên tài liệu`
            );
        } finally {
            // Remove processing state
            setFilesToUpload(prev => prev.map(file => ({ ...file, isProcessing: false })));
        }

        // Refresh job history to show new jobs
        setTimeout(() => {
            fetchJobHistory();
        }, 1000);
    };

    // Loading Skeleton Component
    const LoadingSkeleton = () => (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        {/* Upload Area Skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                                    <Skeleton className="h-12 w-12 mx-auto mb-4" />
                                    <Skeleton className="h-6 w-48 mx-auto mb-2" />
                                    <Skeleton className="h-4 w-16 mx-auto mb-4" />
                                    <Skeleton className="h-10 w-32 mx-auto" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Validation Info Skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {/* File Upload Card Skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>

                        {/* History Skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border rounded">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-8 w-8" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );

    // Error State Component
    const ErrorState = () => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Không thể tải dữ liệu
                            </h3>
                            <p className="text-sm text-gray-500">
                                {error?.message || loadingTimeout
                                    ? "Quá trình tải dữ liệu mất quá nhiều thời gian. Vui lòng thử lại."
                                    : "Đã xảy ra lỗi khi tải thông tin thư mục."
                                }
                            </p>
                            {retryCount > 0 && (
                                <p className="text-xs text-gray-400">
                                    Đã thử lại {retryCount} lần
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/admin/train-ai')}
                            >
                                Quay lại
                            </Button>
                            <Button
                                onClick={handleRetry}
                                disabled={isLoading}
                                className="bg-[#248fca] hover:bg-[#248fca]/80"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Đang tải...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Thử lại
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // Render logic
    if (error || loadingTimeout) {
        return <ErrorState />;
    }

    if (isLoading || !knowledgeBase) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                knowledgeBase={knowledgeBase}
                onGoBack={handleGoBack}
            />
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <UploadArea
                            isDragOver={isDragOver}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onFileUpload={handleFileUpload}
                            job={null}
                            fileCount={filesToUpload.length}
                        />
                        <ValidationInfo />
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div>
                            <CreateListDocument 
                                knowledge_id={id} 
                                documents={filesToUpload}
                                onDocumentsChange={setFilesToUpload}
                                onEditDocument={handleEditDocument}
                                onDeleteDocument={handleDeleteDocument}
                                onProcessDocument={handleProcessDocument}
                                onUploadAll={handleUploadAllDocuments}
                            />
                        </div>
                        
                        {/* Upload Progress Component */}
                        <HistoryUploadFileDisplay
                            knowledgeId={id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

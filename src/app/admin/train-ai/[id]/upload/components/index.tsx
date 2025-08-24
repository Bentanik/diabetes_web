/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/admin/train-ai/[id]/upload/components/header";
import UploadArea from "@/app/admin/train-ai/[id]/upload/components/upload_area";
import ValidationInfo from "@/app/admin/train-ai/[id]/upload/components/validation_info";
import WarningModal from "@/app/admin/train-ai/[id]/upload/components/warning_modal";
import { useNotificationContext } from "@/context/notification_context";
import { useUploadDocument } from "@/app/admin/train-ai/[id]/upload/hooks/useUploadDocument";
import { fileForTrainAI } from "@/lib/validations/file_train_ai";
import HistoryUploadFileDisplay from "@/app/admin/train-ai/[id]/upload/components/history_upload_file_display";
import { useGetKnowledgeByIdService } from "@/services/train-ai/services";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import CreateDocumentModal from "@/app/admin/train-ai/[id]/upload/components/create-document";
import { CreateDocumentFormData } from "@/lib/validations/document.schema";

export default function UploadPageComponent({ id }: { id: string }) {
    const router = useRouter();

    const [isDragOver, setIsDragOver] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [warningErrors, setWarningErrors] = useState<string[]>([]);

    const [isCreateDocumentModalOpen, setIsCreateDocumentModalOpen] = useState(false);

    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    // State cho timeout handling
    const [loadingTimeout, setLoadingTimeout] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const { handleUploadDocument } = useUploadDocument();
    const { addSuccess, addError } = useNotificationContext();

    const { data: knowledgeBase, isLoading, error, refetch: refetchKB } = useGetKnowledgeByIdService(id);

    // Timeout handler - 10 giây
    useEffect(() => {
        if (isLoading && !knowledgeBase) {
            const timer = setTimeout(() => {
                setLoadingTimeout(true);
            }, 10000); // 10 seconds

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

    const handleOpenCreateDocumentModal = () => {
        setIsCreateDocumentModalOpen(true);
    };

    const handleCloseCreateDocumentModal = () => {
        setIsCreateDocumentModalOpen(false);
        setFileToUpload(null);
    };


    const handleOpenWarningModal = (errors: string[]) => {
        setWarningErrors(errors);
        setIsWarningModalOpen(true);
    };

    const handleCloseWarningModal = () => {
        setIsWarningModalOpen(false);
        setWarningErrors([]);
        setFileToUpload(null);
    };

    const handleConfirmWarningModal = () => {
        if (fileToUpload) {
            handleOpenCreateDocumentModal();
        }
        setIsWarningModalOpen(false);
        setWarningErrors([]);
        setFileToUpload(null);
    };

    const handleUploadFile = useCallback(
        async (data: CreateDocumentFormData, file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("knowledge_id", id);
            formData.append("title", data.name);
            formData.append("description", data.description);

            try {
                handleUploadDocument(formData, {
                    onSuccess: () => {
                        addSuccess(
                            "Tải lên tài liệu thành công",
                            "Tài liệu đã được tải lên thành công"
                        );
                    },
                    onError: () => {
                        addError(
                            "Lỗi tải lên",
                            "Đã xảy ra lỗi khi tải lên tài liệu"
                        );
                    },
                });
            } catch {
                addError(
                    "Lỗi tải lên",
                    "Đã xảy ra lỗi không xác định khi tải lên tài liệu"
                );
            }
        },
        []
    );

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const validationResult = fileForTrainAI.validate(file);
                if (validationResult.blockingErrors.length > 0) {
                    addError(
                        "Tệp không hợp lệ",
                        validationResult.blockingErrors.join("\n")
                    );
                    return;
                }
                setFileToUpload(file);
                if (validationResult.warningErrors.length > 0) {
                    handleOpenWarningModal(validationResult.warningErrors);
                    return;
                }
                handleOpenCreateDocumentModal();
            }
        },
        [addError]
    );

    const handleFileUpload = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
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
            const file = e.dataTransfer.files[0];
            if (file) {
                const validationResult = fileForTrainAI.validate(file);
                if (validationResult.blockingErrors.length > 0) {
                    addError(
                        "Tệp không hợp lệ",
                        validationResult.blockingErrors.join("\n")
                    );
                    return;
                }
                setFileToUpload(file);
                if (validationResult.warningErrors.length > 0) {
                    handleOpenWarningModal(validationResult.warningErrors);
                    return;
                }
                handleOpenCreateDocumentModal();
            }
        },
        [addError]
    );

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
                        />
                        <ValidationInfo />
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <HistoryUploadFileDisplay knowledgeId={id} />
                    </div>
                </div>
            </div>
            <WarningModal
                isOpen={isWarningModalOpen}
                onClose={handleCloseWarningModal}
                onConfirm={handleConfirmWarningModal}
                errors={warningErrors}
            />
            <CreateDocumentModal
                isOpen={isCreateDocumentModalOpen}
                onClose={handleCloseCreateDocumentModal}
                uploadedFile={fileToUpload}
                handleUploadFile={handleUploadFile}
            />
        </div>
    );
}

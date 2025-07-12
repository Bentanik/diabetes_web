/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { use, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/admin/train-ai/[id]/upload/components/header";
import UploadArea from "@/app/admin/train-ai/[id]/upload/components/upload_area";
import ValidationInfo from "@/app/admin/train-ai/[id]/upload/components/validation_info";
import WarningModal from "@/app/admin/train-ai/[id]/upload/components/warning_modal";
import FileUploadCard from "@/app/admin/train-ai/[id]/upload/components/file_upload_card";
import { useNotification } from "@/context/notification_context";
import { useUploadDocument } from "@/app/admin/train-ai/[id]/upload/hooks/useUploadDocument";
import { fileForTrainAI } from "@/lib/validations/file_train_ai";
import { useGetActiveJobService } from "@/services/job/services";
import HistoryUploadFileDisplay from "@/app/admin/train-ai/[id]/upload/components/history_upload_file_display";

export default function UploadPageComponent({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [isDragOver, setIsDragOver] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [warningErrors, setWarningErrors] = useState<string[]>([]);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    // Thêm state cho upload UI
    const [uploadingFile, setUploadingFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const { handleUploadDocument } = useUploadDocument();
    const { addNotification } = useNotification();

    // Lấy job active (polling)
    const { job, refetch } = useGetActiveJobService();

    const mockKnowledgeBase = {
        id: "mock-id",
        name: "Bệnh tiểu đường",
        description: "Tài liệu và kiến thức về bệnh tiểu đường...",
        metadata: { useDescriptionForLLMCheck: true },
        document_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_size_mb: 0,
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
            processFileUpload(fileToUpload);
        }
        setIsWarningModalOpen(false);
        setWarningErrors([]);
        setFileToUpload(null);
    };

    // Hàm upload có progress UI
    const processFileUpload = useCallback(
        async (file: File) => {
            setUploadingFile(file);
            setUploadProgress(0);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("kb_name", id);

            try {
                handleUploadDocument(formData, {
                    onSuccess: () => {
                        setUploadingFile(null);
                        setUploadProgress(0);
                        refetch();
                    },
                    onError: (error) => {
                        setUploadingFile(null);
                        setUploadProgress(0);
                        addNotification({
                            title: error.title || "Lỗi tải lên",
                            message: error.detail || "Đã xảy ra lỗi khi tải lên tài liệu",
                            type: "error",
                            duration: 4000,
                            position: "top-right",
                        });
                    },
                });
            } catch {
                setUploadingFile(null);
                setUploadProgress(0);
                addNotification({
                    title: "Lỗi tải lên",
                    message: "Đã xảy ra lỗi không xác định khi tải lên tài liệu",
                    type: "error",
                    duration: 4000,
                    position: "top-right",
                });
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
                    addNotification({
                        title: "Tệp không hợp lệ",
                        message: validationResult.blockingErrors.join("\n"),
                        type: "error",
                        duration: 4000,
                        position: "top-right",
                    });
                    return;
                }
                if (validationResult.warningErrors.length > 0) {
                    setFileToUpload(file);
                    handleOpenWarningModal(validationResult.warningErrors);
                    return;
                }
                processFileUpload(file);
            }
        },
        [processFileUpload, addNotification]
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
                    addNotification({
                        title: "Tệp không hợp lệ",
                        message: validationResult.blockingErrors.join("\n"),
                        type: "error",
                        duration: 4000,
                        position: "top-right",
                    });
                    return;
                }
                if (validationResult.warningErrors.length > 0) {
                    setFileToUpload(file);
                    handleOpenWarningModal(validationResult.warningErrors);
                    return;
                }
                processFileUpload(file);
            }
        },
        [processFileUpload, addNotification]
    );

    const handleAddToKB = useCallback(() => {
        setTimeout(() => {
            router.push(`/admin/train-ai/knowledge-base/${id}`);
        }, 1000);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                knowledgeBase={mockKnowledgeBase}
                onGoBack={handleGoBack}
                onAddToKB={handleAddToKB}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <UploadArea
                        isDragOver={isDragOver}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onFileUpload={handleFileUpload}
                        job={job ?? null}
                    />
                    <ValidationInfo />
                </div>
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <FileUploadCard
                        uploadingFile={uploadingFile}
                        uploadProgress={uploadProgress}
                        job={job ?? null}
                    />
                    <HistoryUploadFileDisplay
                        kb_name={mockKnowledgeBase.name}
                    />
                </div>
            </div>
            <WarningModal
                isOpen={isWarningModalOpen}
                onClose={handleCloseWarningModal}
                onConfirm={handleConfirmWarningModal}
                errors={warningErrors}
            />
        </div>
    );
}

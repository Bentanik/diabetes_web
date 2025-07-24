/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { testHightLights } from "@/utils/test-hightlight";
import Header from "./header";
import DocumentChunks from "./document-chunks";
import {
    FileText,
    Loader2,
    AlertCircle,
    Minimize2,
    Maximize2,
} from "lucide-react";

const DocumentViewPdf = dynamic(
    () =>
        import(
            "@/app/admin/train-ai/document-detail/[id]/components/document-view-pdf"
        ),
    {
        ssr: false,
        loading: () => (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#248fca] mx-auto mb-4" />
                    <p className="text-gray-600 text-sm">
                        Đang tải trình xem PDF...
                    </p>
                </div>
            </div>
        ),
    }
);

interface HighlightData {
    id: string;
    content: {
        text?: string;
        image?: string;
    };
    position: {
        boundingRect: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            width: number;
            height: number;
            pageNumber?: number;
        };
        rects: Array<{
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            width: number;
            height: number;
            pageNumber?: number;
        }>;
        pageNumber: number;
    };
    comment: {
        text: string;
        emoji: string;
    };
    selected?: boolean;
}

interface DocumentDetailComponentProps {
    id: string;
}

// Mock document data based on ID
const getDocumentData = (id: string) => {
    const mockDocuments = {
        "123": {
            title: "Nghiên cứu về Đái tháo đường Type 2",
            description:
                "Tài liệu nghiên cứu chi tiết về bệnh đái tháo đường type 2, các phương pháp điều trị và phòng ngừa hiện đại trong y học.",
            uploadDate: "15/12/2023",
            lastModified: "20/12/2023",
            category: "Nội tiết - Đái tháo đường",
            status: "Đã phê duyệt",
            confidentiality: "Công khai",
            fileSize: "2.4 MB",
            pages: 24,
            version: "1.2",
        },
        default: {
            title: "Fast and Precise Type Checking for JavaScript",
            description:
                "Nghiên cứu về hệ thống kiểm tra kiểu dữ liệu cho JavaScript, phát triển bởi Facebook Inc. Tài liệu kỹ thuật chi tiết.",
            uploadDate: "20/11/2023",
            lastModified: "25/11/2023",
            category: "Công nghệ - Lập trình",
            status: "Đang xử lý",
            confidentiality: "Nội bộ",
            fileSize: "1.8 MB",
            pages: 12,
            version: "2.0",
        },
    };

    return (
        mockDocuments[id as keyof typeof mockDocuments] || mockDocuments.default
    );
};

const DocumentDetailComponent: React.FC<DocumentDetailComponentProps> = ({
    id,
}) => {
    const pdfViewerRef = useRef<{
        scrollToHighlight: (highlightId: string) => void;
    }>(null);

    // Mock document data
    const documentData = getDocumentData(id);
    const pdfUrl = "https://arxiv.org/pdf/1708.08021";

    const [highlights, setHighlights] = useState<HighlightData[]>(() => {
        return testHightLights.map((highlight) => ({
            ...highlight,
            selected: false,
        }));
    });

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pdfError, setPdfError] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-load first highlight when component mounts
    useEffect(() => {
        if (highlights.length > 0) {
            const firstHighlight = highlights[0];
            setHighlights((prev) =>
                prev.map((h) => ({
                    ...h,
                    selected: h.id === firstHighlight.id,
                }))
            );

            // Scroll to first highlight after a short delay
            setTimeout(() => {
                if (pdfViewerRef.current) {
                    pdfViewerRef.current.scrollToHighlight(firstHighlight.id);
                }
            }, 500);
        }
    }, []);

    const toggleSelection = (highlightId: string) => {
        setHighlights((prev) =>
            prev.map((h) => ({
                ...h,
                selected: h.id === highlightId ? !h.selected : false,
            }))
        );
    };

    const scrollToHighlight = (highlightId: string) => {
        // Đặt highlight được click thành selected, các highlight khác thành false
        setHighlights((prev) =>
            prev.map((h) => ({
                ...h,
                selected: h.id === highlightId,
            }))
        );

        // Scroll đến highlight với delay nhỏ để đảm bảo highlight được render
        setTimeout(() => {
            if (pdfViewerRef.current) {
                pdfViewerRef.current.scrollToHighlight(highlightId);
            }
        }, 100);
    };

    const refreshDocument = () => {
        setIsRefreshing(true);
        setPdfError(false);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    const selectedHighlights = highlights.filter((h) => h.selected);
    const totalPages = documentData.pages;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header documentData={documentData} documentId={id} />

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${
                    isFullscreen ? "fixed inset-0 z-50 bg-white pt-4 px-3" : ""
                }`}
            >
                <div
                    className={`flex gap-6 transition-all duration-300 ${
                        isFullscreen
                            ? "h-[calc(100vh-2rem)]"
                            : "h-[calc(100vh-140px)]"
                    }`}
                >
                    {/* Left Panel - Document Chunks */}
                    <div
                        className={`transition-all duration-300 ${
                            isFullscreen ? "w-[35%]" : "w-[45.5%]"
                        } h-full`}
                    >
                        <DocumentChunks
                            highlights={highlights}
                            onHighlightClick={scrollToHighlight}
                            onSelectionToggle={toggleSelection}
                        />
                    </div>

                    {/* Right Panel - PDF Viewer */}
                    <div
                        className={`transition-all duration-300 ${
                            isFullscreen ? "w-[65%]" : "w-[54.5%]"
                        } h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg relative`}
                        style={{
                            boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
                        }}
                    >
                        {/* PDF Header */}
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#248fca]/10 rounded-lg">
                                        <FileText className="w-4 h-4 text-[#248fca]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">
                                            Xem tài liệu PDF
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedHighlights.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-[#248fca]/10 text-[#248fca] rounded-full text-xs font-medium border border-[#248fca]/20">
                                                Trang{" "}
                                                {
                                                    selectedHighlights[0]
                                                        .position.pageNumber
                                                }{" "}
                                                / {totalPages}
                                            </span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() =>
                                            setIsFullscreen(!isFullscreen)
                                        }
                                        className="p-2 text-gray-600 hover:text-[#248fca] transition-colors rounded-lg hover:bg-gray-100"
                                        title={
                                            isFullscreen
                                                ? "Thoát toàn màn hình"
                                                : "Xem toàn màn hình"
                                        }
                                    >
                                        {isFullscreen ? (
                                            <Minimize2 className="w-4 h-4" />
                                        ) : (
                                            <Maximize2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* PDF Content */}
                        <div className="h-[calc(100%-80px)] relative">
                            {pdfError ? (
                                <div className="h-full flex items-center justify-center bg-red-50">
                                    <div className="text-center">
                                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-red-900 mb-2">
                                            Không thể tải tài liệu PDF
                                        </h3>
                                        <p className="text-red-700 text-sm mb-4">
                                            Đã xảy ra lỗi khi tải tài liệu PDF.
                                        </p>
                                        <button
                                            onClick={refreshDocument}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                        >
                                            Thử lại
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full">
                                    <DocumentViewPdf
                                        ref={pdfViewerRef}
                                        url={pdfUrl}
                                        highlights={selectedHighlights}
                                    />
                                </div>
                            )}

                            {/* Loading overlay */}
                            {isRefreshing && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#248fca] mx-auto mb-2" />
                                        <p className="text-gray-600 text-sm">
                                            Đang tải lại...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetailComponent;

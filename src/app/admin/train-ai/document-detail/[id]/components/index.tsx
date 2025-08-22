/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useRef, useState, useEffect } from "react";
import { testHightLights } from "@/utils/test-hightlight";
import Header from "./header";
import DocumentChunks from "./document-chunks";
import {
    useGetDocumentByIdService,
} from "@/services/train-ai/services";

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

const DocumentDetailComponent: React.FC<DocumentDetailComponentProps> = ({
    id,
}) => {
    const { data: documentData } = useGetDocumentByIdService(id);

    const pdfViewerRef = useRef<{
        scrollToHighlight: (highlightId: string) => void;
    }>(null);

    const [highlights, setHighlights] = useState<HighlightData[]>(() => {
        return testHightLights.map((highlight) => ({
            ...highlight,
            selected: false,
        }));
    });

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
        setHighlights((prev) =>
            prev.map((h) => ({
                ...h,
                selected: h.id === highlightId,
            }))
        );

        setTimeout(() => {
            if (pdfViewerRef.current) {
                pdfViewerRef.current.scrollToHighlight(highlightId);
            }
        }, 100);
    };

    // Single diabetes number (mock or from future API)
    const diabetesNumber = 126; // mg/dL

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {documentData && <Header documentData={documentData} />}

            <div className="min-h-[calc(100vh-140px)] p-6">
                {/* Main: keep only the left panel (Document Chunks) full width */}
                <div className="h-full">
                    <DocumentChunks
                        highlights={highlights}
                        onHighlightClick={scrollToHighlight}
                        onSelectionToggle={toggleSelection}
                        diabetesNumber={126}
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentDetailComponent;

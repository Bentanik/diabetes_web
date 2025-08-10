"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import SearchInput from "@/components/search";
import PaginatedComponent from "@/components/paginated";
import DocumentCard from "@/app/admin/train-ai/[id]/components/document_card";

// Mock documents
const MOCK_DOCUMENTS: API.TDocument[] = Array.from({ length: 23 }).map((_, i) => ({
    id: `${i + 1}`,
    knowledge_id: "kb-001",
    title: `Tài liệu kiến thức tiểu đường #${i + 1}`,
    description:
        i % 3 === 0
            ? "Tóm tắt ngắn về nội dung tài liệu, mô tả các khuyến nghị chăm sóc và chế độ ăn uống."
            : "",
    file: {
        path: "/docs/file.pdf",
        size_bytes: 1500000 + i * 1200,
        hash: "abc",
        file_type: i % 2 === 0 ? "pdf" : "docx",
    },
    progress: 100,
    type: i % 4 === 0 ? "upload_document" : "training_document",
    priority_diabetes: Math.round(Math.random() * 100) / 100,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: new Date(Date.now() - i * 3600000).toISOString(),
}));

export default function SearchMain() {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 8;

    const filtered = useMemo(() => {
        const key = searchTerm.trim().toLowerCase();
        const list = key
            ? MOCK_DOCUMENTS.filter((d) => d.title.toLowerCase().includes(key))
            : MOCK_DOCUMENTS;
        const total_pages = Math.max(1, Math.ceil(list.length / limit));
        const start = (page - 1) * limit;
        return {
            items: list.slice(start, start + limit),
            total_pages,
            total: list.length,
        };
    }, [searchTerm, page]);

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 mb-4 sm:mb-6"
                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-[#248fca]">Tìm kiếm tài liệu</h2>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{filtered.total} kết quả</p>
                    </div>
                    <SearchInput
                        searchTerm={searchTerm}
                        setSearchTerm={(v) => {
                            setPage(1);
                            setSearchTerm(v);
                        }}
                    />
                </div>
            </motion.div>

            <div className="min-h-[220px]">
                {filtered.items.length === 0 ? (
                    <div className="text-sm text-gray-500">Không có tài liệu phù hợp</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.items.map((doc) => (
                            <DocumentCard key={doc.id} document={doc} />
                        ))}
                    </div>
                )}
            </div>

            {filtered.total_pages > 1 && (
                <div className="mt-4 flex justify-center">
                    <PaginatedComponent
                        totalPages={filtered.total_pages}
                        currentPage={page}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
}



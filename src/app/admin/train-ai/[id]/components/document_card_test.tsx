"use client";

import DocumentCard from "./document_card";

// Mock data để test
const mockDocuments: API.TDocument[] = [
    {
        id: "doc-1",
        knowledge_id: "kb-1",
        title: "Hướng dẫn chăm sóc bệnh nhân tiểu đường type 2",
        description: "Tài liệu hướng dẫn chi tiết về cách chăm sóc và điều trị bệnh nhân mắc bệnh tiểu đường type 2. Bao gồm các phương pháp điều trị hiện đại, chế độ ăn uống phù hợp và cách theo dõi đường huyết hàng ngày để kiểm soát bệnh tốt nhất.",
        file: {
            path: "/documents/diabetes-care-guide.pdf",
            size_bytes: 2048576, // 2MB
            hash: "abc123",
            file_type: "pdf"
        },
        progress: 100,
        type: "upload_document",
        priority_diabetes: 0.85,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z"
    },
    {
        id: "doc-2",
        knowledge_id: "kb-1",
        title: "Báo cáo nghiên cứu insulin",
        description: "Nghiên cứu về hiệu quả của các loại insulin trong điều trị bệnh tiểu đường. Phân tích so sánh giữa insulin tác dụng nhanh và insulin tác dụng kéo dài, cũng như các phương pháp tiêm insulin hiệu quả nhất.",
        file: {
            path: "/documents/insulin-research.docx",
            size_bytes: 512000, // 500KB
            hash: "def456",
            file_type: "docx"
        },
        progress: 100,
        type: "training_document",
        priority_diabetes: 0.92,
        created_at: "2024-01-14T14:20:00Z",
        updated_at: "2024-01-14T14:20:00Z"
    },
    {
        id: "doc-3",
        knowledge_id: "kb-1",
        title: "Thực đơn dinh dưỡng cho người tiểu đường",
        description: "Hướng dẫn xây dựng thực đơn phù hợp cho bệnh nhân tiểu đường với các món ăn ít đường, giàu chất xơ và protein. Bao gồm cả thực đơn cho người type 1 và type 2 với lượng carb được tính toán cụ thể.",
        file: {
            path: "/documents/nutrition-menu.txt",
            size_bytes: 128000, // 125KB
            hash: "ghi789",
            file_type: "txt"
        },
        progress: 100,
        type: "upload_document",
        priority_diabetes: 0.45,
        created_at: "2024-01-13T09:15:00Z",
        updated_at: "2024-01-13T09:15:00Z"
    },
    {
        id: "doc-4",
        knowledge_id: "kb-1",
        title: "Tài liệu không liên quan đến tiểu đường",
        description: "Một tài liệu về chủ đề khác hoàn toàn không liên quan đến y tế hay tiểu đường. Có thể là tài liệu về công nghệ, kinh doanh hoặc các lĩnh vực khác được upload nhầm vào hệ thống.",
        file: {
            path: "/documents/other-topic.pdf",
            size_bytes: 1024000, // 1MB
            hash: "jkl012",
            file_type: "pdf"
        },
        progress: 100,
        type: "upload_document",
        priority_diabetes: 0.15,
        created_at: "2024-01-12T16:45:00Z",
        updated_at: "2024-01-12T16:45:00Z"
    }
];

export default function DocumentCardTest() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Document Card Test</h1>

            {/* Grid layout để test cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockDocuments.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>

            {/* Single card test */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Single Card Test</h2>
                <div className="w-64">
                    <DocumentCard document={mockDocuments[0]} />
                </div>
            </div>
        </div>
    );
}

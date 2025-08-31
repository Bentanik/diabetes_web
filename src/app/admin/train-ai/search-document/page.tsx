import { Metadata } from 'next';
import SearchDocumentComponent from "@/app/admin/train-ai/search-document/components";

export const metadata: Metadata = {
    title: "Tìm kiếm Tài liệu",
    description: "Tìm kiếm và khám phá tài liệu huấn luyện AI",
};

export default function SearchDocumentPage() {
    return (
        <div>
            <SearchDocumentComponent />
        </div>
    );
}

"use client";

import FolderList from "@/app/admin/train-ai/components/folder_list";
import Header from "@/app/admin/train-ai/components/header";

export default function TrainAIComponent() {
    return (
        <div>
            {/* Header trang */}
            <header>
                <Header />
            </header>
            {/* Nội dung chính - Danh sách thư mục */}
            <main>
                <FolderList />
            </main>
        </div>
    );
}

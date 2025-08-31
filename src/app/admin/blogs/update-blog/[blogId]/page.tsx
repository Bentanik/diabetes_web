"use client";

import React, { use } from "react";
import { Metadata } from 'next';
import UpdateBlogComponent from "../components";

export const metadata: Metadata = {
    title: "Cập nhật Blog",
    description: "Chỉnh sửa và cập nhật nội dung blog",
};

type BlogDetailPageProps = {
    params: Promise<{
        blogId: string;
    }>;
};

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { blogId } = use(params);

    // Kiểm tra blogId có hợp lệ không
    if (!blogId) {
        return (
            <div className="p-4">
                <h1 className="text-xl text-red-600">Không tìm thấy blog ID</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <UpdateBlogComponent blogId={blogId} />
        </div>
    );
}

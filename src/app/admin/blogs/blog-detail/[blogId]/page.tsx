import React from "react";
import { Metadata } from 'next';
import BlogDetail from "../components";

export const metadata: Metadata = {
    title: "Chi tiết Blog",
    description: "Xem chi tiết nội dung blog",
};

type BlogDetailPageProps = {
    params: Promise<{
        blogId: string;
    }>;
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { blogId } = await params;

    return (
        <div>
            <BlogDetail blogId={blogId} />
        </div>
    );
}

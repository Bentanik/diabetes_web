import React from "react";
import BlogDetail from "../components";

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

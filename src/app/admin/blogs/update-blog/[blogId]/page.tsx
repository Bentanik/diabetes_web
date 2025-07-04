import React from "react";
import UpdateBlogComponent from "../components";

type BlogDetailPageProps = {
    params: Promise<{
        blogId: string;
    }>;
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { blogId } = await params;

    return (
        <div>
            <UpdateBlogComponent blogId={blogId} />
        </div>
    );
}

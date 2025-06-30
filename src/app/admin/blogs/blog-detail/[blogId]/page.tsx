import React from "react";
import BlogDetail from "../components";

export default function BlogDetailPage({
    params,
}: {
    params: { blogId: string };
}) {
    return (
        <div>
            <BlogDetail blogId={params?.blogId} />
        </div>
    );
}

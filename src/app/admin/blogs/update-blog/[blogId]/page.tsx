import React from "react";
import UpdateBlogForm from "../components/update-blog-form";

export default function BlogUpdateFormPage({
    params,
}: {
    params: { blogId: string };
}) {
    return (
        <div>
            <UpdateBlogForm blogId={params?.blogId} />
        </div>
    );
}

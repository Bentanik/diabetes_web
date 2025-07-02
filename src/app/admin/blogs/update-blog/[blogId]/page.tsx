import React from "react";
import UpdateBlogComponent from "../components";

export default function BlogUpdateFormPage({
    params,
}: {
    params: { blogId: string };
}) {
    return (
        <div>
            <UpdateBlogComponent blogId={params?.blogId} />
        </div>
    );
}

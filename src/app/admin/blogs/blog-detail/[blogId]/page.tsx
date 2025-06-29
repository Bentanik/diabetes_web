"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function BlogDetailPage() {
    const params = useParams();
    const blogId = params.blogId;

    return <div>BlogDetail {blogId}</div>;
}

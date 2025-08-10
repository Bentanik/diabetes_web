"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/stores";
import { useGetBlogDetail } from "../hooks/use-get-blog";
import RejectedReason from "./rejected-reason-dialog";
import DeletePostDialog from "./delete-post-dialog";
import ReviewPostDialog from "./review-post-dialog";

export default function BlogDetail({ blogId }: REQUEST.BlogId) {
    const router = useRouter();
    const user = useAppSelector((state) => state.userSlice);
    const { blog_detail, isPending: blogPending } = useGetBlogDetail({
        blogId,
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div>
            {/* Header */}
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            <div className="mt-5 py-[2%] px-[10%] bg-[#ffffff] shadow-2xl rounded-2xl">
                {/* Header */}
                <div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-5">
                            <Link href="/admin/blogs">
                                <ArrowLeft color="#248fca" />
                            </Link>
                            <h1 className="text-2xl font-medium text-[var(--primary-color)]">
                                Chi tiết bài viết
                            </h1>
                        </div>
                        {blog_detail?.status === -1 && (
                            <div>
                                <RejectedReason
                                    reason={blog_detail.reasonRejected}
                                />
                            </div>
                        )}
                    </div>
                    <h1 className="text-[2.7rem] font-bold leading-[49px] mt-10">
                        {blog_detail?.title || "Chưa cập nhật tiêu đề bài viết"}
                    </h1>
                    <div className="flex mt-4 items-center gap-3">
                        <Image
                            src={
                                blog_detail?.doctor.imageUrl ||
                                "/images/default_user.png"
                            }
                            alt="doctor-avatar"
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium">
                                {blog_detail?.doctor.fullName ||
                                    "Chưa cập nhật bác sĩ"}
                            </p>
                            <p className="text-gray-400">
                                {blog_detail?.createdDate
                                    ? formatDate(blog_detail.createdDate)
                                    : "Không hiển thị ngày đăng"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div
                    className="mt-6 prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                        __html:
                            blog_detail?.contentHtml ||
                            "Chưa cập nhật nội dung cho bài viết",
                    }}
                />

                {/* Action with post status = -2 */}
                {blog_detail?.status === -2 && (
                    <div className="mt-10 flex justify-end gap-4">
                        <DeletePostDialog
                            blogId={blogId}
                            blogTitle={blog_detail.title}
                        />
                        <Link href={`/admin/blogs/update-blog/${blogId}`}>
                            <Button
                                variant="outline"
                                className="cursor-pointer px-6 py-6 min-w-[180px] bg-[#248FCA] hover:bg-[#2490cad8] text-white hover:text-white"
                            >
                                Chỉnh sửa bài viết
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Actions for pending blog (status: 0) */}
                {blog_detail?.status === 0 &&
                    user.user?.roles?.includes("SystemAdmin") && (
                        <div className="mt-10 flex justify-end gap-4">
                            <ReviewPostDialog blogId={blogId} />
                        </div>
                    )}
            </div>
        </div>
    );
}

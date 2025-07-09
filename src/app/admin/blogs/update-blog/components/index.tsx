"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import UpdateBlogForm from "@/app/admin/blogs/update-blog/components/update-blog-form";
import { BellIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

const Header = ({ blogId }: REQUEST.BlogId) => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital"
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-5">
                        {blogId ? (
                            <Link href={`/admin/blogs/blog-detail/${blogId}`}>
                                <ArrowLeft color="#248fca" />
                            </Link>
                        ) : null}

                        <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                            Tạo nội dung bài viết
                        </h1>
                    </div>
                    <p className="text-gray-600 mt-1 ml-11 text-sm">
                        Tạo bài viết mới
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <BellIcon className="w-5 h-5" />
                    </Button>
                    <div>
                        <ProfileHospitalMenu profile={1} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function UpdateBlogComponent({ blogId }: REQUEST.BlogId) {
    return (
        <div>
            {/* Header */}
            <header>
                <Header blogId={blogId} />
            </header>

            {/* Main */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6"
            >
                <UpdateBlogForm blogId={blogId} />
            </motion.div>
        </div>
    );
}

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import CreateBlogForm from "@/app/admin/blogs/create-blog/components/create-blog-form";
import { BellIcon } from "lucide-react";

const Header = () => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Tạo nội dung bài viết
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
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

export default function CreateBlogComponent() {
    return (
        <div>
            {/* Header */}
            <header>
                <Header />
            </header>

            {/* Main */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6"
            >
                <CreateBlogForm />
            </motion.div>
        </div>
    );
}

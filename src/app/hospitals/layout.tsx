"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { sidebar_items } from "@/constants/hospital";
import { LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function HospitalLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    const sidebarWidth = open ? 280 : 80;

    return (
        <div className="min-h-screen w-full font-be-vietnam-pro flex bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Sidebar */}
            <motion.section
                initial={{ width: 80 }}
                animate={{ width: open ? 280 : 80 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="fixed left-0 top-0 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl flex flex-col z-50 overflow-hidden"
            >
                {/* Header with Logo */}
                <motion.div
                    className="h-20 flex items-center justify-between px-4 border-b border-gray-100/50"
                    layout
                >
                    <div
                        className="flex items-center gap-3"
                        onClick={() => setOpen(!open)}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Image
                                src="/images/logo_icon1.png"
                                alt="DbDoctor Logo"
                                width={48}
                                height={48}
                                className="rounded-xl shadow-sm"
                            />
                        </motion.div>
                        <AnimatePresence mode="wait">
                            {open && (
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="text-xl font-bold bg-gradient-to-r from-[#248fca] to-[#1e7bb8] bg-clip-text text-transparent"
                                >
                                    DbDoctor
                                </motion.h1>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Menu Items */}
                <div className="flex-1 py-4 px-3 space-y-1">
                    {sidebar_items.map((item, index) => {
                        const isActive = pathname === item.href;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: index * 0.05,
                                    duration: 0.3,
                                    type: "spring",
                                    stiffness: 300,
                                }}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    "relative flex items-center px-3 py-3 cursor-pointer transition-all duration-300 rounded-xl group",
                                    open ? "gap-4" : "justify-center",
                                    isActive
                                        ? "bg-gradient-to-r from-[#248fca] to-[#1e7bb8] text-white shadow-lg shadow-[#248fca]/25"
                                        : "text-gray-600 hover:bg-gradient-to-r hover:from-[#248fca]/5 hover:to-[#248fca]/10 hover:text-[#248fca]"
                                )}
                            >
                                {/* Icon Container */}
                                <motion.div
                                    className={cn(
                                        "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                                        isActive
                                            ? "bg-white/20 backdrop-blur-sm"
                                            : "group-hover:bg-white/50 group-hover:shadow-sm"
                                    )}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <item.icon className="w-5 h-5 shrink-0" />

                                    {/* Tooltip for collapsed state */}
                                    {!open && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                                x: -10,
                                            }}
                                            whileHover={{
                                                opacity: 1,
                                                scale: 1,
                                                x: 0,
                                            }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 px-3 py-2 text-sm text-white bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
                                        >
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900/90 rotate-45"></div>
                                            {item.label}
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Label */}
                                <AnimatePresence mode="wait">
                                    {open && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{
                                                duration: 0.2,
                                                delay: 0.1,
                                            }}
                                            className="text-sm font-medium truncate"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Ripple Effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 bg-white pointer-events-none"
                                    initial={{ scale: 0 }}
                                    whileTap={{ scale: 1, opacity: 0.2 }}
                                    transition={{ duration: 0.1 }}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Logout Section */}
                <motion.div
                    className="border-t border-gray-100/50 p-3 mt-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                >
                    <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                            "relative flex items-center px-3 py-3 cursor-pointer transition-all duration-300 rounded-xl group",
                            open ? "gap-4" : "justify-center",
                            "text-gray-600 hover:bg-gradient-to-r hover:from-red-500/5 hover:to-red-500/10 hover:text-red-600"
                        )}
                    >
                        <motion.div
                            className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 group-hover:bg-red-500/10"
                            whileHover={{ scale: 1.1 }}
                        >
                            <LogOutIcon className="w-5 h-5" />

                            {!open && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                    whileHover={{ opacity: 1, scale: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 px-3 py-2 text-sm text-white bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
                                >
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900/90 rotate-45"></div>
                                    Đăng xuất
                                </motion.div>
                            )}
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {open && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                    className="text-sm font-medium"
                                >
                                    Đăng xuất
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Main Content */}
            <motion.div
                animate={{ marginLeft: sidebarWidth }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="flex-1 min-h-screen"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-6 h-full"
                >
                    {children}
                </motion.div>
            </motion.div>

            {/* Backdrop for mobile */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

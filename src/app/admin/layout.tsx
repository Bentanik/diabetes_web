"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { sidebar_items } from "@/constants/admin";
import { LogOutIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAppSelector } from "@/stores";

interface SidebarSubItem {
    label: string;
    href: string;
    icon?: React.ComponentType<any>;
}

interface SidebarItem {
    label: string;
    href: string;
    icon: React.ComponentType<any>;
    subItems?: SidebarSubItem[];
}

export default function HospitalLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [open, setOpen] = useState(true);
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const pathname = usePathname();
    const router = useRouter();

    const userState = useAppSelector((state) => state.userSlice);

    // Cho phép cả SystemAdmin và Moderator
    if (
        !userState.user?.roles?.includes("SystemAdmin") &&
        !userState.user?.roles?.includes("Moderator")
    ) {
        return (window.location.href = "/");
    }
    const sidebarWidth = open ? 280 : 80;

    const toggleExpanded = (index: number) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedItems(newExpanded);
    };

    const isItemActive = (item: SidebarItem) => {
        if (pathname === item.href) return true;
        if (item.subItems) {
            return item.subItems.some((subItem) => pathname === subItem.href);
        }
        return false;
    };

    const isSubItemActive = (href: string) => pathname === href;

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
                        className="flex items-center gap-3 cursor-pointer"
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
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {sidebar_items.map((item: SidebarItem, index) => {
                        const isActive = isItemActive(item);
                        const isExpanded = expandedItems.has(index);
                        const hasSubItems =
                            item.subItems && item.subItems.length > 0;

                        if (
                            userState.user?.roles?.includes("Moderator") &&
                            item.href !== "/admin/blogs"
                        ) {
                            return null;
                        }

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
                            >
                                {/* Main Menu Item */}
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (hasSubItems && open) {
                                            toggleExpanded(index);
                                        } else {
                                            router.push(item.href);
                                        }
                                    }}
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
                                                className="text-sm font-medium truncate flex-1"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Dropdown Arrow */}
                                    {hasSubItems && open && (
                                        <motion.div
                                            animate={{
                                                rotate: isExpanded ? 90 : 0,
                                            }}
                                            transition={{ duration: 0.2 }}
                                            className={cn(
                                                "w-4 h-4 shrink-0 transition-colors duration-200",
                                                isActive
                                                    ? "text-white/80"
                                                    : "text-gray-400"
                                            )}
                                        >
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </motion.div>
                                    )}

                                    {/* Ripple Effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 bg-white pointer-events-none"
                                        initial={{ scale: 0 }}
                                        whileTap={{ scale: 1, opacity: 0.2 }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </motion.div>

                                {/* Submenu Items */}
                                <AnimatePresence>
                                    {hasSubItems && isExpanded && open && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                height: 0,
                                                y: -10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                height: "auto",
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                                y: -10,
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4"
                                        >
                                            {item.subItems?.map(
                                                (subItem, subIndex) => {
                                                    const isSubActive =
                                                        isSubItemActive(
                                                            subItem.href
                                                        );

                                                    return (
                                                        <motion.div
                                                            key={subIndex}
                                                            initial={{
                                                                opacity: 0,
                                                                x: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    subIndex *
                                                                    0.05,
                                                                duration: 0.2,
                                                            }}
                                                            whileHover={{
                                                                x: 2,
                                                            }}
                                                            onClick={() =>
                                                                router.push(
                                                                    subItem.href
                                                                )
                                                            }
                                                            className={cn(
                                                                "flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-200 rounded-lg group text-sm -ml-3 mt-2",
                                                                isSubActive
                                                                    ? "bg-[#248fca]/10 text-[#248fca] font-medium pl-5"
                                                                    : "text-gray-500 hover:text-[#248fca] hover:bg-[#248fca]/5"
                                                            )}
                                                        >
                                                            {subItem.icon && (
                                                                <subItem.icon className="w-4 h-4 shrink-0" />
                                                            )}
                                                            <span className="truncate">
                                                                {subItem.label}
                                                            </span>

                                                            {/* Active indicator */}
                                                            {isSubActive && (
                                                                <motion.div
                                                                    layoutId="subItemIndicator"
                                                                    className="w-2 h-2 bg-[#248fca] rounded-full ml-auto"
                                                                    transition={{
                                                                        type: "spring",
                                                                        stiffness: 500,
                                                                        damping: 30,
                                                                    }}
                                                                />
                                                            )}
                                                        </motion.div>
                                                    );
                                                }
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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

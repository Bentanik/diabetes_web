/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { BellIcon, Calendar1Icon, LogOutIcon, MessageSquareQuoteIcon, SettingsIcon, SquareLibraryIcon, User2Icon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

export default function ProfileHospitalMenu({ profile }: { profile: any }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative font-be-vietnam-pro" ref={menuRef}>
            {profile ? (
                <div>
                    <div className="relative w-13 h-13 rounded-full cursor-pointer group select-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <img
                            src="/images/home.jpg"
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </div>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-[250px] bg-white shadow-lg rounded-lg p-2 border">
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[14px] flex items-center gap-x-6"
                                onClick={() => router.push("/profile")}
                            >
                                <div className="w-8 h-8 object-cover rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 object-cover" />
                                </div>
                                <span>
                                    Trang cá nhân
                                </span>
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[14px] flex items-center gap-x-6"
                                onClick={() => router.push("/profile")}
                            >
                                <div className="w-8 h-8 object-cover rounded-full bg-gray-200 flex items-center justify-center">
                                    <SquareLibraryIcon className="w-5 h-5 object-cover" />
                                </div>
                                <span>
                                    Khóa học của tôi
                                </span>
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[14px] flex items-center gap-x-6"
                                onClick={() => router.push("/profile")}
                            >
                                <div className="w-8 h-8 object-cover rounded-full bg-gray-200 flex items-center justify-center">
                                    <User2Icon className="w-5 h-5 object-cover" />
                                </div>
                                <span>
                                    Học viên của tôi
                                </span>
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[14px] flex items-center gap-x-6"
                                onClick={() => router.push("/profile")}
                            >
                                <div className="w-8 h-8 object-cover rounded-full bg-gray-200 flex items-center justify-center">
                                    <Calendar1Icon className="w-5 h-5 object-cover" />
                                </div>
                                <span>
                                    Lịch trình
                                </span>
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[14px] flex items-center gap-x-6"
                                onClick={() => router.push("/profile")}
                            >
                                <div className="w-8 h-8 object-cover rounded-full bg-gray-200 flex items-center justify-center">
                                    <BellIcon className="w-5 h-5 object-cover" />
                                </div>
                                <span>
                                    Thông báo
                                </span>
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[14px] flex items-center gap-x-6"
                                onClick={() => router.push("/profile")}
                            >
                                <div className="w-8 h-8 object-cover rounded-full bg-gray-200 flex items-center justify-center">
                                    <MessageSquareQuoteIcon className="w-5 h-5 object-cover" />
                                </div>
                                <span>
                                    Hộp thư
                                </span>
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[14px] flex items-center gap-x-6"
                                onClick={() => router.push("/profile")}
                            >
                                <div className="w-8 h-8 object-cover rounded-full bg-gray-200 flex items-center justify-center">
                                    <SettingsIcon className="w-5 h-5 object-cover" />
                                </div>
                                <span>
                                    Cài đặt
                                </span>
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[14px] flex items-center gap-x-6"
                                onClick={() => router.push("/profile")}
                            >
                                <div className="w-8 h-8 object-cover rounded-full bg-gray-200 flex items-center justify-center">
                                    <LogOutIcon className="w-5 h-5 object-cover" />
                                </div>
                                <span className="font-[600]">
                                    Đăng xuất
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    className="px-3 py-2 cursor-pointer"
                    onClick={() => router.push("/login")}
                >
                    <span className="ml-2 hidden md:inline">Đăng nhập</span>
                </Button>
            )}
        </div>
    );
}

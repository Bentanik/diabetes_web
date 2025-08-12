"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Shield, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BlurText from "@/components/ui/blur-text";

export default function HomeHero() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background với gradient đẹp và hiệu ứng */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                {/* Floating elements for visual appeal */}q
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-bounce delay-500"></div>
            </div>

            <div className="relative z-10 flex items-center justify-between gap-x-9 md:px-[66px] lg:px-16 xl:px-24 py-12 md:py-20 font-be-vietnam-pro mx-auto">
                {/* Nội dung bên trái */}
                <motion.div
                    className="w-full lg:w-[55%] py-8 rounded-2xl"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Sparkles className="w-4 h-4" />
                        Công nghệ AI tiên tiến
                    </motion.div>

                    <BlurText
                        text="Đồng hành cùng bệnh nhân đái tháo đường, mọi lúc – mọi nơi"
                        delay={150}
                        animateBy="words"
                        direction="top"
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#248fca] bg-clip-text bg-gradient-to-r  from-blue-600 via-blue-700 to-cyan-600 leading-[1.2] font-be-vietnam-pro mb-6"
                    />

                    <motion.p
                        className="text-lg md:text-xl leading-relaxed text-gray-600 max-w-[650px] mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <span className="text-[#248fca] font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                            DbDoctor
                        </span>
                        {" - "}
                        Ứng dụng kết nối bác sĩ, bệnh nhân và trí tuệ nhân tạo
                        để chăm sóc người bệnh đái tháo đường toàn diện hơn.
                        Không chỉ là công nghệ, mà là người bạn đồng hành trong
                        hành trình vì sức khỏe.
                    </motion.p>

                    {/* Feature highlights */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Heart className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                Chăm sóc 24/7
                            </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                Bảo mật tuyệt đối
                            </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                Kết nối bác sĩ
                            </span>
                        </div>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                    >
                        <Button className="group h-[40px] relative px-8 py-4 bg-[#248fca] text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer">
                            <span className="relative z-10 flex items-center gap-2">
                                Bắt đầu ngay
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-cyan-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Button>
                        <Button
                            variant="outline"
                            className="px-8 py-4 h-[40px] border-2 border-blue-200 text-lg text-gray-600 font-semibold rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-[#248fca] transition-all duration-300 cursor-pointer"
                        >
                            Tìm hiểu thêm
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Hình ảnh bên phải */}
                <motion.div
                    className="hidden lg:flex flex-grow justify-end"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="relative">
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl"></div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 blur-xl"></div>

                        <figure className="flex items-center justify-end gap-4">
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                <Image
                                    src="/images/home_diabet.jpg"
                                    alt="Healthcare professional"
                                    width={320}
                                    height={500}
                                    className="rounded-2xl object-cover shadow-2xl border border-white/20"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
                            </motion.div>

                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                            >
                                <Image
                                    src="/images/home_diabet2.jpg"
                                    alt="Medical consultation"
                                    width={280}
                                    height={320}
                                    className="rounded-2xl object-cover shadow-xl border border-white/20 h-[320px]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent rounded-2xl"></div>
                            </motion.div>
                        </figure>

                        {/* Floating info cards */}
                        <motion.div
                            className="absolute top-8 -left-12 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        24/7 Hỗ trợ
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Luôn sẵn sàng
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-8 -right-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-100"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        An toàn 100%
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Bảo mật tối đa
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

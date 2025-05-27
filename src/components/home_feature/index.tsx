'use client'

import React from 'react'
import { motion } from "framer-motion";
import { FEATURES } from '@/constants/home';
import Image from 'next/image';

export default function HomeFeature() {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="mx-auto px-6 md:px-10 lg:px-20">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-[#248fca] mb-4">
                        Tính năng nổi bật
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        DbDoctor tích hợp AI và kiến thức y khoa giúp bệnh nhân tiểu đường nhận được hỗ trợ nhanh chóng, chính xác và nhân văn.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 flex flex-col md:flex-row items-center gap-8"
                            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#248fca] mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <Image
                                    src="/images/phone_feature.png"
                                    alt="feature"
                                    width={200}
                                    height={350}
                                    className="rounded-[2rem] shadow-lg border border-white/20"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

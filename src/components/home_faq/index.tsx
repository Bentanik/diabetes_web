'use client'

import React from 'react'
import { motion } from "framer-motion";
import { Plus, Minus } from 'lucide-react';
import { HOME_FAQ } from '@/constants/home';

export default function HomeFAQ() {

    const [openIndex, setOpenIndex] = React.useState<number | null>(0);

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-200/10 rounded-full blur-3xl"></div>

            <div className="mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-[#248fca] mb-4">
                        Câu hỏi thường gặp
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Những thắc mắc phổ biến về DbDoctor
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="max-w-4xl mx-auto">
                    {HOME_FAQ.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                                <button
                                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-blue-50 transition-colors duration-300"
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 pr-4">
                                        {faq.question}
                                    </h3>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0"
                                    >
                                        {openIndex === index ? (
                                            <Minus className="w-6 h-6 text-[#248fca]" />
                                        ) : (
                                            <Plus className="w-6 h-6 text-[#248fca]" />
                                        )}
                                    </motion.div>
                                </button>

                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openIndex === index ? "auto" : 0,
                                        opacity: openIndex === index ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-8 pb-6 pt-0">
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );

}

import React from 'react'
import { motion } from "framer-motion";
import { TARGET_GROUPS } from '@/constants/home';

export default function HomeUseWhom() {
    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200/10 rounded-full blur-3xl"></div>

            <div className="mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-[#248fca] mb-6">
                        Dành cho ai?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        DbDoctor được thiết kế để phục vụ cả nhân viên y tế và bệnh nhân,
                        tạo ra một hệ sinh thái chăm sóc sức khỏe toàn diện
                    </p>
                </motion.div>

                {/* Target Groups */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {TARGET_GROUPS.map((group, groupIndex) => (
                        <motion.div
                            key={groupIndex}
                            className={`relative bg-gradient-to-br ${group.bgGradient} rounded-3xl p-8 shadow-lg border border-white/50 backdrop-blur-sm`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: groupIndex * 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02, y: -5 }}
                        >
                            {/* Group Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <motion.div
                                    className={`w-16 h-16 bg-gradient-to-r ${group.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <group.icon className="w-8 h-8 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                                        {group.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="space-y-6">
                                {group.features.map((feature, featureIndex) => (
                                    <motion.div
                                        key={featureIndex}
                                        className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-300"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: (groupIndex * 0.2) + (featureIndex * 0.1) }}
                                        viewport={{ once: true }}
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className={`w-12 h-12 bg-gradient-to-r ${group.gradient} bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <feature.icon className={`w-6 h-6 text-white ${group.gradient}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                                {feature.title}
                                            </h4>
                                            <p className="text-gray-600 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import React from "react";
import { motion } from "framer-motion";
import { TARGET_GROUPS } from "@/constants/home";
import Image from "next/image";

export default function HomeUseWhom() {
    // Tách TARGET_GROUPS thành 2 nhóm
    const hospitalGroup = TARGET_GROUPS[0]; // Bệnh viện và nhân viên y tế
    const patientGroup = TARGET_GROUPS[1]; // Bệnh nhân đái tháo đường

    return (
        <section className="py-16">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-[3rem] text-[#248FCA] font-bold mb-6">
                        Dành cho ai?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        DbDoctor được thiết kế để phục vụ cả nhân viên y tế và
                        bệnh nhân, tạo ra một hệ sinh thái chăm sóc sức khỏe
                        toàn diện
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="space-y-24 px-[100px]">
                    {/* Section 1 - Hospital & Staff */}
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {/* Content */}
                        <div className="space-y-8">
                            <h3 className="text-[2.5rem] font-bold">
                                {hospitalGroup.title}
                            </h3>

                            {hospitalGroup.features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="space-y-3"
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.4 + index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <h4 className="text-xl font-semibold">
                                        {feature.title}
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Image */}
                        <motion.div
                            className="w-full flex items-center justify-center"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <Image
                                src="/images/intro1.jpg"
                                alt="Healthcare professional"
                                width={400}
                                height={450}
                                className="rounded-2xl object-cover shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Section 2 - Patients */}
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        {/* Image */}
                        <motion.div
                            className="w-full flex items-center justify-center"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                            viewport={{ once: true }}
                        >
                            <Image
                                src="/images/intro2.jpg"
                                alt="Patient care"
                                width={400}
                                height={450}
                                className="rounded-2xl object-cover shadow-2xl"
                            />
                        </motion.div>

                        {/* Content */}
                        <div className="space-y-8">
                            <h3 className="text-[2.5rem] font-bold">
                                {patientGroup.title}
                            </h3>

                            {patientGroup.features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="space-y-3"
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 1.2 + index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <h4 className="text-xl font-semibold">
                                        {feature.title}
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

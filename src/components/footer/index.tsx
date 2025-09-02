import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import {
    ChevronRight,
    Heart,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="relative bg-gray-900 text-white overflow-hidden">
            {/* Background Effects */}
            <div className="relative z-10 mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-[#248fca] to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Heart className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-4xl font-bold text-transparent">
                                    DbDoctor
                                </h3>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                                Đồng hành cùng bệnh nhân đái tháo đường với công
                                nghệ AI tiên tiến và đội ngũ bác sĩ chuyên khoa
                                hàng đầu.
                                <span className="text-[#248fca] font-semibold">
                                    {" "}
                                    Chăm sóc sức khỏe thông minh, tận tâm.
                                </span>
                            </p>
                            <div className="space-y-4">
                                <motion.div
                                    className="flex items-center gap-4 p-3 rounded-xl border border-white/10 transition-all duration-300"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">
                                            Email
                                        </p>
                                        <p className="text-white font-medium">
                                            contact@dbdoctor.vn
                                        </p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="flex items-center gap-4 p-3 rounded-xl border border-white/10 transition-all duration-300"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">
                                            Hotline
                                        </p>
                                        <p className="text-white font-medium">
                                            1900 1234
                                        </p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="flex items-center gap-4 p-3 rounded-xl border border-white/10 transition-all duration-300"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">
                                            Địa chỉ
                                        </p>
                                        <p className="text-white font-medium">
                                            S2.05 Vinhome grandpark, Việt Nam
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-2xl font-bold mb-8 text-white relative">
                            Liên kết nhanh
                            <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#248fca] to-cyan-400 rounded-full"></div>
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Trang chủ", href: "#" },
                                { name: "Về chúng tôi", href: "#" },
                                { name: "Dịch vụ", href: "#" },
                                { name: "Bác sĩ", href: "#" },
                                { name: "Liên hệ", href: "#" },
                                { name: "Hỗ trợ", href: "#" },
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 10,
                                    }}
                                >
                                    <a
                                        href={item.href}
                                        className="text-gray-300 hover:text-[#248fca] transition-all duration-300 flex items-center gap-2 group"
                                    >
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#248fca] transition-all duration-300" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                                            {item.name}
                                        </span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social Media & App Download */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-2xl font-bold mb-8 text-white relative">
                            Kết nối với chúng tôi
                            <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#248fca] to-cyan-400 rounded-full"></div>
                        </h4>

                        <div className="flex flex-wrap gap-3 mb-8">
                            {[
                                {
                                    icon: Facebook,
                                    href: "#",
                                    bgColor: "from-blue-600 to-blue-700",
                                    name: "Facebook",
                                },
                                {
                                    icon: Twitter,
                                    href: "#",
                                    bgColor: "from-sky-500 to-sky-600",
                                    name: "Twitter",
                                },
                                {
                                    icon: Instagram,
                                    href: "#",
                                    bgColor: "from-pink-500 to-rose-600",
                                    name: "Instagram",
                                },
                                {
                                    icon: Linkedin,
                                    href: "#",
                                    bgColor: "from-blue-700 to-blue-800",
                                    name: "LinkedIn",
                                },
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    className={`w-12 h-12 bg-gradient-to-r ${social.bgColor} rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    title={social.name}
                                >
                                    <social.icon className="w-6 h-6 relative z-10" />
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.a>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-[#248fca]/10 to-cyan-500/10 backdrop-blur-sm border border-[#248fca]/20 rounded-2xl p-6">
                            <h5 className="text-white font-semibold mb-3">
                                Tải ứng dụng DbDoctor
                            </h5>
                            <p className="text-gray-300 text-sm mb-4">
                                Trải nghiệm đầy đủ trên mobile
                            </p>
                            <div className="flex flex-col gap-3">
                                <Button className="w-full bg-gradient-to-r from-[#248fca] to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                                            <Image
                                                src="/images/appstore_icon.png"
                                                alt="App Store"
                                                width={24}
                                                height={24}
                                            />
                                        </div>
                                        <span>App Store</span>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-2 border-[#248fca]/50 text-[#248fca] hover:text-[#248fca] font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                                            <Image
                                                src="/images/chplay_icon.png"
                                                alt="Google Play"
                                                width={24}
                                                height={24}
                                            />
                                        </div>
                                        <span>Google Play</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    className="relative mt-16 pt-8 border-t border-white/10 text-center text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    © {new Date().getFullYear()} DbDoctor. All rights reserved.
                </motion.div>
            </div>
        </footer>
    );
}

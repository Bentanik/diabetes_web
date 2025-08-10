"use client";

import AuthCarousel from "@/components/auth_carousel";
import { MoveLeftIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/stores";
// import { useStepAuth } from "@/context/step_auth_context";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // const { handlePrevious } = useStepAuth();
    // const userState = useAppSelector((state) => state.userSlice);

    // if (
    //     userState.user?.roles?.includes("SystemAdmin") ||
    //     userState.user?.roles?.includes("Moderator")
    // ) {
    //     return (window.location.href = "/admin/home");
    // }
    // if (userState.user?.roles?.includes("HospitalStaff")) {
    //     return (window.location.href = "/hospitals/home");
    // }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex min-h-screen bg-gradient-to-br from-[#248fca]/5 via-white to-[#248fca]/10"
        >
            {/* Bên trái */}
            <motion.section
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-1 flex flex-col justify-between bg-white/80 backdrop-blur-sm auth-left rounded-3xl m-4 mr-2"
            >
                {/* Nút Previous */}
                <div className="z-[100] absolute top-2 left-6 w-[95%] flex items-center justify-between">
                    <div>
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/images/logo_icon1.png"
                                alt="DbDoctor Logo"
                                width={60}
                                height={60}
                            />
                            <h1 className="text-2xl font-bold text-[#248fca]">
                                DbDoctor
                            </h1>
                        </Link>
                    </div>
                    <motion.div
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="my-[24px] mx-[24px]"
                    >
                        <button
                            type="button"
                            className="w-12 h-12 backdrop-blur-md border border-[#248fca]/20 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer hover:bg-[var(--primary-color)] group"
                            // onClick={handlePrevious}
                        >
                            <MoveLeftIcon className="w-5 h-5 text-[#248fca]  transition-colors group-hover:text-white!" />
                        </button>
                    </motion.div>
                </div>

                {/* Nội dung chính */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex-grow flex items-center justify-start relative z-[10]"
                >
                    <div className="max-w-[700px] w-full">{children}</div>
                </motion.div>

                {/* Footer decoration */}
            </motion.section>

            {/* Bên phải */}
            <motion.section
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="hidden md:flex md:w-[50%] lg:w-[50%] xl:w-[50%] relative rounded-3xl overflow-hidden m-4 ml-2 shadow-2xl"
            >
                <AuthCarousel />
            </motion.section>
        </motion.div>
    );
}

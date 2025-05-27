'use client';

import { motion } from "framer-motion";
import InputAuth from "@/components/input_auth";
import useLogin from "@/app/(auth)/login/hooks/useLogin";
import useToast from "@/hooks/use-toast";
import { LogIn, Lock } from "lucide-react";

export default function LoginForm() {
    const { addToast } = useToast();
    const { register, handleSubmit, errors, onSubmit } = useLogin();

    const handleForgotPassword = () => {
        addToast({
            type: "warning",
            description: "Tính năng đang phát triển"
        })
    }

    return (
        <div className="flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Header Section */}
                <div className="text-center mb-8">
                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h1 className="text-4xl leading-14 font-bold bg-gradient-to-r from-[#248fca] to-[#1e7bb8] bg-clip-text text-transparent mb-4">
                            Đăng nhập
                        </h1>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Bắt đầu hành trình hỗ trợ y tế thông minh
                        </p>
                    </motion.div>
                </div>

                {/* Login Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-5">
                        <InputAuth
                            type="text"
                            title="Email"
                            register={register("email")}
                            error={errors.email?.message}
                        />

                        <InputAuth
                            type="password"
                            title="Mật khẩu"
                            register={register("password")}
                            error={errors.password?.message}
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm text-[#248fca] hover:text-[#1e7bb8] font-medium transition-colors duration-200 hover:underline cursor-pointer"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>

                    {/* Login Button */}
                    <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-[#248fca] to-[#1e7bb8] text-white text-base font-semibold rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
                    >
                        <Lock className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        Đăng nhập ngay
                        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    );
}

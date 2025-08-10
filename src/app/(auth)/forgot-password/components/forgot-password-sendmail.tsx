"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import useForgotPasswordEmail from "@/app/(auth)/forgot-password/hooks/useForgotPasswordEmail";
import InputAuth from "@/components/input_auth";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordSendMail() {
  const { register, errors, handleSubmit, onSubmit } = useForgotPasswordEmail();

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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="text-4xl leading-14 font-bold bg-gradient-to-r from-[#248fca] to-[#1e7bb8] bg-clip-text text-transparent mb-4">
              Quên mật khẩu
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Nhập email để bắt đầu quá trình khôi phục mật khẩu
            </p>
          </motion.div>
        </div>

        {/* Forgot Password Form */}
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
              error={errors?.email?.message}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className={`w-full mt-8 px-8 py-4 text-white text-base font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer ${
              Object.keys(errors).length === 0
                ? "bg-gradient-to-r from-[#248fca] to-[#1e7bb8] hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Gửi yêu cầu
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="inline-flex items-center gap-2 text-[#248fca] hover:text-[#1e7bb8] font-medium transition-colors duration-200 hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </motion.button>
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

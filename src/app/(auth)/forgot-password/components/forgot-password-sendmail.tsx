'use client'

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import useForgotPasswordEmail from "@/app/(auth)/forgot-password/hooks/useForgotPasswordEmail";
import InputAuth from "@/components/input_auth";
import React from "react";

interface ForgotPasswordSendMailProps {
  onSuccess: (step: 'sendmail' | 'otp', email: string) => void;
}

export default function ForgotPasswordSendMail({ onSuccess }: ForgotPasswordSendMailProps) {
  const { register, errors, handleSubmit, onSubmit, isSuccess, email } = useForgotPasswordEmail();

  // Call onSuccess when email is sent successfully
  React.useEffect(() => {
    if (isSuccess && email) {
      onSuccess('otp', email);
    }
  }, [isSuccess, email, onSuccess]);

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
          className="space-y-8"
        >
          <div className="space-y-6">
            <InputAuth
              type="text"
              title="Email"
              register={register("email")}
              error={errors?.email?.message}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className={`w-full mt-6 px-6 py-3 text-white text-base font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 cursor-pointer ${
              Object.keys(errors).length === 0
                ? "bg-gradient-to-r from-[#248fca] to-[#1e7bb8] hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Mail className="w-4 h-4" />
            Gửi email khôi phục
          </button>
        </motion.form>

        {/* Back to Login */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <Link href="/login">
            <button className="inline-flex items-center gap-2 text-[#248fca] hover:text-[#1e7bb8] font-semibold text-lg transition-colors duration-200 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
              Quay lại đăng nhập
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

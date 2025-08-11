'use client'

import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import InputAuth from "@/components/input_auth";
import useForgotPasswordOtp from "@/app/(auth)/forgot-password/hooks/useForgotPasswordOtp";

interface ForgotPasswordOtpProps {
  email: string;
  onBack: () => void;
}

export default function ForgotPasswordOtp({ email, onBack }: ForgotPasswordOtpProps) {
  const { 
    register, 
    errors, 
    handleSubmit, 
    onSubmit,
    otpValue, 
    handleOtpChange 
  } = useForgotPasswordOtp({ email });

  const renderListOtp = () => {
    const hasError = !!errors.otp;
    
    return (
      <InputOTP maxLength={6} value={otpValue} onChange={handleOtpChange} className="w-full">
        <InputOTPGroup className="w-full flex justify-center gap-3">
          <InputOTPSlot 
            index={0} 
            className={`w-12 h-12 text-lg font-semibold border-2 rounded-lg transition-colors duration-200 ${
              hasError 
                ? "border-red-300 focus:border-red-500 bg-red-50" 
                : "border-gray-300 focus:border-[#248fca] bg-white"
            }`} 
          />
          <InputOTPSlot 
            index={1} 
            className={`w-12 h-12 text-lg font-semibold border-2 rounded-lg transition-colors duration-200 ${
              hasError 
                ? "border-red-300 focus:border-red-500 bg-red-50" 
                : "border-gray-300 focus:border-[#248fca] bg-white"
            }`} 
          />
          <InputOTPSlot 
            index={2} 
            className={`w-12 h-12 text-lg font-semibold border-2 rounded-lg transition-colors duration-200 ${
              hasError 
                ? "border-red-300 focus:border-red-500 bg-red-50" 
                : "border-gray-300 focus:border-[#248fca] bg-white"
            }`} 
          />
          <InputOTPSlot 
            index={3} 
            className={`w-12 h-12 text-lg font-semibold border-2 rounded-lg transition-colors duration-200 ${
              hasError 
                ? "border-red-300 focus:border-red-500 bg-red-50" 
                : "border-gray-300 focus:border-[#248fca] bg-white"
            }`} 
          />
          <InputOTPSlot 
            index={4} 
            className={`w-12 h-12 text-lg font-semibold border-2 rounded-lg transition-colors duration-200 ${
              hasError 
                ? "border-red-300 focus:border-red-500 bg-red-50" 
                : "border-gray-300 focus:border-[#248fca] bg-white"
            }`} 
          />
          <InputOTPSlot 
            index={5} 
            className={`w-12 h-12 text-lg font-semibold border-2 rounded-lg transition-colors duration-200 ${
              hasError 
                ? "border-red-300 focus:border-red-500 bg-red-50" 
                : "border-gray-300 focus:border-[#248fca] bg-white"
            }`} 
          />
        </InputOTPGroup>
      </InputOTP>
    );
  };

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
              Thay đổi mật khẩu
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Mã OTP đã được gửi đến <span className="font-semibold text-[#248fca]">{email}</span>, vui lòng nhập mã và mật khẩu cần thay đổi để hoàn thành!
            </p>
          </motion.div>
        </div>

        {/* OTP Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* OTP Input */}
          <div className="space-y-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Mã OTP
              </label>
              <div className="flex justify-center mb-2">
                {renderListOtp()}
              </div>
              {errors.otp && (
                <div className="text-center">
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block">
                    {errors.otp.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Password Inputs */}
          <div className="space-y-5">
            <InputAuth
              type="password"
              title="Mật khẩu mới"
              register={register("password")}
              error={errors.password?.message}
            />
            
            <InputAuth
              type="password"
              title="Xác nhận mật khẩu mới"
              register={register("confirm_password")}
              error={errors.confirm_password?.message}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={otpValue === ""}
            className={`w-full mt-8 px-6 py-3 text-white text-base font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 cursor-pointer ${
              otpValue !== ""
                ? "bg-gradient-to-r from-[#248fca] to-[#1e7bb8] hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Lock className="w-4 h-4" />
            Xác nhận thay đổi
          </button>
        </motion.form>

        {/* Back to Send Mail */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#248fca] hover:text-[#1e7bb8] font-semibold text-lg transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại gửi email
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

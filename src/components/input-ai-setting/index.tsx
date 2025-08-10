"use client";

import { Input } from "@/components/ui/input";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputSettingProps {
    type?: "text" | "number" | "email" | "password" | "tel" | "url";
    // register: UseFormRegisterReturn;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    className?: string;
}

export default function InputSettingAI({
    type = "text",
    // register,
    error,
    placeholder = "",
    disabled = false,
    min,
    max,
    step,
    className = "",
}: InputSettingProps) {
    return (
        <div className="w-full">
            <div className="relative">
                <Input
                    type={type}
                    className={`
            w-full px-[20px] py-[22px] rounded-xl border-2 bg-gray-50
            text-sm font-medium text-gray-800 input-auth
            transition duration-200 focus:outline-none focus-visible:ring-0
            ${
                error
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus-visible:border-[#248fca]"
            }
            ${className}
          `}
                    autoComplete="off"
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    step={step}
                    // {...register}
                    disabled={disabled}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
}

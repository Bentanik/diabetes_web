"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputAuthProps {
    type: "text" | "password";
    title: string;
    register: UseFormRegisterReturn;
    error?: string;
}

export default function InputAuth({
    type,
    title,
    register,
    error,
}: InputAuthProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [hasText, setHasText] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isLabelFloating = isFocused || hasText;

    return (
        <div className="w-full">
            <div className="relative">
                {/* Floating Label */}
                <label
                    className={`
            absolute left-3 transition-all duration-200 ease-in-out pointer-events-none
            font-medium bg-gray-50 px-2
            ${
                isLabelFloating
                    ? "-top-2 text-xs text-[#248fca] z-10"
                    : "top-1/2 text-[15px] text-gray-500 transform -translate-y-1/2 bg-transparent px-0"
            }
          `}
                >
                    {title}
                </label>

                <Input
                    type={
                        type === "password" && !showPassword
                            ? "password"
                            : "text"
                    }
                    className={`
            w-full px-[20px] py-[22px] rounded-xl border-2 bg-gray-50
            text-lg font-medium text-gray-800 input-auth
            transition duration-200 focus:outline-none focus-visible:ring-0
            ${
                error
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#248fca]"
            }
            ${type === "password" ? "pr-12" : "pr-5"}
          `}
                    autoComplete="off"
                    {...register}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => {
                        setHasText(e.target.value.length > 0);
                        // Call the original onChange from register if it exists
                        if (register.onChange) {
                            register.onChange(e);
                        }
                    }}
                />

                {type === "password" && hasText && (
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeOffIcon className="w-5 h-5" />
                        ) : (
                            <EyeIcon className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
}

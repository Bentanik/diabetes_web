"use client"

import { Input } from "@/components/ui/input"
import type { UseFormRegisterReturn } from "react-hook-form"

interface InputTrainAIProps {
    type: "text"
    register: UseFormRegisterReturn
    error?: string
    placeholder?: string
    disabled?: boolean
}

export default function InputTrainAI({ type, register, error, placeholder = "", disabled = false }: InputTrainAIProps) {
    return (
        <div className="w-full">
            <div className="relative">
                <Input
                    type={type}
                    className={`
            w-full px-[20px] py-[22px] rounded-xl border-2 bg-gray-50
            text-sm font-medium text-gray-800 input-auth
            transition duration-200 focus:outline-none focus-visible:ring-0
            ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus-visible:border-[#248fca]"}
          `}
                    autoComplete="off"
                    placeholder={placeholder}
                    {...register}
                    disabled={disabled}
                />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    )
}

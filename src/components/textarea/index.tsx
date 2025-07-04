"use client"

import { useState } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"

interface TextAreaComponentProps {
    title: string
    register: UseFormRegisterReturn
    error?: string
    rows?: number
    className?: string
}

export default function TextAreaComponent({ title, register, error, rows = 4, className = "" }: TextAreaComponentProps) {
    const [hasText, setHasText] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const isLabelFloating = isFocused || hasText

    return (
        <div className="w-full">
            <div className="relative">
                {/* Floating Label */}
                <label
                    className={`
            absolute left-3 transition-all duration-200 ease-in-out pointer-events-none
            font-medium bg-gray-50 px-2
            ${isLabelFloating
                            ? "-top-2 text-xs text-[#248fca] z-10"
                            : "top-3.5 text-[15px] text-gray-500 bg-transparent px-0"
                        }
          `}
                >
                    {title}
                </label>

                <textarea
                    rows={rows}
                    className={`
            w-full px-[20px] py-[14px] rounded-xl border-2 bg-gray-50
            text-lg font-medium text-gray-800 resize-y
            transition duration-200 focus:outline-none focus-visible:ring-0 
            ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#248fca]"}
            ${className}
          `}
                    {...register}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => {
                        setHasText(e.target.value.length > 0)
                        if (register.onChange) {
                            register.onChange(e)
                        }
                    }}
                />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    )
}

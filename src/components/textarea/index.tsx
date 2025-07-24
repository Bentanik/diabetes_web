"use client"

import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"

interface TextAreaComponentProps {
  title: string
  register: UseFormRegisterReturn
  placeholder?: string
  error?: string
  rows?: number
  className?: string
  disabled?: boolean
}

export default function TextAreaComponent({
  title,
  register,
  placeholder,
  error,
  rows = 4,
  className = "",
  disabled = false,
}: TextAreaComponentProps) {
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
        <Textarea
          rows={rows}
          className={`
            w-full px-[20px] py-[14px] rounded-xl border-2 bg-gray-50
            text-sm font-medium text-gray-800 resize-none
            transition-all duration-200 focus:outline-none focus-visible:ring-0
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
            hover:scrollbar-thumb-gray-400 focus:scrollbar-thumb-[#248fca]
            overflow-y-auto
            ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#248fca]"}
            ${className}
          `}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db transparent",
          }}
          {...register}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setHasText(e.target.value.length > 0)
            if (register.onChange) {
              register.onChange(e)
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <style jsx>{`
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        textarea:focus::-webkit-scrollbar-thumb {
          background: #248fca;
        }
        
        textarea::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  )
}

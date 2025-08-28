"use client"

import { motion, AnimatePresence } from "framer-motion"
import { SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
    value: string
    handleSearch: (value: string) => void
    placeholder?: string
    className?: string
}

export default function SearchInput({
    value,
    handleSearch,
    placeholder = "Tìm kiếm tài liệu...",
    className = "",
}: SearchInputProps) {
    const handleClear = () => {
        handleSearch("")
    }

    return (
        <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`relative ${className}`}
        >
            <div className="relative">
                {/* Search Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <SearchIcon className="w-5 h-5 text-[#248fca]" />
                </div>

                {/* Input Field */}
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="
                        pl-11 pr-10 h-12 
                        rounded-xl 
                        border border-gray-300 
                        bg-white
                        focus-visible:border-[#248fca] 
                        focus:ring-0 focus-visible:ring-0
                        transition-colors duration-200
                        text-gray-900 placeholder:text-gray-500 input-auth
                    "
                />

                {/* Clear Button */}
                <AnimatePresence>
                    {value && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClear}
                            className="
                                absolute right-3 top-1/2 transform -translate-y-1/2 
                                p-1 rounded-full 
                                hover:bg-gray-100 
                                transition-colors duration-200
                            "
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

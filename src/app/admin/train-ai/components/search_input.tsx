"use client"

import { SearchIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    onClear: () => void
    placeholder?: string
}

export default function SearchInput({ value, onChange, onClear, placeholder = "Tìm kiếm cơ sở tri thức..." }: SearchInputProps) {
    return (
        <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 pr-10 border-gray-200 focus:border-[#248fca] border-2 focus-visible:border-[#248fca] rounded-full focus-visible:ring-0 input-auth"
            />
            {value && (
                <button
                    onClick={onClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                >
                    <XIcon className="h-4 w-4 text-gray-400" />
                </button>
            )}
        </div>
    )
}



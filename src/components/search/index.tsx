"use client";

import React from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
    searchTerm,
    setSearchTerm,
}) => {
    return (
        <div className="relative flex-1 ">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
                placeholder="Tìm kiếm theo tiêu đề bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[350px]"
            />
        </div>
    );
};

export default SearchInput;

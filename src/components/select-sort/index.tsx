import React, { useState } from "react";
import Select, { SingleValue } from "react-select";

interface BlogStatusDropdownProps {
    onSortChange: (sortType: string) => void;
    selectedOption: string;
}

export default function BlogSortDropdown({
    onSortChange,
    selectedOption,
}: BlogStatusDropdownProps) {
    const options = [
        { value: "id", label: "Mặc định" },
        { value: "createdDate", label: "Ngày tạo" },
        { value: "like", label: "Lượt thích" },
        { value: "view", label: "Người xem" },
        { value: "title ", label: "Tiêu đề" },
    ];

    const handleChange = (
        newValue: SingleValue<{ value: string; label: string }>
    ) => {
        const sortBy = newValue ? newValue.value : "createdDate";
        onSortChange(sortBy || "createdDate");
    };

    return (
        <div>
            <Select
                options={options}
                value={
                    options.find((option) => option.value === selectedOption) ||
                    options[1]
                }
                onChange={handleChange}
                placeholder="Chọn trạng thái"
                className="w-[210px]"
                classNamePrefix="react-select"
            />
        </div>
    );
}

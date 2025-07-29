import React, { useState } from "react";
import Select, { SingleValue } from "react-select";

interface BlogStatusDropdownProps {
    onSortChange: (sortType: string) => void;
}

export default function BlogSortDropdown({
    onSortChange,
}: BlogStatusDropdownProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>();

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
        const statusValue = newValue?.value || "createdDate";
        setSelectedOption(newValue?.label || "Ngày tạo");
        const sortBy =
            statusValue === "createdDate" ? "createdDate" : statusValue;
        onSortChange(sortBy);
    };

    return (
        <div>
            <Select
                options={options}
                value={
                    options.find((option) => option.label === selectedOption) ||
                    options[1]
                }
                onChange={handleChange}
                placeholder="Chọn trạng thái"
                className="w-[250px]"
                classNamePrefix="react-select"
            />
        </div>
    );
}

import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import { Bell } from "lucide-react"; // Sử dụng icon phù hợp, thay đổi nếu cần

const getStatusText = (status: number) => {
    switch (status) {
        case 1:
            return "Đã duyệt";
        case -1:
            return "Từ chối";
        case 0:
            return "Chờ xác thực";
        case -2:
            return "Bản nháp";
        default:
            return "Không xác định";
    }
};

interface BlogStatusDropdownProps {
    selectedStatus: number;
    onStatusChange: (status: number) => void; // Callback để truyền giá trị status
}

export default function BlogStatusDropdown({
    selectedStatus,
    onStatusChange,
}: BlogStatusDropdownProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(
        getStatusText(selectedStatus)
    );

    const options = [
        { value: "0", label: "Chờ xác thực" },
        { value: "1", label: "Đã duyệt" },
        { value: "(-1)", label: "Từ chối" }, // Sử dụng chuỗi để tránh xung đột với kiểu number
        { value: "(-2)", label: "Bản nháp" },
    ];

    const handleChange = (
        newValue: SingleValue<{ value: string; label: string }>
    ) => {
        const statusValue = newValue?.value || "1"; // Mặc định về "0" nếu không chọn
        setSelectedOption(newValue?.label || "Đã duyệt");
        const status = statusValue === "null" ? null : parseInt(statusValue);
        onStatusChange(status || 0); // Gọi callback với giá trị status
    };

    return (
        <div>
            <Select
                options={options}
                value={
                    options.find((option) => option.label === selectedOption) ||
                    options[0]
                }
                onChange={handleChange}
                placeholder="Chọn trạng thái"
                className="w-[250px]"
                classNamePrefix="react-select"
            />
        </div>
    );
}

import { useAppSelector } from "@/stores";
import React, { useState } from "react";
import Select, { SingleValue } from "react-select";

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
    onStatusChange: (status: number) => void;
}

export default function BlogStatusDropdown({
    selectedStatus,
    onStatusChange,
}: BlogStatusDropdownProps) {
    const [selectedOption, setSelectedOption] = useState<string>(
        getStatusText(selectedStatus) || "Chờ xác thực"
    );

    const user = useAppSelector((state) => state.userSlice);

    const options = [
        { value: "0", label: "Chờ xác thực" },
        { value: "1", label: "Đã duyệt" },
        { value: "-1", label: "Từ chối" },
        ...(!user.user?.roles?.includes("SystemAdmin")
            ? [{ value: "-2", label: "Bản nháp" }]
            : []),
    ];

    const handleChange = (
        newValue: SingleValue<{ value: string; label: string }>
    ) => {
        const statusValue = newValue?.value || "0";
        setSelectedOption(newValue?.label || "Chờ xác thực");
        const status = parseInt(statusValue);
        onStatusChange(status);
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

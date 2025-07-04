import React, { useState } from "react";
import Select, { SingleValue } from "react-select";

type Doctor = {
    Id: string;
    value: string;
    label: string;
};

type DoctorSelectFilterProps = {
    doctors: Doctor[];
    onDoctorChange: (doctorId: string) => void; // Callback để truyền giá trị lọc
};

export default function DoctorSelectFilter({
    doctors,
    onDoctorChange,
}: DoctorSelectFilterProps) {
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

    const options = doctors.map((doctor) => ({
        value: doctor.Id,
        label: doctor.label,
    }));

    const handleChange = (
        selectedOption: SingleValue<{ value: string; label: string }>
    ) => {
        const doctorId = selectedOption ? selectedOption.value : null;
        setSelectedDoctor(doctorId);
        onDoctorChange(doctorId || ""); // Gọi callback với doctorId hoặc chuỗi rỗng nếu null
    };

    return (
        <div>
            <Select
                options={options}
                value={
                    options.find((option) => option.value === selectedDoctor) ||
                    null
                }
                onChange={handleChange}
                placeholder="Lựa chọn bác sĩ"
                isSearchable
                className="w-[250px] border rounded-full"
                classNamePrefix="react-select"
            />
        </div>
    );
}

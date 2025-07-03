import React from "react";
import Select, { SingleValue } from "react-select";
import { Stethoscope } from "lucide-react";
import { Controller, Control, useFormContext } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";

type Doctor = {
    Id: string;
    value: string;
    label: string;
};

type DoctorSelectProps = {
    control: Control<any>;
    doctors: Doctor[];
    name?: string;
};

export default function DoctorSelect({
    control,
    doctors,
    name = "doctorId",
}: DoctorSelectProps) {
    const {
        formState: { errors },
    } = useFormContext();
    const options = doctors.map((doctor) => ({
        value: doctor.Id,
        label: doctor.label,
    }));

    return (
        <div>
            <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <Stethoscope className="h-5 w-5 text-[#248fca]" />
                Bác sĩ
            </FormLabel>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Select
                        options={options}
                        value={
                            options.find(
                                (option) => option.value === field.value
                            ) || null
                        }
                        onChange={(
                            selectedOption: SingleValue<{
                                value: string;
                                label: string;
                            }>
                        ) => {
                            field.onChange(
                                selectedOption ? selectedOption.value : ""
                            );
                        }}
                        placeholder="Lựa chọn bác sĩ"
                        isSearchable
                        className="w-[250px] mt-4"
                        classNamePrefix="react-select"
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: errors[name]
                                    ? "red"
                                    : base.borderColor,
                                "&:hover": {
                                    borderColor: errors[name]
                                        ? "red"
                                        : base.borderColor,
                                },
                            }),
                        }}
                    />
                )}
            />
        </div>
    );
}

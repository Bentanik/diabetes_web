"use client";

import React, { useCallback, useState } from "react";
import Select, { SingleValue } from "react-select";
import { Stethoscope } from "lucide-react";
import { Controller, Control, useFormContext } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { useGetDoctors } from "../hooks/use-get-doctors";
import { UseInfiniteQueryOptions } from "@tanstack/react-query";

type DoctorSelectProps = {
    control: Control<any>;
    name?: string;
};

export default function DoctorSelect({
    control,
    name = "doctorId",
}: DoctorSelectProps) {
    const pageSize = 4;
    const {
        formState: { errors },
    } = useFormContext();

    const [cursor, setCursor] = useState<string>("");

    const { doctors, isPending, isError, error } = useGetDoctors({
        search: null,
        gender: null,
        pageSize: pageSize,
        position: null,
        cursor: cursor,
        sortBy: "name",
        sortDirection: 1,
    });

    const loadMore = useCallback(() => {
        if (!doctors?.nextCursor || isPending) return;

        setCursor(doctors.nextCursor);
    }, [doctors?.nextCursor, isPending]);

    const options = doctors?.items.map((doctor) => ({
        value: doctor.id,
        label: doctor.name,
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
                        // Fix 2: Sửa logic tìm option được chọn
                        value={
                            options?.find(
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
                        onInputChange={(inputValue) => {
                            inputValue;
                        }}
                        placeholder="Lựa chọn bác sĩ"
                        isSearchable
                        isLoading={isPending}
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

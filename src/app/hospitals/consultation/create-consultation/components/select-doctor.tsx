"use client";

import React, { useCallback } from "react";
import Select, { SingleValue } from "react-select";
import { Stethoscope } from "lucide-react";
import { Control, Controller, useFormContext } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { useGetDoctors } from "@/app/admin/blogs/update-blog/hooks/use-get-doctors";

type DoctorSelectProps = {
    control: Control<any>;
    name?: string;
};

export default function DoctorSelect({
    control,
    name = "doctorId",
}: DoctorSelectProps) {
    const pageSize = 5;

    const {
        formState: { errors },
    } = useFormContext();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useGetDoctors({
            search: null,
            gender: null,
            pageSize,
            position: null,
            sortBy: "name",
            sortDirection: 1,
        });

    const doctors =
        data?.pages?.flatMap((page) => page.data?.items ?? []) ?? [];

    const options = doctors.map((doctor: API.Doctors) => ({
        value: doctor.id,
        label: doctor.name,
    }));

    const handleMenuScrollToBottom = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div>
            <FormLabel className="text-lg font-semibold flex items-center gap-2 text-[#248fca]">
                <Stethoscope className="h-5 w-5 " />
                Chọn bác sĩ
            </FormLabel>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Select
                        options={options}
                        value={
                            options.find(
                                (opt: any) => opt.value === field.value
                            ) || null
                        }
                        onChange={(
                            selectedOption: SingleValue<{
                                value: string;
                                label: string;
                            }>
                        ) => {
                            field.onChange(
                                selectedOption ? selectedOption.value : "",
                                console.log(
                                    "slect doctor option nè" +
                                        selectedOption?.value
                                )
                            );
                        }}
                        placeholder="Lựa chọn bác sĩ"
                        onMenuScrollToBottom={handleMenuScrollToBottom}
                        isSearchable
                        isLoading={isLoading || isFetchingNextPage}
                        className="w-[230px] mt-3"
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
                            menuList: (base) => ({
                                ...base,
                                maxHeight: 150,
                                overflowY: "auto",
                            }),
                        }}
                    />
                )}
            />
        </div>
    );
}

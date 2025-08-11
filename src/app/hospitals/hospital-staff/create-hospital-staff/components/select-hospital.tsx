"use client";

import React, { useCallback } from "react";
import Select, { SingleValue } from "react-select";
import { Hospital } from "lucide-react";
import { Control, Controller, useFormContext } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { useGetHospitalsCursor } from "../../hooks/use-get-hospital-cursor";

type HospitalSelectProps = {
    control: Control<any>;
    name?: string;
};

export default function HospitalSelect({
    control,
    name = "hospitalId",
}: HospitalSelectProps) {
    const pageSize = 5;

    const {
        formState: { errors },
    } = useFormContext();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useGetHospitalsCursor({
            search: null,
            pageSize,
            sortBy: "name",
            sortDirection: 1,
        });

    const hospitals =
        data?.pages?.flatMap((page) => page.data?.items ?? []) ?? [];

    const options = hospitals.map((hospital: API.HospitalCursor) => ({
        value: hospital.id,
        label: hospital.name,
    }));

    const handleMenuScrollToBottom = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div>
            <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <Hospital className="h-5 w-5 text-[#248fca]" />
                Bệnh viện
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
                                selectedOption ? selectedOption.value : ""
                            );
                        }}
                        placeholder="Lựa chọn bệnh viện"
                        onMenuScrollToBottom={handleMenuScrollToBottom}
                        isSearchable
                        isLoading={isLoading || isFetchingNextPage}
                        className=" mt-2"
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
                                height: "48px",
                                borderRadius: "8px",
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

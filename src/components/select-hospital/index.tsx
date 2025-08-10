import React, { useState, useCallback } from "react";
import Select, { SingleValue } from "react-select";
import { useGetConsultationsCursor } from "@/app/admin/hospital-staff/hooks/use-get-hospital-cursor";

type HospitalsSelectFilterProps = {
    onHospitalChange: (hospitalId: string) => void;
    selectHospital: string;
};

export default function HospitalsSelectFilter({
    onHospitalChange,
    selectHospital,
}: HospitalsSelectFilterProps) {
    const pageSize = 5;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useGetHospitalsCursor({
            search: null,
            pageSize,
            sortBy: "name",
            sortDirection: 1,
        });

    const hospitals =
        data?.pages?.flatMap((page: any) => page.data?.items ?? []) ?? [];

    const options = hospitals.map((hospital: API.HospitalCursor) => ({
        value: hospital.id,
        label: hospital.name,
    }));

    const handleChange = (
        selectedOption: SingleValue<{ value: string; label: string }>
    ) => {
        const hospitalId = selectedOption ? selectedOption.value : "";
        onHospitalChange(hospitalId || "");
    };

    // Xử lý cuộn đến cuối danh sách để load thêm dữ liệu
    const handleMenuScrollToBottom = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div>
            <Select
                options={options}
                value={
                    options.find(
                        (option: any) => option.value === selectHospital
                    ) || null
                }
                onChange={handleChange}
                onMenuScrollToBottom={handleMenuScrollToBottom}
                placeholder="Chọn bệnh viện"
                isSearchable
                isLoading={isLoading || isFetchingNextPage}
                className="w-[210px] border rounded-full"
                classNamePrefix="react-select"
                styles={{
                    menuList: (base) => ({
                        ...base,
                        maxHeight: 150,
                        overflowY: "auto",
                    }),
                }}
            />
        </div>
    );
}

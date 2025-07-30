import React, { useState, useCallback } from "react";
import Select, { SingleValue } from "react-select";
import { useGetDoctors } from "@/app/admin/blogs/update-blog/hooks/use-get-doctors";

type DoctorSelectFilterProps = {
    onDoctorChange: (doctorId: string) => void; // Callback để truyền giá trị lọc
};

export default function DoctorSelectFilter({
    onDoctorChange,
}: DoctorSelectFilterProps) {
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
    const pageSize = 5;

    // Sử dụng hook để lấy dữ liệu từ API
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useGetDoctors({
            search: null,
            gender: null,
            pageSize,
            position: null,
            sortBy: "name",
            sortDirection: 1,
        });

    // Chuyển đổi dữ liệu từ API thành options cho Select
    const doctors =
        data?.pages?.flatMap((page: any) => page.data?.items ?? []) ?? [];

    const options = doctors.map((doctor: API.Doctors) => ({
        value: doctor.id,
        label: doctor.name,
    }));

    const handleChange = (
        selectedOption: SingleValue<{ value: string; label: string }>
    ) => {
        const doctorId = selectedOption ? selectedOption.value : null;
        setSelectedDoctor(doctorId);
        onDoctorChange(doctorId || ""); // Gọi callback với doctorId hoặc chuỗi rỗng nếu null
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
                        (option: any) => option.value === selectedDoctor
                    ) || null
                }
                onChange={handleChange}
                onMenuScrollToBottom={handleMenuScrollToBottom}
                placeholder="Chọn bác sĩ"
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

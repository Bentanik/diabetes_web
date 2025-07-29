import React, { useState, useCallback } from "react";
import Select, { SingleValue } from "react-select";
import { useGetModerators } from "@/app/admin/blogs/update-blog/hooks/use-get-moderators";

type ModeratorSelectFilterProps = {
    onModeratorChange: (moderatorId: string) => void;
};

export default function ModeratorSelectFilter({
    onModeratorChange,
}: ModeratorSelectFilterProps) {
    const [selectedModerator, setSelectedModerator] = useState<string | null>(
        null
    );
    const pageSize = 5;

    // Sử dụng hook để lấy dữ liệu từ API
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useGetModerators({
            search: null,
            gender: null,
            pageSize,
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
        const moderatorId = selectedOption ? selectedOption.value : null;
        setSelectedModerator(moderatorId);
        onModeratorChange(moderatorId || ""); // Gọi callback với doctorId hoặc chuỗi rỗng nếu null
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
                        (option: any) => option.value === selectedModerator
                    ) || null
                }
                onChange={handleChange}
                onMenuScrollToBottom={handleMenuScrollToBottom}
                placeholder="Lựa chọn nhân viên"
                isSearchable
                isLoading={isLoading || isFetchingNextPage}
                className="w-[250px] border rounded-full"
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

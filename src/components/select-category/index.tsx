import React, { useState } from "react";
import Select, { MultiValue } from "react-select";

type MultiSelectCategoriesFilterProps = {
    data: API.TGetCategories | null | undefined;
    isPending: boolean;
    onCategoryChange: (categoryIds: string[]) => void;
    selectedCategories: string[];
};

export default function MultiSelectCategoriesFilter({
    data,
    isPending,
    onCategoryChange,
    selectedCategories,
}: MultiSelectCategoriesFilterProps) {
    // Giữ state là array of IDs như yêu cầu

    const options =
        data?.map((category) => ({
            value: category.id,
            label: category.name,
        })) || [];

    const handleChange = (
        newValue: MultiValue<{ value: string; label: string }>
    ) => {
        const categoryIds = newValue.map((option) => option.value);
        onCategoryChange(categoryIds);
    };

    return (
        <div>
            <Select
                isMulti
                options={options}
                value={options.filter((option) =>
                    selectedCategories.includes(option.value)
                )}
                onChange={handleChange}
                placeholder="Chọn thể loại"
                isLoading={isPending}
                className="w-[210px]"
                classNamePrefix="react-select"
                noOptionsMessage={() => "Không tìm thấy danh mục"}
                isClearable
            />
        </div>
    );
}

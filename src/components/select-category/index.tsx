import React, { useState } from "react";
import Select, { MultiValue } from "react-select";

type Category = {
    id: string;
    name: string;
};

type MultiSelectCategoriesFilterProps = {
    data: Category[];
    isPending: boolean;
    onCategoryChange: (categoryIds: string[]) => void;
};

export default function MultiSelectCategoriesFilter({
    data,
    isPending,
    onCategoryChange,
}: MultiSelectCategoriesFilterProps) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const options = data.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    const handleChange = (
        newValue: MultiValue<{ value: string; label: string }>
    ) => {
        const categoryIds = newValue.map((option) => option.value);
        setSelectedCategories(categoryIds);
        onCategoryChange(categoryIds); // Gọi callback với danh sách categoryIds
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
                className="w-[250px]"
                classNamePrefix="react-select"
                noOptionsMessage={() => "Không tìm thấy danh mục"}
                isClearable
            />
        </div>
    );
}

import React from "react";
import Select from "react-select";
import { Controller, Control, useFormContext } from "react-hook-form";
import { ListTree } from "lucide-react";
import { FormLabel } from "@/components/ui/form";

type MultiSelectCategoriesProps = {
    control: Control<any>;
    data: API.TGetCategories | undefined | null;
    isPending: boolean;
    name?: string;
};

export default function MultiSelectCategories({
    control,
    data,
    isPending,
    name = "categoryIds",
}: MultiSelectCategoriesProps) {
    const {
        formState: { errors },
    } = useFormContext();

    const options = data?.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    return (
        <div>
            <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <ListTree className="h-5 w-5 text-[#248fca]" />
                Thể loại bài viết
            </FormLabel>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Select
                        isMulti
                        options={options}
                        value={options?.filter((option) =>
                            field.value?.includes(option.value)
                        )}
                        onChange={(selectedOptions) =>
                            field.onChange(
                                selectedOptions.map((option) => option.value)
                            )
                        }
                        placeholder="Chọn thể loại"
                        isLoading={isPending}
                        className="w-[250px] mt-4"
                        classNamePrefix="react-select"
                        noOptionsMessage={() => "Không tìm thấy danh mục"}
                        isClearable
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

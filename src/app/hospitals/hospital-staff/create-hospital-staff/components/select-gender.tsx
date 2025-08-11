import React from "react";
import {
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { VenusAndMars } from "lucide-react";
import { Controller } from "react-hook-form";

interface GenderSelectProps {
    control: any; // Thay thế bằng kiểu dữ liệu chính xác nếu có
    name: string;
}

const GenderSelect: React.FC<GenderSelectProps> = ({ control, name }) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <div>
                            <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-2">
                                <VenusAndMars className="h-5 w-5 text-[#248fca]" />
                                Giới tính
                            </FormLabel>
                            <Select
                                onValueChange={(value) =>
                                    field.onChange(Number(value))
                                } // Convert string to number
                                value={field.value?.toString()} // Ensure value is string for Select
                            >
                                <SelectTrigger className="w-[250px] min-h-[50px]">
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Chọn giới tính
                                        </SelectLabel>
                                        <SelectItem value="0">Nam</SelectItem>
                                        <SelectItem value="1">Nữ</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </FormControl>
                    <FormMessage className="flex items-center gap-1" />
                </FormItem>
            )}
        />
    );
};

export default GenderSelect;

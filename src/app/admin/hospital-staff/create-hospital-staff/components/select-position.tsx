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

interface PositionSelectProps {
    control: any; // Thay thế bằng kiểu dữ liệu chính xác nếu có
    name: string;
}

const PositionSelect: React.FC<PositionSelectProps> = ({ control, name }) => {
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
                                Vị trí
                            </FormLabel>
                            <Select
                                onValueChange={(value) =>
                                    field.onChange(Number(value))
                                } // Convert string to number
                                value={field.value?.toString()} // Ensure value is string for Select
                            >
                                <SelectTrigger className="w-[250px] min-h-[50px]">
                                    <SelectValue placeholder="Chọn vị trí" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Chọn vị trí</SelectLabel>
                                        <SelectItem value="0">
                                            Giám đốc
                                        </SelectItem>
                                        <SelectItem value="1">
                                            Phó giám đốc
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Trưởng khoa
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Phó trưởng khoa
                                        </SelectItem>
                                        <SelectItem value="4">
                                            Bác sĩ
                                        </SelectItem>
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

export default PositionSelect;

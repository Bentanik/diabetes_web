import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CalendarDays, ChevronDownIcon } from "lucide-react";
import { Controller } from "react-hook-form";

interface DateOfBirthPickerProps {
    control: any; // Thay thế bằng kiểu dữ liệu chính xác nếu có
    name: string;
}

const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({
    control,
    name,
}) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <div>
                            <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-2">
                                <CalendarDays className="h-5 w-5 text-[#248fca]" />
                                Ngày sinh
                            </FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-[250px] h-[48px] justify-between font-normal"
                                    >
                                        {date ? (
                                            date.toLocaleDateString()
                                        ) : (
                                            <div className="text-[#626874]">
                                                Chọn ngày sinh
                                            </div>
                                        )}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        captionLayout="dropdown"
                                        onSelect={(selectedDate) => {
                                            setDate(selectedDate);
                                            if (selectedDate) {
                                                const offsetDate = new Date(
                                                    selectedDate.getTime() +
                                                        7 * 60 * 60 * 1000
                                                );
                                                const isoDate =
                                                    offsetDate.toISOString();
                                                field.onChange(isoDate);
                                            } else {
                                                field.onChange(null);
                                            }
                                            setOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </FormControl>
                    <FormMessage className="flex items-center gap-1" />
                </FormItem>
            )}
        />
    );
};

export default DateOfBirthPicker;

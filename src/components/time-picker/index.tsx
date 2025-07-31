"use client";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
    time: string; // Định dạng: "HH:mm"
    onTimeChange: (time: string) => void; // Callback gửi thời gian HH:mm
}

export default function TimePicker({ time, onTimeChange }: TimePickerProps) {
    const [timeOpen, setTimeOpen] = useState(false);

    // Hàm phân tích thời gian HH:mm
    const parseTime = (time: string) => {
        if (!time || !/^\d{2}:\d{2}$/.test(time)) {
            return { hour: "00", minute: "00" };
        }
        const [hour, minute] = time.split(":");
        return { hour, minute };
    };

    // Khởi tạo hour và minute từ prop time
    const { hour, minute } = parseTime(time);

    // Generate hours (00-23 for 24-hour format)
    const hours = Array.from({ length: 24 }, (_, i) => ({
        value: i.toString().padStart(2, "0"),
        label: i.toString().padStart(2, "0"),
    }));

    // Generate minutes (00-59)
    const minutes = Array.from({ length: 60 }, (_, i) => ({
        value: i.toString().padStart(2, "0"),
        label: i.toString().padStart(2, "0"),
    }));

    // Cập nhật thời gian khi hour hoặc minute thay đổi
    useEffect(() => {
        const newTime = `${hour}:${minute}`;
        if (newTime !== time) {
            onTimeChange(newTime);
        }
    }, [hour, minute, onTimeChange]);

    const handleResetTime = () => {
        onTimeChange("00:00");
    };

    const formatTime = () => {
        return `${hour}:${minute}`;
    };

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="time-picker"
                            className="w-[150px] justify-between font-normal hover:bg-accent transition-colors"
                        >
                            {formatTime()}
                            <Clock className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="start">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground mb-3 block">
                                    Custom Time
                                </Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <Label className="text-xs text-muted-foreground mb-1 block">
                                            Hour
                                        </Label>
                                        <Select
                                            value={hour}
                                            onValueChange={(newHour) =>
                                                onTimeChange(
                                                    `${newHour}:${minute}`
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hours.map((h) => (
                                                    <SelectItem
                                                        key={h.value}
                                                        value={h.value}
                                                    >
                                                        {h.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1">
                                        <Label className="text-xs text-muted-foreground mb-1 block">
                                            Minute
                                        </Label>
                                        <Select
                                            value={minute}
                                            onValueChange={(newMinute) =>
                                                onTimeChange(
                                                    `${hour}:${newMinute}`
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {minutes.map((m) => (
                                                    <SelectItem
                                                        key={m.value}
                                                        value={m.value}
                                                    >
                                                        {m.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => setTimeOpen(false)}
                                    >
                                        Done
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResetTime}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}

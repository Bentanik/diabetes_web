"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, Edit3, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface TimeSlot {
    start: string;
    end: string;
    id?: string; // Thêm id từ API
    status?: number; // Thêm status từ API
}

interface DaySchedule {
    date: string;
    times: TimeSlot[];
}

interface WeeklyScheduleProps {
    selectedWeekData: {
        label: string;
        dates: string[];
    };
    scheduleData: { timeTemplates: DaySchedule[] };
    setScheduleData: (data: { timeTemplates: DaySchedule[] }) => void;
    editingSlot: { dayIndex: number; slotIndex: number } | null;
    setEditingSlot: (
        slot: { dayIndex: number; slotIndex: number } | null
    ) => void;
    isLoading?: boolean; // Thêm loading state
}

const DAYS_OF_WEEK = [
    { short: "T2", full: "Thứ 2" },
    { short: "T3", full: "Thứ 3" },
    { short: "T4", full: "Thứ 4" },
    { short: "T5", full: "Thứ 5" },
    { short: "T6", full: "Thứ 6" },
    { short: "T7", full: "Thứ 7" },
    { short: "CN", full: "Chủ nhật" },
];

// Hàm validate thời gian
const validateTimeSlot = (
    newSlot: TimeSlot,
    existingSlots: TimeSlot[],
    slotIndexToIgnore?: number
): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newSlot.start) || !timeRegex.test(newSlot.end)) {
        toast.error("Định dạng thời gian không hợp lệ");
        return false;
    }

    const getMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const newStart = getMinutes(newSlot.start);
    const newEnd = getMinutes(newSlot.end);

    if (newEnd - newStart < 15) {
        toast.error("Khoảng thời gian phải tối thiểu 15 phút");
        return false;
    }

    for (let i = 0; i < existingSlots.length; i++) {
        if (slotIndexToIgnore === i) continue;

        const existingStart = getMinutes(existingSlots[i].start);
        const existingEnd = getMinutes(existingSlots[i].end);

        if (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
        ) {
            toast.error("Khung giờ bị trùng lặp hoặc chồng lấn");
            return false;
        }
    }

    return true;
};

// Hàm tăng thời gian thêm 15 phút
const incrementTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes + 15;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}`;
};

export default function WeeklySchedule({
    selectedWeekData,
    scheduleData,
    setScheduleData,
    editingSlot,
    setEditingSlot,
    isLoading = false,
}: WeeklyScheduleProps) {
    // Helper to compare HH:MM times
    const compareTimes = (time1: string, time2: string): number => {
        const [h1, m1] = time1.split(":").map(Number);
        const [h2, m2] = time2.split(":").map(Number);
        const total1 = h1 * 60 + m1;
        const total2 = h2 * 60 + m2;
        return total1 - total2;
    };

    // Helper to check overlap
    const hasOverlap = (
        existingSlots: TimeSlot[],
        newSlot: TimeSlot
    ): boolean => {
        for (const slot of existingSlots) {
            if (
                compareTimes(newSlot.start, slot.end) < 0 &&
                compareTimes(newSlot.end, slot.start) > 0
            ) {
                return true; // Có chồng chéo
            }
        }
        return false;
    };

    const addTimeSlot = (dayIndex: number) => {
        if (!selectedWeekData) return;

        const date = selectedWeekData.dates[dayIndex]; // Dùng ngày thực tế từ tuần đã chọn
        const newScheduleData = { ...scheduleData };

        let daySchedule = newScheduleData.timeTemplates.find(
            (t) => t.date === date
        );
        if (!daySchedule) {
            daySchedule = { date, times: [] };
            newScheduleData.timeTemplates.push(daySchedule);
        }

        let newStart = "08:00"; // Mặc định bắt đầu từ 08:00 nếu chưa có khung giờ
        let newEnd = "08:30"; // Mặc định kết thúc sau 30 phút
        if (daySchedule.times.length > 0) {
            const lastSlot = daySchedule.times[daySchedule.times.length - 1];
            newStart = incrementTime(lastSlot.end);
            newEnd = incrementTime(newStart); // Tăng thêm 15 phút để tạo khung 30 phút
        }

        if (compareTimes(newEnd, "24:00") >= 0) {
            toast.error("Bạn đã thêm hết thời gian trong 24 giờ!");
            return;
        }

        const newSlot = { start: newStart, end: newEnd };
        if (hasOverlap(daySchedule.times, newSlot)) {
            toast.error("Bạn đã thêm hết thời gian trong 24 giờ!");
            return;
        }

        daySchedule.times.push(newSlot);
        setScheduleData(newScheduleData);
        setEditingSlot({ dayIndex, slotIndex: daySchedule.times.length - 1 });
    };

    const updateTimeSlot = (
        dayIndex: number,
        slotIndex: number,
        field: "start" | "end",
        value: string
    ) => {
        if (!selectedWeekData) return;

        const date = selectedWeekData.dates[dayIndex];
        const newScheduleData = { ...scheduleData };
        const daySchedule = newScheduleData.timeTemplates.find(
            (t) => t.date === date
        );

        if (daySchedule) {
            const timeSlot = { ...daySchedule.times[slotIndex] };
            timeSlot[field] = value;
            daySchedule.times[slotIndex] = timeSlot;
            setScheduleData(newScheduleData);
        }
    };

    const toggleEditMode = (dayIndex: number, slotIndex: number) => {
        if (
            editingSlot &&
            editingSlot.dayIndex === dayIndex &&
            editingSlot.slotIndex === slotIndex
        ) {
            if (!selectedWeekData) return;
            const date = selectedWeekData.dates[dayIndex];
            const daySchedule = scheduleData.timeTemplates.find(
                (t) => t.date === date
            );
            if (daySchedule) {
                const timeSlot = daySchedule.times[slotIndex];
                if (!validateTimeSlot(timeSlot, daySchedule.times, slotIndex)) {
                    return;
                }
            }
            setEditingSlot(null);
        } else {
            setEditingSlot({ dayIndex, slotIndex });
        }
    };

    const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
        if (!selectedWeekData) return;

        const date = selectedWeekData.dates[dayIndex];
        const newScheduleData = { ...scheduleData };
        const daySchedule = newScheduleData.timeTemplates.find(
            (t) => t.date === date
        );

        if (daySchedule) {
            daySchedule.times = daySchedule.times.filter(
                (_, index) => index !== slotIndex
            );
            if (daySchedule.times.length === 0) {
                newScheduleData.timeTemplates =
                    newScheduleData.timeTemplates.filter(
                        (t) => t.date !== date
                    );
            }
        }

        setScheduleData(newScheduleData);
        setEditingSlot(null);
    };

    const getBadgeColor = (timeSlot: TimeSlot) => {
        if (timeSlot.id) {
            return "bg-green-600 hover:bg-green-700"; // Màu xanh lá cho data từ API
        }
        return "bg-[#248FCA] hover:bg-[#248FCA]/90"; // Màu mặc định cho data local
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg text-[#248FCA]">
                        <span>Lịch tuần: {selectedWeekData.label}</span>
                        {isLoading && (
                            <div className="flex items-center space-x-2 text-sm">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Đang tải...</span>
                            </div>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[500px] overflow-y-auto">
                    <div className="grid grid-cols-7 gap-px bg-gray-200">
                        {DAYS_OF_WEEK.map((day, dayIndex) => {
                            const dayDate = selectedWeekData.dates[dayIndex];
                            const daySchedule = scheduleData.timeTemplates.find(
                                (t) => t.date === dayDate
                            );
                            return (
                                <div key={day.short} className="bg-white">
                                    <div className="bg-[#248FCA] text-white p-3 text-center">
                                        <div className="font-medium text-sm">
                                            {day.short}
                                        </div>
                                        <div className="text-xs opacity-90">
                                            {new Date(
                                                dayDate
                                            ).toLocaleDateString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                            })}
                                        </div>
                                    </div>

                                    <div className="p-2 min-h-[250px] space-y-2">
                                        {isLoading && !daySchedule && (
                                            <div className="space-y-2">
                                                {[1, 2, 3].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="h-8 bg-gray-200 rounded animate-pulse"
                                                    ></div>
                                                ))}
                                            </div>
                                        )}

                                        {daySchedule?.times.map(
                                            (timeSlot, slotIndex) => (
                                                <div
                                                    key={`${dayIndex}-${slotIndex}`}
                                                    className="group"
                                                >
                                                    {editingSlot &&
                                                    editingSlot.dayIndex ===
                                                        dayIndex &&
                                                    editingSlot.slotIndex ===
                                                        slotIndex ? (
                                                        <div className="space-y-2 p-2 border border-[#248FCA]/30 rounded-lg bg-[#248FCA]/5">
                                                            <div className="flex space-x-1">
                                                                <Input
                                                                    type="time"
                                                                    value={
                                                                        timeSlot.start
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateTimeSlot(
                                                                            dayIndex,
                                                                            slotIndex,
                                                                            "start",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="text-xs h-7"
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                />
                                                                <Input
                                                                    type="time"
                                                                    value={
                                                                        timeSlot.end
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateTimeSlot(
                                                                            dayIndex,
                                                                            slotIndex,
                                                                            "end",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="text-xs h-7"
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="flex space-x-1">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        toggleEditMode(
                                                                            dayIndex,
                                                                            slotIndex
                                                                        )
                                                                    }
                                                                    className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                >
                                                                    <Check className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        removeTimeSlot(
                                                                            dayIndex,
                                                                            slotIndex
                                                                        )
                                                                    }
                                                                    className="h-6 px-2 text-xs border-red-300 text-red-600 hover:bg-red-50"
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative group">
                                                            <Badge
                                                                className={`w-full justify-center ${getBadgeColor(
                                                                    timeSlot
                                                                )} text-white text-xs py-2 cursor-pointer transition-all`}
                                                            >
                                                                <div className="flex flex-col items-center">
                                                                    <span>
                                                                        {
                                                                            timeSlot.start
                                                                        }{" "}
                                                                        -{" "}
                                                                        {
                                                                            timeSlot.end
                                                                        }
                                                                    </span>
                                                                    {timeSlot.id && (
                                                                        <span className="text-[10px] opacity-75">
                                                                            từ
                                                                            API
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Badge>
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                                <div className="flex space-x-1">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        onClick={() =>
                                                                            toggleEditMode(
                                                                                dayIndex,
                                                                                slotIndex
                                                                            )
                                                                        }
                                                                        className="h-6 w-6 p-0"
                                                                        disabled={
                                                                            isLoading
                                                                        }
                                                                    >
                                                                        <Edit3 className="h-3 w-3" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() =>
                                                                            removeTimeSlot(
                                                                                dayIndex,
                                                                                slotIndex
                                                                            )
                                                                        }
                                                                        className="h-6 w-6 p-0"
                                                                        disabled={
                                                                            isLoading
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        )}

                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                addTimeSlot(dayIndex)
                                            }
                                            className="w-full h-8 text-xs border-dashed border-[#248FCA]/50 text-[#248FCA] hover:bg-[#248FCA]/5 transition-all"
                                            disabled={isLoading}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Thêm khung giờ
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

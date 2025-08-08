"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface TimeSlot {
    start: string;
    end: string;
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
    daysOfWeek: { short: string; full: string }[];
    scheduleData: { doctorId: string; timeTemplates: DaySchedule[] };
    setScheduleData: (data: {
        doctorId: string;
        timeTemplates: DaySchedule[];
    }) => void;
    editingSlot: { dayIndex: number; slotIndex: number } | null;
    setEditingSlot: (
        slot: { dayIndex: number; slotIndex: number } | null
    ) => void;
}

// Hàm validate thời gian
const validateTimeSlot = (
    newSlot: TimeSlot,
    existingSlots: TimeSlot[],
    slotIndexToIgnore?: number
): boolean => {
    // Kiểm tra định dạng thời gian
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newSlot.start) || !timeRegex.test(newSlot.end)) {
        toast.error("Định dạng thời gian không hợp lệ");
        return false;
    }

    // Chuyển thời gian sang phút để dễ so sánh
    const getMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const newStart = getMinutes(newSlot.start);
    const newEnd = getMinutes(newSlot.end);

    // Kiểm tra khoảng thời gian tối thiểu 15 phút
    if (newEnd - newStart < 15) {
        toast.error("Khoảng thời gian phải tối thiểu 15 phút");
        return false;
    }

    // Kiểm tra trùng lặp hoặc chồng lấn
    for (let i = 0; i < existingSlots.length; i++) {
        if (slotIndexToIgnore === i) continue; // Bỏ qua slot đang chỉnh sửa

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
    daysOfWeek,
    scheduleData,
    setScheduleData,
    editingSlot,
    setEditingSlot,
}: WeeklyScheduleProps) {
    const addTimeSlot = (dayIndex: number) => {
        if (!selectedWeekData) return;

        const date = selectedWeekData.dates[dayIndex];
        const newScheduleData = { ...scheduleData };

        let daySchedule = newScheduleData.timeTemplates.find(
            (t) => t.date === date
        );
        if (!daySchedule) {
            daySchedule = { date, times: [] };
            newScheduleData.timeTemplates.push(daySchedule);
        }

        // Lấy khung giờ cuối cùng và tăng 15 phút
        let newStart = "08:00"; // Mặc định bắt đầu từ 08:00 nếu chưa có khung giờ
        let newEnd = "08:30"; // Mặc định kết thúc sau 30 phút
        if (daySchedule.times.length > 0) {
            const lastSlot = daySchedule.times[daySchedule.times.length - 1];
            newStart = incrementTime(lastSlot.end);
            newEnd = incrementTime(newStart); // Tăng thêm 15 phút để tạo khung 30 phút
        }

        const newTimeSlot: TimeSlot = { start: newStart, end: newEnd };
        daySchedule.times.push(newTimeSlot);
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
            // Validate khi nhấn dấu tick
            if (!selectedWeekData) return;
            const date = selectedWeekData.dates[dayIndex];
            const daySchedule = scheduleData.timeTemplates.find(
                (t) => t.date === date
            );
            if (daySchedule) {
                const timeSlot = daySchedule.times[slotIndex];
                if (!validateTimeSlot(timeSlot, daySchedule.times, slotIndex)) {
                    return; // Không thoát nếu không hợp lệ
                }
            }
            setEditingSlot(null); // Thoát chế độ chỉnh sửa nếu hợp lệ
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

    const getDaySchedule = (dayIndex: number) => {
        if (!selectedWeekData) return null;
        const date = selectedWeekData.dates[dayIndex];
        return scheduleData.timeTemplates.find((t) => t.date === date);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-[#248FCA]">
                        Lịch tuần: {selectedWeekData.label}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-7 gap-px bg-gray-200">
                        {daysOfWeek.map((day, dayIndex) => {
                            const daySchedule = getDaySchedule(dayIndex);
                            const dayDate = selectedWeekData.dates[dayIndex];

                            return (
                                <div key={day.short} className="bg-white">
                                    {/* Day Header */}
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

                                    {/* Time Slots */}
                                    <div className="p-2 min-h-[250px] space-y-2">
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
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative group">
                                                            <Badge className="w-full justify-center bg-[#248FCA] hover:bg-[#248FCA]/90 text-white text-xs py-2 cursor-pointer transition-all">
                                                                {timeSlot.start}{" "}
                                                                - {timeSlot.end}
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

                                        {/* Add Button */}
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                addTimeSlot(dayIndex)
                                            }
                                            className="w-full h-8 text-xs border-dashed border-[#248FCA]/50 text-[#248FCA] hover:bg-[#248FCA]/5 transition-all"
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

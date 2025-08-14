"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, Edit3, Trash2, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react"; // Đã thêm useEffect
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface TimeSlot {
    start: string; // Lưu dưới dạng HH:MM:SS
    end: string; // Lưu dưới dạng HH:MM:SS
    id?: string;
    status?: number;
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
    isLoading?: boolean;
    onStatusUpdate: () => void;
}

// Chuyển đổi từ HH:MM sang HH:MM:SS
const formatTimeToHMS = (time: string): string => {
    if (time.includes(":") && time.split(":").length === 2) {
        return `${time}:00`;
    }
    return time;
};

// Chuyển đổi từ HH:MM:SS sang HH:MM để hiển thị trong input
const formatTimeToHM = (time: string): string => {
    if (time.includes(":") && time.split(":").length === 3) {
        return time.substring(0, 5); // Lấy HH:MM
    }
    return time;
};

// Hàm validate thời gian - nhận HH:MM:SS
const validateTimeSlot = (
    newSlot: TimeSlot,
    existingSlots: TimeSlot[],
    slotIndexToIgnore?: number
): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
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

// Hàm tăng thời gian thêm 15 phút - trả về HH:MM:SS
const incrementTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes + 15;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}:00`;
};

export default function WeeklySchedule({
    selectedWeekData,
    scheduleData,
    setScheduleData,
    editingSlot,
    setEditingSlot,
    isLoading = false,
    onStatusUpdate,
}: WeeklyScheduleProps) {
    // Mảng lưu trữ các ID cần xóa
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    // State để lưu các time slot được chọn
    const [selectedSlots, setSelectedSlots] = useState<
        { dayIndex: number; slotIndex: number }[]
    >([]);
    // State để lưu giá trị status mới từ dropdown (kiểu number)
    const [newStatus, setNewStatus] = useState<number | null>(null);

    // Chuẩn hóa các slot lấy từ API về định dạng HH:MM:SS (nếu cần)
    useEffect(() => {
        if (scheduleData && scheduleData.timeTemplates) {
            // Kiểm tra nếu có slot nào định dạng HH:MM (chỉ có 2 phần)
            const needFormat = scheduleData.timeTemplates.some((day) =>
                day.times.some((slot) => slot.start.split(":").length === 2)
            );
            if (needFormat) {
                const updated: { timeTemplates: DaySchedule[] } = {
                    timeTemplates: [],
                };
                scheduleData.timeTemplates.forEach((day) => {
                    const updatedDay: DaySchedule = {
                        date: day.date,
                        times: [],
                    };
                    day.times.forEach((slot) => {
                        updatedDay.times.push({
                            ...slot,
                            start: formatTimeToHMS(slot.start), // thêm :00
                            end: formatTimeToHMS(slot.end),
                        });
                    });
                    updated.timeTemplates.push(updatedDay);
                });
                setScheduleData(updated);
            }
        }
    }, [scheduleData, setScheduleData]);

    // So sánh thời gian HH:MM:SS
    const compareTimes = (time1: string, time2: string): number => {
        const [h1, m1] = time1.split(":").map(Number);
        const [h2, m2] = time2.split(":").map(Number);
        const total1 = h1 * 60 + m1;
        const total2 = h2 * 60 + m2;
        return total1 - total2;
    };

    // Kiểm tra chồng lấn khung giờ
    const hasOverlap = (
        existingSlots: TimeSlot[],
        newSlot: TimeSlot
    ): boolean => {
        for (const slot of existingSlots) {
            if (
                compareTimes(newSlot.start, slot.end) < 0 &&
                compareTimes(newSlot.end, slot.start) > 0
            ) {
                return true;
            }
        }
        return false;
    };

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
        let newStart = "08:00:00"; // Mặc định bắt đầu từ 08:00:00
        let newEnd = "08:30:00"; // Mặc định kết thúc sau 30 phút
        if (daySchedule.times.length > 0) {
            const lastSlot = daySchedule.times[daySchedule.times.length - 1];
            newStart = incrementTime(lastSlot.end);
            newEnd = incrementTime(newStart);
        }
        if (compareTimes(newEnd, "24:00:00") >= 0) {
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
        onStatusUpdate(); // Gọi callback khi có thay đổi
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
            // Chuyển đổi HH:MM từ input thành HH:MM:SS để lưu
            timeSlot[field] = formatTimeToHMS(value);
            daySchedule.times[slotIndex] = timeSlot;
            setScheduleData(newScheduleData);
            onStatusUpdate(); // Gọi callback khi có thay đổi
        }
    };

    const toggleEditMode = (dayIndex: number, slotIndex: number) => {
        if (
            editingSlot &&
            editingSlot.dayIndex === dayIndex &&
            editingSlot.slotIndex === slotIndex
        ) {
            // Hoàn tất chỉnh sửa
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
            // Bắt đầu chỉnh sửa
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
            const timeSlotToRemove = daySchedule.times[slotIndex];
            // Nếu slot có id (từ API), thêm vào deletedIds
            if (timeSlotToRemove.id) {
                const newDeletedIds = [...deletedIds, timeSlotToRemove.id];
                setDeletedIds(newDeletedIds);
            }
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
        // Xóa khỏi danh sách selectedSlots nếu cần
        setSelectedSlots(
            selectedSlots.filter(
                (slot) =>
                    slot.dayIndex !== dayIndex || slot.slotIndex !== slotIndex
            )
        );
        onStatusUpdate();
    };

    const toggleSelectSlot = (dayIndex: number, slotIndex: number) => {
        const date = selectedWeekData.dates[dayIndex];
        const daySchedule = scheduleData.timeTemplates.find(
            (t) => t.date === date
        );
        if (!daySchedule) return;
        const timeSlot = daySchedule.times[slotIndex];
        if (timeSlot.status === 2) return; // Không cho chọn nếu đã đặt
        const isSelected = selectedSlots.some(
            (slot) => slot.dayIndex === dayIndex && slot.slotIndex === slotIndex
        );
        if (isSelected) {
            // Bỏ chọn
            setSelectedSlots(
                selectedSlots.filter(
                    (slot) =>
                        slot.dayIndex !== dayIndex ||
                        slot.slotIndex !== slotIndex
                )
            );
        } else {
            const selectedStatusValue = selectedSlots.length
                ? scheduleData.timeTemplates.find(
                      (t) =>
                          t.date ===
                          selectedWeekData.dates[selectedSlots[0].dayIndex]
                  )?.times[selectedSlots[0].slotIndex].status
                : timeSlot.status;
            if (selectedStatusValue === timeSlot.status) {
                // Chỉ thêm nếu status khớp
                setSelectedSlots([...selectedSlots, { dayIndex, slotIndex }]);
            } else {
                toast.error(
                    "Chỉ có thể chọn các khung giờ có cùng trạng thái!"
                );
            }
        }
    };

    const updateSelectedSlotsStatus = () => {
        if (newStatus === null || selectedSlots.length === 0) return;
        const newScheduleData = { ...scheduleData };
        selectedSlots.forEach(({ dayIndex, slotIndex }) => {
            const date = selectedWeekData.dates[dayIndex];
            const daySchedule = newScheduleData.timeTemplates.find(
                (t) => t.date === date
            );
            if (daySchedule) {
                // Cập nhật status (dùng number)
                daySchedule.times[slotIndex] = {
                    ...daySchedule.times[slotIndex],
                    status: newStatus!, // đã là number
                };
            }
        });
        setScheduleData(newScheduleData);
        setSelectedSlots([]); // Reset chọn
        setNewStatus(null);
        toast.success("Cập nhật trạng thái thành công!");
        onStatusUpdate();
    };

    // Lấy màu nền theo status hoặc mặc định (#248FCA)
    const getBadgeColor = (timeSlot: TimeSlot) => {
        if (timeSlot.id) {
            if (timeSlot.status === 0) {
                return "bg-green-600 hover:bg-green-100";
            } else if (timeSlot.status === 1) {
                return "bg-yellow-600 hover:bg-yellow-100";
            } else if (timeSlot.status === 2) {
                return "bg-gray-600 hover:bg-gray-100 cursor-not-allowed";
            }
        }
        return "bg-[#248FCA] hover:bg-[#248FCA]/90";
    };

    const getStatus = (timeSlot: TimeSlot) => {
        if (timeSlot.id) {
            if (timeSlot.status === 0) {
                return "Công khai";
            } else if (timeSlot.status === 1) {
                return "Không công khai";
            } else if (timeSlot.status === 2) {
                return "Đã được đặt";
            }
        }
        return "";
    };

    const DAYS_OF_WEEK = [
        { short: "T2", full: "Thứ 2" },
        { short: "T3", full: "Thứ 3" },
        { short: "T4", full: "Thứ 4" },
        { short: "T5", full: "Thứ 5" },
        { short: "T6", full: "Thứ 6" },
        { short: "T7", full: "Thứ 7" },
        { short: "CN", full: "Chủ nhật" },
    ];

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
                        <div className="flex items-center space-x-2">
                            {selectedSlots.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <Select
                                        onValueChange={(val) =>
                                            setNewStatus(Number(val))
                                        }
                                        value={
                                            newStatus !== null
                                                ? newStatus.toString()
                                                : ""
                                        }
                                    >
                                        <SelectTrigger className="w-[150px] h-8 text-xs">
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">
                                                Công khai
                                            </SelectItem>
                                            <SelectItem value="1">
                                                Không công khai
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        size="sm"
                                        onClick={updateSelectedSlotsStatus}
                                        className="h-8 text-xs bg-[#248FCA] hover:bg-[#248FCA]/90"
                                        disabled={
                                            isLoading || newStatus === null
                                        }
                                    >
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Lưu trạng thái
                                    </Button>
                                </div>
                            )}
                            {isLoading && (
                                <div className="flex items-center space-x-2 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Đang tải...</span>
                                </div>
                            )}
                        </div>
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
                                            (timeSlot, slotIndex) => {
                                                const isSelected =
                                                    selectedSlots.some(
                                                        (slot) =>
                                                            slot.dayIndex ===
                                                                dayIndex &&
                                                            slot.slotIndex ===
                                                                slotIndex
                                                    );
                                                const baseColor =
                                                    getBadgeColor(timeSlot);
                                                const badgeColor = isSelected
                                                    ? "bg-[#248FCA] hover:bg-[#248FCA]/90"
                                                    : baseColor;
                                                return (
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
                                                                        value={formatTimeToHM(
                                                                            timeSlot.start
                                                                        )}
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
                                                                        value={formatTimeToHM(
                                                                            timeSlot.end
                                                                        )}
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
                                                                    className={`w-full justify-center ${badgeColor} text-white text-xs py-2 transition-all ${
                                                                        isSelected
                                                                            ? "ring-2 ring-[#248FCA]"
                                                                            : ""
                                                                    } ${
                                                                        timeSlot.status ===
                                                                        2
                                                                            ? "cursor-not-allowed"
                                                                            : "cursor-pointer"
                                                                    }`}
                                                                    onClick={() =>
                                                                        timeSlot.status !==
                                                                            2 &&
                                                                        toggleSelectSlot(
                                                                            dayIndex,
                                                                            slotIndex
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="flex flex-col items-center">
                                                                        <span>
                                                                            {formatTimeToHM(
                                                                                timeSlot.start
                                                                            )}{" "}
                                                                            -{" "}
                                                                            {formatTimeToHM(
                                                                                timeSlot.end
                                                                            )}
                                                                        </span>
                                                                        <div>
                                                                            {getStatus(
                                                                                timeSlot
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </Badge>
                                                                {timeSlot.status !==
                                                                    2 && (
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                                        <div className="flex space-x-1">
                                                                            {(!timeSlot.id ||
                                                                                timeSlot.status ===
                                                                                    1) && (
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
                                                                            )}
                                                                            <Button
                                                                                size="sm"
                                                                                variant="secondary"
                                                                                onClick={() =>
                                                                                    toggleSelectSlot(
                                                                                        dayIndex,
                                                                                        slotIndex
                                                                                    )
                                                                                }
                                                                                className="h-6 w-6 p-0"
                                                                                disabled={
                                                                                    isLoading
                                                                                }
                                                                            >
                                                                                <Calendar className="h-3 w-3" />
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
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
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

"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Plus, Trash2, Save, Calendar } from "lucide-react";
import { mockDoctors } from "@/app/hospitals/consultation/schedule/components";

interface TimeSlot {
    start: string;
    end: string;
    id: string;
}

interface DoctorSchedule {
    doctorId: number;
    date: string;
    timeSlots: TimeSlot[];
}

export default function AdminScheduleManager() {
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [startTime, setStartTime] = useState("13:00");
    const [endTime, setEndTime] = useState("17:00");
    const [intervalMinutes, setIntervalMinutes] = useState(30);
    const [generatedSlots, setGeneratedSlots] = useState<TimeSlot[]>([]);
    const [savedSchedules, setSavedSchedules] = useState<DoctorSchedule[]>([]);

    const currentDoctor = selectedDoctor
        ? mockDoctors.find((d) => d.id === selectedDoctor)
        : null;

    // Hàm tạo các khung giờ tự động
    const generateTimeSlots = () => {
        if (!startTime || !endTime) {
            alert("Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc!");
            return;
        }

        const slots: TimeSlot[] = [];
        const start = new Date(`2024-01-01T${startTime}:00`);
        const end = new Date(`2024-01-01T${endTime}:00`);

        if (start >= end) {
            alert("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!");
            return;
        }

        const current = new Date(start);
        let slotId = 1;

        while (current < end) {
            const slotStart = current.toTimeString().slice(0, 5);
            current.setMinutes(current.getMinutes() + intervalMinutes);

            if (current <= end) {
                const slotEnd = current.toTimeString().slice(0, 5);
                slots.push({
                    id: `slot-${slotId}`,
                    start: slotStart,
                    end: slotEnd,
                });
                slotId++;
            }
        }

        setGeneratedSlots(slots);
    };

    // Hàm xóa một khung giờ
    const removeTimeSlot = (slotId: string) => {
        setGeneratedSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    };

    // Hàm thêm khung giờ thủ công
    const addCustomSlot = () => {
        const customStart = prompt("Nhập giờ bắt đầu (HH:MM):");
        const customEnd = prompt("Nhập giờ kết thúc (HH:MM):");

        if (customStart && customEnd) {
            const newSlot: TimeSlot = {
                id: `custom-${Date.now()}`,
                start: customStart,
                end: customEnd,
            };
            setGeneratedSlots((prev) =>
                [...prev, newSlot].sort((a, b) =>
                    a.start.localeCompare(b.start)
                )
            );
        }
    };

    // Hàm lưu lịch làm việc
    const saveSchedule = () => {
        if (!selectedDoctor || generatedSlots.length === 0) {
            alert("Vui lòng chọn bác sĩ và tạo ít nhất một khung giờ!");
            return;
        }

        const newSchedule: DoctorSchedule = {
            doctorId: selectedDoctor,
            date: selectedDate,
            timeSlots: [...generatedSlots],
        };

        setSavedSchedules((prev) => {
            // Xóa lịch cũ của cùng bác sĩ và ngày (nếu có)
            const filtered = prev.filter(
                (schedule) =>
                    !(
                        schedule.doctorId === selectedDoctor &&
                        schedule.date === selectedDate
                    )
            );
            return [...filtered, newSchedule];
        });

        alert(
            `Đã lưu lịch làm việc cho ${currentDoctor?.name} ngày ${selectedDate}!`
        );
        setGeneratedSlots([]);
    };

    // Lấy lịch đã lưu của bác sĩ trong ngày được chọn
    const getCurrentSchedule = () => {
        return savedSchedules.find(
            (schedule) =>
                schedule.doctorId === selectedDoctor &&
                schedule.date === selectedDate
        );
    };

    const currentSchedule = getCurrentSchedule();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Schedule Generator */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span>Tạo lịch làm việc</span>
                        </CardTitle>
                        <CardDescription>
                            Tự động tạo các khung giờ tư vấn cho bác sĩ
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Doctor Selection */}
                        <div className="space-y-2">
                            <Label>Chọn bác sĩ</Label>
                            <Select
                                value={selectedDoctor?.toString() || ""}
                                onValueChange={(value) =>
                                    setSelectedDoctor(Number.parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn bác sĩ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockDoctors.map((doctor: any) => (
                                        <SelectItem
                                            key={doctor.id}
                                            value={doctor.id.toString()}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage
                                                        src={
                                                            doctor.avatar ||
                                                            "/placeholder.svg"
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {doctor.name
                                                            .split(" ")
                                                            .pop()
                                                            ?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>
                                                    {doctor.name} -{" "}
                                                    {doctor.specialty}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Selection */}
                        <div className="space-y-2">
                            <Label>Chọn ngày</Label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>

                        {/* Time Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Giờ bắt đầu</Label>
                                <Input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Giờ kết thúc</Label>
                                <Input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Interval */}
                        <div className="space-y-2">
                            <Label>Khoảng cách (phút)</Label>
                            <Select
                                value={intervalMinutes.toString()}
                                onValueChange={(value) =>
                                    setIntervalMinutes(Number.parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 phút</SelectItem>
                                    <SelectItem value="30">30 phút</SelectItem>
                                    <SelectItem value="45">45 phút</SelectItem>
                                    <SelectItem value="60">60 phút</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Generate Button */}
                        <Button onClick={generateTimeSlots} className="w-full">
                            <Clock className="h-4 w-4 mr-2" />
                            Tạo khung giờ tự động
                        </Button>

                        {/* Add Custom Slot */}
                        <Button
                            onClick={addCustomSlot}
                            variant="outline"
                            className="w-full bg-transparent"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm khung giờ thủ công
                        </Button>
                    </CardContent>
                </Card>

                {/* Current Schedule Display */}
                {currentSchedule && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-600">
                                Lịch đã lưu
                            </CardTitle>
                            <CardDescription>
                                {currentDoctor?.name} - {selectedDate}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                {currentSchedule.timeSlots.map((slot) => (
                                    <Badge
                                        key={slot.id}
                                        variant="secondary"
                                        className="justify-center py-2"
                                    >
                                        {slot.start} - {slot.end}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right Column - Generated Slots Preview */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Khung giờ đã tạo</CardTitle>
                        <CardDescription>
                            {generatedSlots.length} khung giờ - Mỗi khung{" "}
                            {intervalMinutes} phút
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {generatedSlots.length > 0 ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                                    {generatedSlots.map((slot, index) => (
                                        <div
                                            key={slot.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Badge variant="outline">
                                                    #{index + 1}
                                                </Badge>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span className="font-medium">
                                                        {slot.start} -{" "}
                                                        {slot.end}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    removeTimeSlot(slot.id)
                                                }
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <Button
                                        onClick={saveSchedule}
                                        className="w-full"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Lưu lịch làm việc
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Chưa có khung giờ nào được tạo</p>
                                <p className="text-sm">
                                    Nhập thông tin và nhấn "Tạo khung giờ tự
                                    động"
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Summary Card */}
                {generatedSlots.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Tóm tắt</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span>Tổng số khung giờ:</span>
                                <Badge>{generatedSlots.length}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Thời gian làm việc:</span>
                                <span>
                                    {startTime} - {endTime}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Mỗi cuộc tư vấn:</span>
                                <span>{intervalMinutes} phút</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tổng thời gian:</span>
                                <span>
                                    {generatedSlots.length * intervalMinutes}{" "}
                                    phút
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

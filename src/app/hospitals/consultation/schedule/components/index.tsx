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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Clock,
    User,
    Phone,
    FileText,
    Play,
    Square,
    CheckCircle,
    CalendarIcon,
} from "lucide-react";

export type UserRole = "admin" | "doctor" | "patient" | "receptionist";
export type AppointmentStatus =
    | "scheduled"
    | "confirmed"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "no-show";

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    avatar: string;
    email: string;
    phone: string;
    workingHours: string;
    rating: number;
    experience: number;
    consultationFee: number;
    availableSlots: string[];
    isOnline: boolean;
}

export interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    address: string;
    emergencyContact: string;
    medicalHistory: string[];
    avatar: string;
}

export interface Appointment {
    id: number;
    patientId: number;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    doctorId: number;
    doctorName: string;
    doctorSpecialty: string;
    date: string;
    time: string;
    endTime: string;
    status: AppointmentStatus;
    reason: string;
    notes: string;
    consultationFee: number;
    paymentStatus: "pending" | "paid" | "refunded";
    createdAt: string;
    updatedAt: string;
}

// Mock data
export const mockDoctors: Doctor[] = [
    {
        id: 1,
        name: "BS. Nguyễn Văn An",
        specialty: "Tim mạch",
        avatar: "/placeholder.svg?height=60&width=60",
        email: "nguyenvanan@medconsult.com",
        phone: "0901111111",
        workingHours: "8:00 - 17:00",
        rating: 4.8,
        experience: 15,
        consultationFee: 500000,
        availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        isOnline: true,
    },
    {
        id: 2,
        name: "BS. Trần Thị Bình",
        specialty: "Da liễu",
        avatar: "/placeholder.svg?height=60&width=60",
        email: "tranthibinh@medconsult.com",
        phone: "0902222222",
        workingHours: "9:00 - 18:00",
        rating: 4.9,
        experience: 12,
        consultationFee: 400000,
        availableSlots: ["09:30", "10:30", "11:30", "14:30", "15:30", "16:30"],
        isOnline: false,
    },
    {
        id: 3,
        name: "BS. Lê Minh Cường",
        specialty: "Nội khoa",
        avatar: "/placeholder.svg?height=60&width=60",
        email: "leminhcuong@medconsult.com",
        phone: "0903333333",
        workingHours: "7:30 - 16:30",
        rating: 4.7,
        experience: 20,
        consultationFee: 450000,
        availableSlots: ["08:00", "09:00", "10:00", "13:30", "14:30", "15:30"],
        isOnline: true,
    },
];

export const mockPatients: Patient[] = [
    {
        id: 1,
        name: "Nguyễn Thị Mai",
        email: "mai.nguyen@email.com",
        phone: "0901234567",
        dateOfBirth: "1985-03-15",
        gender: "female",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        emergencyContact: "0987654321",
        medicalHistory: ["Cao huyết áp", "Tiểu đường type 2"],
        avatar: "/placeholder.svg?height=60&width=60",
    },
    {
        id: 2,
        name: "Trần Văn Hùng",
        email: "hung.tran@email.com",
        phone: "0912345678",
        dateOfBirth: "1990-07-22",
        gender: "male",
        address: "456 Đường XYZ, Quận 3, TP.HCM",
        emergencyContact: "0976543210",
        medicalHistory: ["Dị ứng thuốc kháng sinh"],
        avatar: "/placeholder.svg?height=60&width=60",
    },
];

export const mockAppointments: Appointment[] = [
    {
        id: 1,
        patientId: 1,
        patientName: "Nguyễn Thị Mai",
        patientPhone: "0901234567",
        patientEmail: "mai.nguyen@email.com",
        doctorId: 1,
        doctorName: "BS. Nguyễn Văn An",
        doctorSpecialty: "Tim mạch",
        date: "2024-01-15",
        time: "09:00",
        endTime: "09:30",
        status: "confirmed",
        reason: "Khám tim định kỳ",
        notes: "Bệnh nhân có tiền sử cao huyết áp",
        consultationFee: 500000,
        paymentStatus: "paid",
        createdAt: "2024-01-10T10:00:00Z",
        updatedAt: "2024-01-12T14:30:00Z",
    },
    {
        id: 2,
        patientId: 2,
        patientName: "Trần Văn Hùng",
        patientPhone: "0912345678",
        patientEmail: "hung.tran@email.com",
        doctorId: 1,
        doctorName: "BS. Nguyễn Văn An",
        doctorSpecialty: "Tim mạch",
        date: "2024-01-15",
        time: "10:00",
        endTime: "10:30",
        status: "in-progress",
        reason: "Đau ngực",
        notes: "",
        consultationFee: 500000,
        paymentStatus: "paid",
        createdAt: "2024-01-14T09:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
    },
];

export default function DoctorSchedule() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );
    const [selectedDoctorId, setSelectedDoctorId] = useState(1);
    const [appointments, setAppointments] = useState(mockAppointments);

    const currentDoctor = mockDoctors.find((d) => d.id === selectedDoctorId);
    const selectedDateStr =
        selectedDate?.toISOString().split("T")[0] || "2024-01-15";
    const todayAppointments = appointments.filter(
        (apt) =>
            apt.doctorId === selectedDoctorId && apt.date === selectedDateStr
    );

    const updateAppointmentStatus = (
        appointmentId: number,
        newStatus: string
    ) => {
        setAppointments((prev) =>
            prev.map((apt) =>
                apt.id === appointmentId
                    ? { ...apt, status: newStatus as any }
                    : apt
            )
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled":
                return "bg-blue-100 text-blue-800";
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "in-progress":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-gray-100 text-gray-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "scheduled":
                return "Đã đặt lịch";
            case "confirmed":
                return "Đã xác nhận";
            case "in-progress":
                return "Đang diễn ra";
            case "completed":
                return "Đã hoàn thành";
            case "cancelled":
                return "Đã hủy";
            default:
                return status;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Lịch làm việc
                </h1>
                <p className="text-gray-600">
                    Quản lý lịch làm việc và cuộc hẹn của bác sĩ
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Doctor Info & Calendar */}
                <div className="space-y-6">
                    {/* Doctor Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin bác sĩ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select
                                value={selectedDoctorId.toString()}
                                onValueChange={(value) =>
                                    setSelectedDoctorId(Number.parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockDoctors.map((doctor) => (
                                        <SelectItem
                                            key={doctor.id}
                                            value={doctor.id.toString()}
                                        >
                                            {doctor.name} - {doctor.specialty}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {currentDoctor && (
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={
                                                    currentDoctor.avatar ||
                                                    "/placeholder.svg"
                                                }
                                            />
                                            <AvatarFallback>
                                                {currentDoctor.name
                                                    .split(" ")
                                                    .pop()
                                                    ?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">
                                                {currentDoctor.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {currentDoctor.specialty}
                                            </p>
                                            <Badge
                                                variant={
                                                    currentDoctor.isOnline
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="text-xs mt-1"
                                            >
                                                {currentDoctor.isOnline
                                                    ? "Đang trực tuyến"
                                                    : "Ngoại tuyến"}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span>
                                                Giờ làm việc:{" "}
                                                {currentDoctor.workingHours}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <span>{currentDoctor.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Calendar */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch làm việc</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Today's Appointments */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <CalendarIcon className="h-5 w-5" />
                                <span>
                                    Lịch hẹn ngày{" "}
                                    {selectedDate?.toLocaleDateString("vi-VN")}
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {todayAppointments.length} cuộc hẹn -{" "}
                                {currentDoctor?.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {todayAppointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="border rounded-lg p-4 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span className="font-semibold">
                                                        {appointment.time} -{" "}
                                                        {appointment.endTime}
                                                    </span>
                                                </div>
                                                <Badge
                                                    className={getStatusColor(
                                                        appointment.status
                                                    )}
                                                >
                                                    {getStatusText(
                                                        appointment.status
                                                    )}
                                                </Badge>
                                            </div>
                                            <div className="flex space-x-2">
                                                {appointment.status ===
                                                    "scheduled" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            updateAppointmentStatus(
                                                                appointment.id,
                                                                "confirmed"
                                                            )
                                                        }
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>Xác nhận</span>
                                                    </Button>
                                                )}
                                                {appointment.status ===
                                                    "confirmed" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            updateAppointmentStatus(
                                                                appointment.id,
                                                                "in-progress"
                                                            )
                                                        }
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <Play className="h-3 w-3" />
                                                        <span>Bắt đầu</span>
                                                    </Button>
                                                )}
                                                {appointment.status ===
                                                    "in-progress" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            updateAppointmentStatus(
                                                                appointment.id,
                                                                "completed"
                                                            )
                                                        }
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <Square className="h-3 w-3" />
                                                        <span>Hoàn thành</span>
                                                    </Button>
                                                )}
                                                {(appointment.status ===
                                                    "scheduled" ||
                                                    appointment.status ===
                                                        "confirmed") && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            updateAppointmentStatus(
                                                                appointment.id,
                                                                "cancelled"
                                                            )
                                                        }
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <Square className="h-3 w-3" />
                                                        <span>Hủy</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <span>
                                                    <strong>Bệnh nhân:</strong>{" "}
                                                    {appointment.patientName}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span>
                                                    <strong>SĐT:</strong>{" "}
                                                    {appointment.patientPhone}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2 md:col-span-2">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                                <span>
                                                    <strong>Lý do khám:</strong>{" "}
                                                    {appointment.reason}
                                                </span>
                                            </div>
                                            {appointment.notes && (
                                                <div className="flex items-center space-x-2 md:col-span-2">
                                                    <FileText className="h-4 w-4 text-gray-500" />
                                                    <span>
                                                        <strong>
                                                            Ghi chú:
                                                        </strong>{" "}
                                                        {appointment.notes}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t text-sm text-gray-600">
                                            <span>
                                                Phí tư vấn:{" "}
                                                {appointment.consultationFee.toLocaleString(
                                                    "vi-VN"
                                                )}{" "}
                                                ₫
                                            </span>
                                            <Badge
                                                className={
                                                    appointment.paymentStatus ===
                                                    "paid"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }
                                            >
                                                {appointment.paymentStatus ===
                                                "paid"
                                                    ? "Đã thanh toán"
                                                    : "Chờ thanh toán"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}

                                {todayAppointments.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>
                                            Không có cuộc hẹn nào trong ngày này
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

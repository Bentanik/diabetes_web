"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, User, Save, Calendar } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import useCreateConsultation, {
    ConsultationFormData,
} from "../hooks/use-create-consultation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ExcelImportDialog from "./excel-import-dialog";
import WeeklySchedule, { TimeSlot } from "./weekly-schedule";
import Header from "./header";

interface DaySchedule {
    date: string;
    times: TimeSlot[];
}

interface ScheduleData {
    doctorId: string;
    timeTemplates: DaySchedule[];
}

const mockDoctors = {
    totalPages: 1,
    items: [
        {
            id: "d9af5b42-f881-4de1-9ae3-08f0644d2da7",
            name: "Bác sĩ Nguyễn Văn A",
            avatar: "/images/home1.jpg",
            phoneNumber: "0909123456",
            numberOfExperiences: 10,
            position: 0,
            gender: 0,
        },
    ],
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

const generateWeekOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i <= 4; i++) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1 + i * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const startStr = weekStart.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
        });
        const endStr = weekEnd.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
        });

        options.push({
            label: `${startStr} - ${endStr}`,
            value: `week-${i}`,
            dates: Array.from({ length: 7 }, (_, index) => {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + index);
                return date.toISOString().split("T")[0];
            }),
        });
    }

    return options;
};

export default function CreateDoctorSchedule() {
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ start: "", end: "" });
    const [editingSlot, setEditingSlot] = useState<{
        dayIndex: number;
        slotIndex: number;
    } | null>(null);

    const [selectedWeek, setSelectedWeek] = useState("");
    const [scheduleData, setScheduleData] = useState<ScheduleData>({
        doctorId: "",
        timeTemplates: [],
    });
    const [showPreview, setShowPreview] = useState(false);

    const weekOptions = generateWeekOptions();
    const selectedWeekData = weekOptions.find((w) => w.value === selectedWeek);
    const selectedDoctor = mockDoctors.items.find(
        (d) => d.id === selectedDoctorId
    );

    const { form, onSubmit } = useCreateConsultation({
        doctorId: selectedDoctorId,
    });

    const handleFormSubmit = async (formData: any) => {
        if (!onSubmit || typeof onSubmit !== "function") {
            return;
        }
        try {
            await onSubmit(formData, () => {});
        } catch (error) {
            console.error("Error creating consultation:", error);
            toast.error("Có lỗi xảy ra khi tạo cuộc tư vấn.");
        }
    };

    const handleScheduleSubmit = async () => {
        try {
            const formData: ConsultationFormData = {
                timeTemplates: scheduleData.timeTemplates,
            };
            onSubmit(formData, () => {
                form.reset();
                setScheduleData({ doctorId: "", timeTemplates: [] });
            });
        } catch (error) {
            console.error("Error submitting schedule data:", error);
            // Optionally, show an error message to the user
        }
    };

    const handleExcelImport = async (importedData: any[]) => {
        try {
            setLoading(true);
            // Transform the imported data into TCreateConsultation format
            const transformedData: REQUEST.TCreateConsultation = {
                timeTemplates: importedData.reduce(
                    (acc: REQUEST.TimeTemplate[], consultation) => {
                        const existingTemplate = acc.find(
                            (template) => template.date === consultation.date
                        );
                        const timeRange: REQUEST.TimeRange = {
                            start: consultation.startTime,
                            end: consultation.endTime,
                        };
                        if (existingTemplate) {
                            existingTemplate.times.push(timeRange);
                        } else {
                            acc.push({
                                date: consultation.date,
                                times: [timeRange],
                            });
                        }
                        return acc;
                    },
                    []
                ),
            };

            await handleFormSubmit(transformedData);
        } catch (error) {
            console.error("Error importing consultations:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

            {/* Header */}
            <header>
                <Header />
            </header>

            <div className=" py-4">
                {/* Doctor Selection */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-[#248FCA]" />
                                <h2 className="text-lg font-semibold text-[#248FCA]">
                                    Chọn bác sĩ
                                </h2>
                            </div>
                            <Select
                                value={selectedDoctorId}
                                onValueChange={setSelectedDoctorId}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Chọn bác sĩ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockDoctors.items.map((doctor) => (
                                        <SelectItem
                                            key={doctor.id}
                                            value={doctor.id}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 bg-[#248FCA] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                    {doctor.name.charAt(
                                                        doctor.name.lastIndexOf(
                                                            " "
                                                        ) + 1
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">
                                                        {doctor.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {doctor.phoneNumber}
                                                    </div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-[#248FCA]" />
                                <h2 className="text-lg font-semibold text-[#248FCA]">
                                    Chọn tuần
                                </h2>
                            </div>
                            <Select
                                value={selectedWeek}
                                onValueChange={setSelectedWeek}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Chọn tuần..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {weekOptions.map((week) => (
                                        <SelectItem
                                            key={week.value}
                                            value={week.value}
                                        >
                                            {week.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div></div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-[#248FCA]" />
                                <h2 className="text-lg font-semibold text-[#248FCA]">
                                    Tạo bằng file
                                </h2>
                            </div>{" "}
                            <ExcelImportDialog
                                onImportSuccess={handleExcelImport}
                                doctorId={selectedDoctorId}
                            />
                        </div>
                    </div>

                    {selectedDoctor && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-gradient-to-r from-[#248FCA]/10 to-blue-50 border border-[#248FCA]/20 rounded-xl"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-[#248FCA] rounded-full flex items-center justify-center text-white text-lg font-bold">
                                    {selectedDoctor.name.charAt(
                                        selectedDoctor.name.lastIndexOf(" ") + 1
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {selectedDoctor.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {selectedDoctor.phoneNumber}
                                    </p>
                                    <p className="text-xs text-[#248FCA]">
                                        {selectedDoctor.numberOfExperiences} năm
                                        kinh nghiệm
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* View Mode Toggle */}
                {selectedDoctorId && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5 text-[#248FCA]" />
                                <h2 className="text-xl font-semibold text-[#248FCA]">
                                    Khung giờ tư vấn
                                </h2>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                    <Dialog
                                        open={showPreview}
                                        onOpenChange={setShowPreview}
                                    >
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Xem trước JSON
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Preview JSON
                                                </DialogTitle>
                                            </DialogHeader>
                                            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto">
                                                {JSON.stringify(
                                                    scheduleData,
                                                    null,
                                                    2
                                                )}
                                            </pre>
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        onClick={handleScheduleSubmit}
                                        disabled={loading}
                                        size="sm"
                                        className="bg-[#248FCA] hover:bg-[#248FCA]/90"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        ) : (
                                            <Save className="h-4 w-4 mr-2" />
                                        )}
                                        Lưu lịch tuần
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Schedule View */}
                        {selectedWeek && selectedWeekData && (
                            <WeeklySchedule
                                selectedWeekData={selectedWeekData}
                                daysOfWeek={DAYS_OF_WEEK}
                                scheduleData={scheduleData}
                                setScheduleData={setScheduleData}
                                editingSlot={editingSlot}
                                setEditingSlot={setEditingSlot}
                            />
                        )}
                    </motion.div>
                )}

                {/* Empty State when no doctor selected */}
                {!selectedDoctorId && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                    >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Chọn bác sĩ để bắt đầu
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Vui lòng chọn một bác sĩ từ danh sách để tạo và quản
                            lý lịch tư vấn theo tuần hoặc xem danh sách khung
                            giờ hiện có.
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Edit Dialog for table mode */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa khung giờ</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Thời gian bắt đầu
                            </label>
                            <Input
                                type="time"
                                value={newTemplate.start}
                                onChange={(e) =>
                                    setNewTemplate((prev) => ({
                                        ...prev,
                                        start: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Thời gian kết thúc
                            </label>
                            <Input
                                type="time"
                                value={newTemplate.end}
                                onChange={(e) =>
                                    setNewTemplate((prev) => ({
                                        ...prev,
                                        end: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                className="bg-[#248FCA] hover:bg-[#248FCA]/90"
                                onClick={() => {
                                    // Handle edit logic here
                                    toast.success(
                                        "Cập nhật khung giờ thành công"
                                    );
                                    setIsEditDialogOpen(false);
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

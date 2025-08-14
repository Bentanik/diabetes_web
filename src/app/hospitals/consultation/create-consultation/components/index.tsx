"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Clock, User, Save } from "lucide-react";
import {
    Dialog,
    DialogContent,
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
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ExcelImportDialog from "./excel-import-dialog";
import WeeklySchedule, { TimeSlot } from "./weekly-schedule";
import Header from "./header";
import DateSelector from "./date-selector";
import { useGetConsultationsCursor } from "@/app/hospitals/consultation/create-consultation/hooks/use-get-consultation";
import useUpdateConsultation, {
    TimeTemplateFormData,
} from "../hooks/use-update-consultation";

interface DaySchedule {
    date: string;
    times: TimeSlot[];
}

interface ScheduleData {
    timeTemplates: DaySchedule[];
}

interface WeekOption {
    label: string;
    value: string;
    dates: string[];
    weekStart: Date;
    weekEnd: Date;
}

const mockDoctors = {
    totalPages: 1,
    items: [
        {
            id: "9554b171-acdc-42c3-8dec-5d3aba44ca99",
            name: "Bác sĩ Nguyễn Văn A",
            avatar: "/images/home1.jpg",
            phoneNumber: "0909123456",
            numberOfExperiences: 10,
            position: 0,
            gender: 0,
        },
    ],
};

// Hàm giúp định dạng ngày thành YYYY-MM-DD theo giờ địa phương
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Tạo danh sách tuần trong tháng (bắt đầu từ thứ Hai)
const generateWeekOptionsForMonth = (year: number, month: number) => {
    const weeks: WeekOption[] = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    let currentWeekStart = new Date(firstDay);
    // Lùi về thứ Hai (getDay: Chủ Nhật=0, Thứ Hai=1,...)
    currentWeekStart.setDate(
        firstDay.getDate() - ((firstDay.getDay() + 6) % 7)
    );

    let weekNumber = 1;
    while (currentWeekStart <= lastDay) {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6);

        if (weekEnd >= firstDay && currentWeekStart <= lastDay) {
            const startStr = currentWeekStart.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
            });
            const endStr = weekEnd.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
            });

            weeks.push({
                label: `Tuần ${weekNumber} (${startStr} - ${endStr})`,
                value: `week-${year}-${month}-${weekNumber}`,
                dates: Array.from({ length: 7 }, (_, index) => {
                    const date = new Date(currentWeekStart);
                    date.setDate(currentWeekStart.getDate() + index);
                    return formatDate(date); // Dùng định dạng local YYYY-MM-DD
                }),
                weekStart: new Date(currentWeekStart),
                weekEnd: new Date(weekEnd),
            });

            weekNumber++;
        }
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    return weeks;
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
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
    // State lựa chọn năm, tháng, tuần
    const currentDate = new Date();
    const [selectedYear, setSelectedYear] = useState<string>(
        currentDate.getFullYear().toString()
    );
    const [selectedMonth, setSelectedMonth] = useState<string>(
        (currentDate.getMonth() + 1).toString()
    );
    const [selectedWeek, setSelectedWeek] = useState<string>("");

    const [scheduleData, setScheduleData] = useState<ScheduleData>({
        timeTemplates: [],
    });

    const [hasChanges, setHasChanges] = useState(true);

    console.log();

    // Tính toán tuần và thông tin tuần được chọn
    const weekOptions = useMemo(() => {
        if (!selectedYear || !selectedMonth) return [];
        return generateWeekOptionsForMonth(
            parseInt(selectedYear, 10),
            parseInt(selectedMonth, 10)
        );
    }, [selectedYear, selectedMonth]);

    const selectedWeekData = useMemo(() => {
        return weekOptions.find((w) => w.value === selectedWeek);
    }, [weekOptions, selectedWeek]);

    // Chuẩn bị tham số API dựa trên tuần đã chọn (dùng định dạng YYYY-MM-DD local)
    const apiParams = useMemo(() => {
        if (!selectedWeekData) return null;
        return {
            pageSize: 7,
            fromDate: formatDate(selectedWeekData.weekStart),
            toDate: formatDate(selectedWeekData.weekEnd),
        };
    }, [
        selectedWeekData?.weekStart?.getTime(),
        selectedWeekData?.weekEnd?.getTime(),
    ]);

    // Use react-query to fetch consultations (infinite query)
    const {
        data: consultationData,
        isLoading: isLoadingConsultations,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useGetConsultationsCursor(
        { doctorId: selectedDoctorId },
        apiParams || { pageSize: 7, fromDate: "", toDate: "" }
    );

    // Clear scheduleData when doctor or week changes
    useEffect(() => {
        setScheduleData({ timeTemplates: [] });
        setHasChanges(false);
    }, [selectedDoctorId, selectedWeek]);

    // Transform API data into scheduleData when data pages arrive
    // useEffect(() => {
    //     // Only proceed if a week and doctor are selected
    //     if (!selectedDoctorId || !selectedWeekData) {
    //         return;
    //     }
    //     if (consultationData?.pages) {
    //         const allConsultations = consultationData.pages.flatMap(
    //             (page: any) => page.data?.items ?? []
    //         );

    //         if (allConsultations.length > 0) {
    //             // Map API items to our schedule format
    //             const transformedScheduleData: ScheduleData = {
    //                 timeTemplates: allConsultations.map((item: any) => ({
    //                     date: item.date.split("T")[0], // YYYY-MM-DD
    //                     times: item.consultationTemplates.map(
    //                         (template: any) => ({
    //                             start: template.startTime,
    //                             end: template.endTime,
    //                             id: template.id,
    //                             status: template.status,
    //                         })
    //                     ),
    //                 })),
    //             };
    //             setScheduleData(transformedScheduleData);
    //         } else {
    //             // No items returned for this week
    //             setScheduleData({ timeTemplates: [] });
    //         }
    //         setHasChanges(false);
    //     }
    // }, [consultationData?.pages]);

    useEffect(() => {
        if (!selectedDoctorId || !selectedWeekData) {
            return;
        }
        if (consultationData?.pages) {
            const allConsultations = consultationData.pages.flatMap(
                (page: any) => page.data?.items ?? []
            );
            if (allConsultations.length > 0) {
                // Map API items to scheduleData với định dạng thời gian HH:mm
                const transformedScheduleData: ScheduleData = {
                    timeTemplates: allConsultations.map((item: any) => {
                        const date = item.date.split("T")[0];
                        const timeslots = item.consultationTemplates.map(
                            (template: any) => {
                                // Cắt và pad để được HH:mm (loại bỏ giây)
                                const [hourStart, minuteStart] =
                                    template.startTime.split(":");
                                const [hourEnd, minuteEnd] =
                                    template.endTime.split(":");
                                return {
                                    start: `${hourStart.padStart(
                                        2,
                                        "0"
                                    )}:${minuteStart.padStart(2, "0")}`,
                                    end: `${hourEnd.padStart(
                                        2,
                                        "0"
                                    )}:${minuteEnd.padStart(2, "0")}`,
                                    id: template.id,
                                    status: template.status,
                                };
                            }
                        );
                        return { date, times: timeslots };
                    }),
                };
                setScheduleData(transformedScheduleData);
            } else {
                setScheduleData({ timeTemplates: [] });
            }
            setHasChanges(false);
        }
    }, [consultationData?.pages]);

    const selectedDoctor = mockDoctors.items.find(
        (d) => d.id === selectedDoctorId
    );

    const { form, onSubmit } = useCreateConsultation({
        doctorId: selectedDoctorId,
    });

    const { form: updateForm, onSubmit: UpdateSubmit } = useUpdateConsultation({
        doctorId: selectedDoctorId,
    });

    const handleFormSubmit = async (formData: any) => {
        if (!onSubmit) return;
        try {
            await onSubmit(formData, () => {});
        } catch (error) {
            console.error("Error creating consultation:", error);
        }
    };

    const formatTimeToHMS = (time: string): string => {
        if (time.includes(":") && time.split(":").length === 2) {
            return `${time}:00`;
        }
        return time;
    };

    const handleUpdateScheduleSubmit = async () => {
        try {
            // Sử dụng selectedStatus (kiểu number) hoặc mặc định 0
            const statusValue = selectedStatus !== null ? selectedStatus : 0;
            const formData: TimeTemplateFormData = {
                status: statusValue,
                upsertTimeTemplates: scheduleData.timeTemplates.flatMap((day) =>
                    day.times.map((time) => ({
                        timeTemplateId: time.id || null,
                        date: day.date,
                        timeRange: {
                            // Đảm bảo thời gian ở định dạng HH:MM:SS
                            start: formatTimeToHMS(time.start),
                            end: formatTimeToHMS(time.end),
                        },
                    }))
                ),
                templateIdsToDelete: [],
            };
            await UpdateSubmit(formData);
            updateForm.reset();
            setSelectedStatus(null);
            setHasChanges(false);
        } catch (error) {
            console.error("Error submitting schedule data:", error);
        }
    };

    const handleScheduleSubmit = async () => {
        try {
            const formData: ConsultationFormData = {
                timeTemplates: scheduleData.timeTemplates,
            };
            onSubmit(formData, () => {
                form.reset();
                setScheduleData({ timeTemplates: [] });
                setHasChanges(false);
            });
        } catch (error) {
            console.error("Error submitting schedule data:", error);
        }
    };

    const handleExcelImport = async (importedData: any[]) => {
        try {
            setLoading(true);
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

    const hasConsultationData = useMemo(() => {
        if (!consultationData?.pages) return false;
        const allItems = consultationData.pages.flatMap(
            (page) => page.data?.items ?? []
        );
        return allItems.length > 0;
    }, [consultationData]);

    const handleWeekChange = (newWeek: string) => {
        setSelectedWeek(newWeek);
        // Reset editing state when week changes
        setEditingSlot(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

            {/* Header */}
            <header>
                <Header />
            </header>

            <div className="py-4">
                {/* Doctor Selection and Date Selection */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {/* Chọn bác sĩ */}
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

                        {/* Date Selector Component */}
                        <DateSelector
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth}
                            selectedWeek={selectedWeek}
                            setSelectedWeek={handleWeekChange}
                            selectedWeekData={selectedWeekData}
                        />

                        {/* Import Excel */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5 text-[#248FCA]" />
                                <h2 className="text-lg font-semibold text-[#248FCA]">
                                    Tạo bằng file
                                </h2>
                            </div>
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

                    {/* Selected Info Display */}
                    {selectedYear &&
                        selectedMonth &&
                        selectedWeek &&
                        selectedWeekData && (
                            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-xl">
                                <div className="flex items-center space-x-2 text-green-800">
                                    <Clock className="h-5 w-5" />
                                    <span className="font-medium">
                                        Đã chọn: {selectedWeekData.label} - Năm{" "}
                                        {selectedYear}
                                    </span>
                                </div>
                            </div>
                        )}

                    {/* Loading State */}
                    {isLoadingConsultations &&
                        selectedDoctorId &&
                        selectedWeekData && (
                            <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-xl">
                                <div className="flex items-center space-x-2 text-blue-800">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-800 border-t-transparent"></div>
                                    <span className="font-medium">
                                        Đang tải dữ liệu khung giờ...
                                    </span>
                                </div>
                            </div>
                        )}
                </motion.div>

                {/* View Mode Toggle & Weekly Schedule */}
                {selectedDoctorId && selectedWeek && selectedWeekData && (
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
                                    {hasConsultationData ? (
                                        <Button
                                            onClick={handleUpdateScheduleSubmit}
                                            disabled={
                                                loading ||
                                                isLoadingConsultations
                                                // hasChanges
                                            }
                                            size="sm"
                                            className="bg-[#248FCA] hover:bg-[#248FCA]/90"
                                        >
                                            {loading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            ) : (
                                                <Save className="h-4 w-4 mr-2" />
                                            )}
                                            Cập nhật lịch tuần
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleScheduleSubmit}
                                            disabled={
                                                loading ||
                                                isLoadingConsultations
                                            }
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
                                    )}

                                    {/* Load More Button nếu có hasNextPage */}
                                    {hasNextPage && (
                                        <Button
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {isFetchingNextPage ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent mr-2"></div>
                                            ) : (
                                                "Tải thêm"
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Weekly Schedule View */}
                        <WeeklySchedule
                            selectedWeekData={selectedWeekData}
                            scheduleData={scheduleData}
                            setScheduleData={setScheduleData}
                            editingSlot={editingSlot}
                            setEditingSlot={setEditingSlot}
                            isLoading={isLoadingConsultations}
                            onStatusUpdate={() => setHasChanges(true)}
                        />
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

                {/* Empty State when doctor selected but no time period selected */}
                {selectedDoctorId &&
                    (!selectedYear || !selectedMonth || !selectedWeek) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
                        >
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock className="h-10 w-10 text-[#248FCA]" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Chọn thời gian để tiếp tục
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Vui lòng chọn năm, tháng và tuần để tạo lịch tư
                                vấn cho bác sĩ đã chọn.
                            </p>
                        </motion.div>
                    )}
            </div>

            {/* Edit Dialog for table mode (unchanged) */}
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

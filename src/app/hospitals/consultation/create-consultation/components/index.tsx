"use client";
import { useState, useEffect, useMemo, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import ExcelImportDialog from "./excel-import-dialog";
import WeeklySchedule, { TimeSlot } from "./weekly-schedule";
import Header from "./header";
import DateSelector from "./date-selector";
import { useGetConsultationsCursor } from "@/app/hospitals/consultation/create-consultation/hooks/use-get-consultation";
import useUpdateConsultation, {
    TimeTemplateFormData,
} from "../hooks/use-update-consultation";
import { FormProvider, useForm } from "react-hook-form";
import DoctorSelect from "./select-doctor";

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
    const [changedTimeSlots, setChangedTimeSlots] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<number>(0);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);

    const handleStatusChange = (status: number) => {
        setSelectedStatus(status);
    };

    // Callback function để nhận deletedIds từ WeeklySchedule
    const handleDeletedIdsUpdate = (ids: string[]) => {
        setDeletedIds(ids);
    };

    const handleChangedSlotsUpdate = (changedSlots: any[]) => {
        setChangedTimeSlots(changedSlots);
    };

    const [triggerRemoveMarkedSlots, setTriggerRemoveMarkedSlots] = useState<
        (() => void) | null
    >(null);

    const handleRemoveMarkedSlotsCallback = (removeFunction: () => void) => {
        setTriggerRemoveMarkedSlots(() => removeFunction);
    };

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
    } = useGetConsultationsCursor(
        { doctorId: selectedDoctorId },
        apiParams || { pageSize: 7, fromDate: "", toDate: "" }
    );

    // Clear scheduleData when doctor or week changes
    useEffect(() => {
        setScheduleData({ timeTemplates: [] });
        // setHasChanges(0);
    }, [selectedDoctorId, selectedWeek]);

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
            // setHasChanges(false);
        }
    }, [consultationData?.pages]);

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
            if (triggerRemoveMarkedSlots) {
                triggerRemoveMarkedSlots();
            }
            const formData: TimeTemplateFormData = {
                status: selectedStatus,
                upsertTimeTemplates: changedTimeSlots,
                templateIdsToDelete: deletedIds,
            };
            await UpdateSubmit(formData);

            // Reset states after successful submission
            setChangedTimeSlots([]);
            setDeletedIds([]);
            // setSelectedStatusValue(0);
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
                // setHasChanges(false);
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
    const doctorSelectMethods = useForm({
        defaultValues: {
            doctorId: "",
        },
    });

    const watchedDoctorId = doctorSelectMethods.watch("doctorId");

    // Effect để sync giữa form và state hiện tại
    useEffect(() => {
        if (watchedDoctorId && watchedDoctorId !== selectedDoctorId) {
            setSelectedDoctorId(watchedDoctorId);
            // Reset changed slots when doctor changes
            setChangedTimeSlots([]);
            setDeletedIds([]);
        }
    }, [watchedDoctorId, selectedDoctorId]);

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
                            <FormProvider {...doctorSelectMethods}>
                                <DoctorSelect
                                    control={doctorSelectMethods.control}
                                    name="doctorId"
                                />
                            </FormProvider>
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
                            onStatusChange={handleStatusChange}
                            onDeletedIdsUpdate={handleDeletedIdsUpdate}
                            onRegisterRemoveFunction={
                                handleRemoveMarkedSlotsCallback
                            }
                            onChangedSlotsUpdate={handleChangedSlotsUpdate}
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

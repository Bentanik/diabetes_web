"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Clock, User, Save, Building2, Phone, BadgeCheck, BadgeCheckIcon } from "lucide-react";
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
import Header from "./header";
import DateSelector from "./date-selector";
import useUpdateConsultation, {
    TimeTemplateFormData,
} from "../hooks/use-update-consultation";
import { FormProvider, useForm } from "react-hook-form";
import DoctorSelect from "./select-doctor";
import { useWeekOptions } from "../hooks/use-week-options";
import { useConsultationSchedule } from "../hooks/use-consultation-schedule";
import type { TimeSlot } from "../hooks/use-consultation-schedule";
import WeeklyCalendar from "./weekly-calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DaySchedule {
    date: string;
    times: TimeSlot[];
}

export default function CreateDoctorSchedule() {
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
    const [selectedDoctor, setSelectedDoctor] = useState<API.Doctors | null>(null);
    const [loading, setLoading] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ start: "", end: "" });
    const [editingSlot, setEditingSlot] = useState<{
        dayIndex: number;
        slotIndex: number;
    } | null>(null);
    // Week options hook
    const {
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        selectedWeek,
        setSelectedWeek,
        selectedWeekData,
        apiParams,
    } = useWeekOptions();

    // Schedule data hook (fetch + map)
    const {
        scheduleData,
        setScheduleData,
        isLoading: isLoadingConsultations,
        hasConsultationData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useConsultationSchedule(selectedDoctorId, apiParams);
    const [changedTimeSlots, setChangedTimeSlots] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<number>(0);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [resetSignal, setResetSignal] = useState<number>(0);

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

    const { form, onSubmit } = useCreateConsultation({
        doctorId: selectedDoctorId,
    });

    const { form: updateForm, onSubmit: UpdateSubmit } = useUpdateConsultation({
        doctorId: selectedDoctorId,
    });

    const handleDoctorChange = (doctor: API.Doctors | null) => {
        setSelectedDoctor(doctor);
        setSelectedDoctorId(doctor?.id || "");
    };

    const getPositionName = (position?: number) => {
        switch (position) {
            case 0:
                return "Giám đốc";
            case 1:
                return "Phó giám đốc";
            case 2:
                return "Trưởng khoa";
            case 3:
                return "Phó trưởng khoa";
            case 4:
                return "Bác sĩ";
            default:
                return "Không xác định vị trí";
        }
    };

    const handleFormSubmit = async (formData: any) => {
        if (!onSubmit) return;
        try {
            await onSubmit(formData, () => {});
        } catch (error) {
            console.error("Error creating consultation:", error);
        }
    };

    // const formatTimeToHMS = (time: string): string => {
    //     if (time.includes(":") && time.split(":").length === 2) {
    //         return `${time}:00`;
    //     }
    //     return time;
    // };

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
            setResetSignal((prev) => prev + 1);
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

            // Group consultations by date
            const groupedByDate = importedData.reduce(
                (acc: Record<string, any[]>, consultation) => {
                    const date = consultation.date;
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push({
                        start: consultation.startTime,
                        end: consultation.endTime,
                    });
                    return acc;
                },
                {}
            );

            // Transform to the expected API format
            const transformedData: REQUEST.TCreateConsultation = {
                timeTemplates: Object.entries(groupedByDate).map(
                    ([date, times]) => ({
                        date: date,
                        times: times,
                    })
                ),
            };

            console.log("Transformed data for API:", transformedData);

            // Validate the transformed data structure
            if (
                !transformedData.timeTemplates ||
                transformedData.timeTemplates.length === 0
            ) {
                throw new Error("Không có dữ liệu hợp lệ để import");
            }

            // Log each template for debugging
            transformedData.timeTemplates.forEach((template, index) => {
                console.log(`Template ${index + 1}:`, {
                    date: template.date,
                    timesCount: template.times.length,
                    times: template.times,
                });

                // Verify time format for each time slot
                template.times.forEach((timeSlot, timeIndex) => {
                    console.log(`  Time slot ${timeIndex + 1}:`, {
                        start: timeSlot.start,
                        end: timeSlot.end,
                        startFormat:
                            typeof timeSlot.start === "string"
                                ? timeSlot.start.split(":").length
                                : "N/A",
                        endFormat:
                            typeof timeSlot.end === "string"
                                ? timeSlot.end.split(":").length
                                : "N/A",
                    });
                });
            });

            await handleFormSubmit(transformedData);
        } catch (error) {
            console.error("Error importing consultations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleWeekChange = (newWeek: string) => {
        setSelectedWeek(newWeek);
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
                                    onDoctorChange={handleDoctorChange}
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
                    <div className="flex min-h-[100px] gap-4 mt-4">
      <div className="flex-1">
        {selectedDoctor && (
          <Card className="p-4 rounded-2xl border border-blue-200 shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center gap-5">
                <Avatar className="size-16">
                  <AvatarImage src={selectedDoctor.avatar || "/images/default_img.jpg"} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                    {selectedDoctor.name?.split(" ").slice(-2).map((w) => w[0]).join("") || "BS"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="text-[1.1rem] font-semibold text-emerald-900">{selectedDoctor.name}</div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">
                      <BadgeCheckIcon className="w-4 h-4" />
                      {getPositionName(selectedDoctor.position)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    <span>{selectedDoctor.hospital?.name}</span>
                  </div>
                  <div className="text-sm text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-700" />
                    <span>{selectedDoctor.phoneNumber || "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Info Display */}
      <div className="flex-1">
        {selectedYear && selectedMonth && selectedWeek && selectedWeekData && (
          <div className="p-4 bg-blue-100 border border-blue-300 rounded-xl h-full flex justify-center items-center">
            <div className="flex items-center space-x-2 text-blue-800">
              <Clock className="h-5 w-5" />
              <span className="font-medium">
                Đã chọn: {selectedWeekData.label} - Năm {selectedYear}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>

                 

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
                                                isLoadingConsultations ||
                                                (changedTimeSlots.length ===
                                                    0 &&
                                                    deletedIds.length === 0)
                                            }
                                            size="sm"
                                            className="bg-[#248FCA] hover:bg-[#248FCA]/90 !px-5 !py-5"
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
                                </div>
                            </div>
                        </div>

                        {/* Weekly Schedule View - FullCalendar */}
                        <WeeklyCalendar
                            selectedWeekData={selectedWeekData}
                            scheduleData={scheduleData}
                            setScheduleData={setScheduleData}
                            isLoading={isLoadingConsultations}
                            onChangedSlotsUpdate={handleChangedSlotsUpdate}
                            onDeletedIdsUpdate={handleDeletedIdsUpdate}
                            onStatusChange={handleStatusChange}
                            resetSignal={resetSignal}
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

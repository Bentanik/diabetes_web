"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChartIcon, BellIcon, Clock, Edit, User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import ProfileHospitalMenu from "@/components/profile_hospital_menu";
import { Toaster, toast } from "sonner";
import useCreateConsultation from "../hooks/use-create-consultation";
import DoctorSelectFilter from "@/components/select_doctor";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CreateConsultationDialog from "./create-consultation-dialog";
import { useGetConsultations } from "../hooks/use-get-consultation";
import ExcelImportDialog from "./excel-import-dialog";

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

const Header = () => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Quản lý khung giờ tư vấn
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="gap-2 bg-transparent">
                        <BarChartIcon className="w-4 h-4" />
                        Xuất báo cáo
                    </Button>
                    <Button variant="ghost" size="icon">
                        <BellIcon className="w-5 h-5" />
                    </Button>
                    <div>
                        <ProfileHospitalMenu profile={1} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function CreateDoctorSchedule() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ start: "", end: "" });

    const pageSize = 6;

    const { form, onSubmit } = useCreateConsultation({
        doctorId: selectedDoctorId,
    });

    const handleFormSubmit = async (formData: REQUEST.TCreateConsultation) => {
        if (!onSubmit || typeof onSubmit !== "function") {
            console.error("onSubmit is not a function");
            return;
        }
        try {
            onSubmit(formData, () => {
                form.reset();
            });
        } catch (error) {
            console.error("Error creating consultation:", error);
            alert("Có lỗi xảy ra khi tạo cuộc tư vấn.");
        }
    };

    // Handle Excel import
    const handleExcelImport = async (importedData: any[]) => {
        try {
            setLoading(true);

            // Process each imported consultation
            for (const consultation of importedData) {
                await handleFormSubmit(consultation);
            }

            toast.success(
                `Đã import thành công ${importedData.length} khung giờ tư vấn`
            );
        } catch (error) {
            console.error("Error importing consultations:", error);
            toast.error("Có lỗi xảy ra khi import dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    console.log("DoctorId nè m" + selectedDoctorId);

    const { consultations, isPending } = useGetConsultations({
        doctorId: selectedDoctorId,
    });

    const calculateDuration = (start: string, end: string) => {
        const [startHours, startMinutes] = start.split(":").map(Number);
        const [endHours, endMinutes] = end.split(":").map(Number);
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        let duration = endTotalMinutes - startTotalMinutes;
        if (duration < 0) duration += 24 * 60; // Handle overnight sessions
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        if (hours === 0) return `${minutes} phút`;
        if (minutes === 0) return `${hours} giờ`;
        return `${hours} giờ ${minutes} phút`;
    };

    return (
        <div>
            <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
            {/* Header */}
            <header>
                <Header />
            </header>

            {/* Doctor Selection */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6"
            >
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <User className="h-5 w-5 text-[#248FCA]" />
                            <h2 className="text-xl font-semibold text-[#248FCA]">
                                Chọn bác sĩ
                            </h2>
                        </div>
                        <Select
                            value={selectedDoctorId}
                            onValueChange={setSelectedDoctorId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn bác sĩ" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockDoctors.items.map((doctor) => (
                                    <SelectItem
                                        key={doctor.id}
                                        value={doctor.id}
                                    >
                                        {doctor.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-3">
                        {selectedDoctorId && (
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Clock className="h-5 w-5 text-[#248FCA]" />
                                            <h2 className="text-xl font-semibold text-[#248FCA]">
                                                Khung giờ tư vấn
                                            </h2>
                                        </div>
                                        <p className="text-gray-600">
                                            Quản lý khung giờ tư vấn cho{" "}
                                            {mockDoctors.items.find(
                                                (d) => d.id === selectedDoctorId
                                            )?.name ||
                                                `Bác sĩ ID: ${selectedDoctorId}`}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <CreateConsultationDialog
                                            onSubmit={handleFormSubmit}
                                        />
                                        <ExcelImportDialog
                                            onImportSuccess={handleExcelImport}
                                            doctorId={selectedDoctorId}
                                        />
                                    </div>
                                </div>

                                {consultations?.items.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium mb-2">
                                            Chưa có khung giờ tư vấn
                                        </p>
                                        <p className="text-sm">
                                            Thêm khung giờ đầu tiên để bắt đầu
                                            hoặc import từ Excel
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-gray-200">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold">
                                                        Thời gian bắt đầu
                                                    </TableHead>
                                                    <TableHead className="font-semibold">
                                                        Thời gian kết thúc
                                                    </TableHead>
                                                    <TableHead className="font-semibold">
                                                        Thời lượng
                                                    </TableHead>
                                                    <TableHead className="text-right font-semibold">
                                                        Thao tác
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {consultations?.items.map(
                                                    (template, index) => (
                                                        <TableRow
                                                            key={index}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <TableCell className="font-medium">
                                                                {
                                                                    template.startTime
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    template.endTime
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-[#248FCA]/10 text-[#248FCA]"
                                                                >
                                                                    {calculateDuration(
                                                                        template.startTime,
                                                                        template.endTime
                                                                    )}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end space-x-2">
                                                                    <Dialog
                                                                        open={
                                                                            isEditDialogOpen
                                                                        }
                                                                        onOpenChange={
                                                                            setIsEditDialogOpen
                                                                        }
                                                                    >
                                                                        <DialogTrigger
                                                                            asChild
                                                                        >
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="hover:bg-[#248FCA]/10 bg-transparent"
                                                                            >
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent></DialogContent>
                                                                    </Dialog>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Select Doctor */}
                {/* <DoctorSelectFilter
                    onDoctorChange={setSelectedDoctorId}
                    selectDoctor=""
                /> */}
            </motion.div>

            {/* Templates Management */}
        </div>
    );
}

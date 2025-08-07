"use client";

import type React from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import {
    Upload,
    FileSpreadsheet,
    AlertCircle,
    CheckCircle,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExcelImportDialogProps {
    onImportSuccess: (data: any[]) => void;
    doctorId: string;
}

const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({
    onImportSuccess,
    doctorId,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Validate file type
    const validateFile = (file: File) => {
        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel", // .xls
            "text/csv", // .csv
        ];

        const allowedExtensions = [".xlsx", ".xls", ".csv"];
        const fileExtension = file.name
            .toLowerCase()
            .substring(file.name.lastIndexOf("."));

        return (
            allowedTypes.includes(file.type) ||
            allowedExtensions.includes(fileExtension)
        );
    };

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        setError("");
        setSuccess("");
        setData([]);

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (!validateFile(selectedFile)) {
            setError("Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV");
            setFile(null);
            return;
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (selectedFile.size > maxSize) {
            setError("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB");
            setFile(null);
            return;
        }

        setFile(selectedFile);
    };

    // Process Excel file
    const processExcelFile = async () => {
        if (!file) return;

        setLoading(true);
        setError("");

        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "buffer" });

            // Get first worksheet
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
                throw new Error("File Excel trống hoặc không có dữ liệu");
            }

            // Validate and transform data
            const processedData = validateAndTransformData(jsonData);
            setData(processedData);
            setSuccess(`Đã xử lý thành công ${processedData.length} khung giờ`);
        } catch (err: any) {
            setError(`Lỗi xử lý file: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Validate and transform data
    const validateAndTransformData = (rawData: any[]) => {
        const validData: any[] = [];
        const errors: string[] = [];

        rawData.forEach((row, index) => {
            const rowNumber = index + 2; // Excel row number (accounting for header)

            // Map various possible column names (case insensitive)
            const startTime = findColumnValue(row, [
                "start time",
                "start_time",
                "starttime",
                "giờ bắt đầu",
                "gio bat dau",
            ]);
            const endTime = findColumnValue(row, [
                "end time",
                "end_time",
                "endtime",
                "giờ kết thúc",
                "gio ket thuc",
            ]);
            const date = findColumnValue(row, [
                "date",
                "ngày",
                "ngay",
                "datetime",
                "consultation date",
                "ngay tu van",
            ]);

            // Validate required fields
            if (!startTime || !endTime || !date) {
                errors.push(
                    `Dòng ${rowNumber}: Thiếu thông tin bắt buộc (start time, end time, date)`
                );
                return;
            }

            try {
                // Parse and validate date
                let parsedDate;
                if (typeof date === "number") {
                    // Excel date serial number
                    const dateInfo = XLSX.SSF.parse_date_code(date);
                    parsedDate = new Date(
                        dateInfo.y,
                        dateInfo.m - 1,
                        dateInfo.d
                    );
                } else if (typeof date === "string") {
                    // Try different date formats
                    parsedDate = parseDate(date);
                } else {
                    parsedDate = new Date(date);
                }

                if (isNaN(parsedDate.getTime())) {
                    errors.push(
                        `Dòng ${rowNumber}: Định dạng ngày không hợp lệ`
                    );
                    return;
                }

                // Parse time (assuming format HH:MM or decimal hours)
                const parsedStartTime = parseTime(startTime);
                const parsedEndTime = parseTime(endTime);

                if (!parsedStartTime || !parsedEndTime) {
                    errors.push(
                        `Dòng ${rowNumber}: Định dạng giờ không hợp lệ`
                    );
                    return;
                }

                // Validate time logic
                if (parsedStartTime >= parsedEndTime) {
                    errors.push(
                        `Dòng ${rowNumber}: Giờ bắt đầu phải nhỏ hơn giờ kết thúc`
                    );
                    return;
                }

                // Check if date is not in the past (optional validation)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (parsedDate < today) {
                    console.warn(
                        `Dòng ${rowNumber}: Ngày ${parsedDate.toLocaleDateString()} đã qua`
                    );
                }

                validData.push({
                    startTime: parsedStartTime,
                    endTime: parsedEndTime,
                    date: parsedDate.toISOString().split("T")[0], // YYYY-MM-DD format
                    dateDisplay: parsedDate.toLocaleDateString("vi-VN"), // DD/MM/YYYY for display
                    duration: calculateDuration(parsedStartTime, parsedEndTime),
                    originalRow: rowNumber,
                });
            } catch (err: any) {
                errors.push(`Dòng ${rowNumber}: ${err.message}`);
            }
        });

        if (errors.length > 0) {
            throw new Error(
                `Có ${errors.length} lỗi trong dữ liệu:\n${errors
                    .slice(0, 5)
                    .join("\n")}${errors.length > 5 ? "\n..." : ""}`
            );
        }

        return validData;
    };

    // Parse date from various formats
    const parseDate = (dateValue: string) => {
        // Try different date formats
        const formats = [
            // DD/MM/YYYY
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
            // MM/DD/YYYY
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
            // YYYY-MM-DD
            /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
            // DD-MM-YYYY
            /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
        ];

        // Try DD/MM/YYYY format first (Vietnamese format)
        const ddmmyyyy = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (ddmmyyyy) {
            const day = parseInt(ddmmyyyy[1]);
            const month = parseInt(ddmmyyyy[2]);
            const year = parseInt(ddmmyyyy[3]);
            return new Date(year, month - 1, day);
        }

        // Try YYYY-MM-DD format
        const yyyymmdd = dateValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (yyyymmdd) {
            const year = parseInt(yyyymmdd[1]);
            const month = parseInt(yyyymmdd[2]);
            const day = parseInt(yyyymmdd[3]);
            return new Date(year, month - 1, day);
        }

        // Try DD-MM-YYYY format
        const ddmmyyyy2 = dateValue.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
        if (ddmmyyyy2) {
            const day = parseInt(ddmmyyyy2[1]);
            const month = parseInt(ddmmyyyy2[2]);
            const year = parseInt(ddmmyyyy2[3]);
            return new Date(year, month - 1, day);
        }

        // Fallback to native Date parsing
        return new Date(dateValue);
    };

    // Helper function to find column value with different possible names
    const findColumnValue = (row: any, possibleNames: string[]) => {
        for (const name of possibleNames) {
            for (const key in row) {
                if (key.toLowerCase().trim() === name.toLowerCase()) {
                    return row[key];
                }
            }
        }
        return null;
    };

    // Parse time from various formats
    const parseTime = (timeValue: any) => {
        if (typeof timeValue === "number") {
            // Excel time as decimal (0.5 = 12:00)
            const hours = Math.floor(timeValue * 24);
            const minutes = Math.floor((timeValue * 24 * 60) % 60);
            return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`;
        }

        if (typeof timeValue === "string") {
            // Try to parse HH:MM format
            const timeMatch = timeValue.match(/(\d{1,2}):(\d{2})/);
            if (timeMatch) {
                const hours = Number.parseInt(timeMatch[1]);
                const minutes = Number.parseInt(timeMatch[2]);
                if (
                    hours >= 0 &&
                    hours <= 23 &&
                    minutes >= 0 &&
                    minutes <= 59
                ) {
                    return `${hours.toString().padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}`;
                }
            }
        }

        return null;
    };

    // Calculate duration in minutes
    const calculateDuration = (startTime: string, endTime: string) => {
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return endMinutes - startMinutes;
    };

    // Import data to system
    const handleImport = async () => {
        if (data.length === 0) return;

        try {
            setLoading(true);

            // Transform data to match the expected format
            const consultationData = data.map((item) => ({
                doctorId: doctorId,
                startTime: item.startTime,
                endTime: item.endTime,
                date: item.date, // Include date in the consultation data
                consultationDate: item.date, // Alternative field name if needed
            }));

            // Call the parent component's import handler
            await onImportSuccess(consultationData);

            setSuccess(`Đã import thành công ${data.length} khung giờ tư vấn`);

            // Reset form after successful import
            setTimeout(() => {
                setIsOpen(false);
                resetForm();
            }, 2000);
        } catch (err: any) {
            setError(`Lỗi import dữ liệu: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setData([]);
        setError("");
        setSuccess("");
        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const clearFile = () => {
        setFile(null);
        setData([]);
        setError("");
        setSuccess("");
        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#248FCA] hover:bg-[#248FCA]/90">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Import khung giờ tư vấn từ Excel</DialogTitle>
                    <DialogDescription>
                        Tải lên file Excel chứa thông tin khung giờ tư vấn (bao
                        gồm ngày, giờ bắt đầu, giờ kết thúc) để import vào hệ
                        thống
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* File Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn file Excel (.xlsx, .xls)
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="excel-upload"
                                />
                                <label
                                    htmlFor="excel-upload"
                                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Chọn File
                                </label>
                            </div>

                            {file && (
                                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-600">
                                        {file.name}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFile}
                                        className="text-red-500 hover:text-red-700 h-auto p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Process Button */}
                    {file && !data.length && (
                        <Button
                            onClick={processExcelFile}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            {loading ? "Đang xử lý..." : "Xử lý File Excel"}
                        </Button>
                    )}

                    {/* Data Preview */}
                    {data.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">
                                Dữ liệu sẽ được import ({data.length} khung giờ)
                            </h3>
                            <div className="border rounded-lg overflow-hidden">
                                <div className="max-h-64 overflow-y-auto">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-gray-50">
                                            <TableRow>
                                                <TableHead>STT</TableHead>
                                                <TableHead>
                                                    Ngày tư vấn
                                                </TableHead>
                                                <TableHead>
                                                    Giờ bắt đầu
                                                </TableHead>
                                                <TableHead>
                                                    Giờ kết thúc
                                                </TableHead>
                                                <TableHead>
                                                    Thời lượng
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data
                                                .slice(0, 10)
                                                .map((item, index) => (
                                                    <TableRow
                                                        key={index}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <TableCell>
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-blue-50 text-blue-700 border-blue-200"
                                                            >
                                                                {
                                                                    item.dateDisplay
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.startTime}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.endTime}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-[#248FCA]/10 text-[#248FCA]"
                                                            >
                                                                {Math.floor(
                                                                    item.duration /
                                                                        60
                                                                )}
                                                                h{" "}
                                                                {item.duration %
                                                                    60}
                                                                m
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                {data.length > 10 && (
                                    <div className="p-2 text-center text-sm text-gray-500 bg-gray-50 border-t">
                                        ... và {data.length - 10} khung giờ khác
                                    </div>
                                )}
                            </div>

                            {/* Import Button */}
                            <div className="flex justify-end mt-4">
                                <Button
                                    onClick={handleImport}
                                    disabled={loading}
                                    className="bg-[#248FCA] hover:bg-[#248FCA]/90"
                                >
                                    {loading
                                        ? "Đang import..."
                                        : `Import ${data.length} khung giờ`}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Format Guide */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">
                            Hướng dẫn định dạng file Excel:
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>
                                • <strong>Cột Date/Ngày:</strong> Ngày tư vấn
                                (định dạng: DD/MM/YYYY hoặc YYYY-MM-DD)
                            </li>
                            <li>
                                • <strong>Cột Start Time:</strong> Giờ bắt đầu
                                (định dạng: HH:MM)
                            </li>
                            <li>
                                • <strong>Cột End Time:</strong> Giờ kết thúc
                                (định dạng: HH:MM)
                            </li>
                            <li>
                                • Tên cột có thể là tiếng Việt hoặc tiếng Anh
                            </li>
                            <li>• File không được quá 10MB</li>
                            <li>
                                • Hỗ trợ nhiều định dạng ngày: DD/MM/YYYY,
                                YYYY-MM-DD, DD-MM-YYYY
                            </li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ExcelImportDialog;

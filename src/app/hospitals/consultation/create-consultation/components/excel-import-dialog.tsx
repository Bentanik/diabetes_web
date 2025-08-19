"use client";

import React, { useState, useCallback } from "react";
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
import {
    validateFileType,
    validateAndTransformData,
} from "@/utils/excel-validate";

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

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files?.[0];
            setError("");
            setSuccess("");
            setData([]);

            if (!selectedFile) {
                setFile(null);
                return;
            }
            if (!validateFileType(selectedFile)) {
                setError("Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV");
                setFile(null);
                return;
            }
            const maxSize = 10 * 1024 * 1024;
            if (selectedFile.size > maxSize) {
                setError("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB");
                setFile(null);
                return;
            }
            setFile(selectedFile);
        },
        []
    );

    const processExcelFile = useCallback(async () => {
        if (!file) return;
        setLoading(true);
        setError("");
        setSuccess("");

        const start = performance.now(); // 🔸 Bắt đầu đo thời gian

        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "buffer" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
                throw new Error("File Excel trống hoặc không có dữ liệu");
            }

            const processedData = validateAndTransformData(jsonData);
            setData(processedData);

            const invalidRows = processedData.filter(
                (item) => !item.valid || item.validationErrors.length > 0
            );

            if (invalidRows.length > 0) {
                setError(
                    `Có ${invalidRows.length} khung giờ không hợp lệ. Vui lòng kiểm tra dữ liệu.`
                );
                setSuccess(
                    `Đã xử lý ${processedData.length} khung giờ, trong đó ${invalidRows.length} khung giờ không hợp lệ.`
                );
            } else {
                setSuccess(
                    `Đã xử lý thành công ${processedData.length} khung giờ`
                );
            }

            const end = performance.now(); // Kết thúc đo thời gian
        } catch (err: any) {
            setError(`Lỗi xử lý file: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [file]);

    const handleImport = useCallback(async () => {
        if (data.length === 0) return;
        setLoading(true);
        try {
            const consultationData = data
                .filter(
                    (item) => item.valid && item.validationErrors.length === 0
                )
                .map((item) => ({
                    doctorId: doctorId,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    date: item.date,
                }));

            console.log("Sending consultation data:", consultationData);
            await onImportSuccess(consultationData);
            setTimeout(() => {
                setIsOpen(false);
                resetForm();
            }, 2000);
        } catch (err: any) {
            setError(`Lỗi import dữ liệu: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [data, doctorId, onImportSuccess]);

    const resetForm = useCallback(() => {
        setFile(null);
        setData([]);
        setError("");
        setSuccess("");
        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    }, []);

    const clearFile = useCallback(() => {
        setFile(null);
        setData([]);
        setError("");
        setSuccess("");
        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={!doctorId}
                    className="bg-[#248FCA] hover:bg-[#248FCA]/90 cursor-pointer w-[200px] h-10"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-[40vw] overflow-y-auto max-h-[80vh] ">
                <DialogHeader>
                    <DialogTitle>Import khung giờ tư vấn từ Excel</DialogTitle>
                    <DialogDescription>
                        Tải lên file Excel chứa thông tin khung giờ tư vấn
                        (ngày, giờ bắt đầu, giờ kết thúc) để import.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

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
                                        size="sm"
                                        onClick={clearFile}
                                        className="text-red-500 hover:text-red-700 h-auto p-1 bg-red-100 hover:bg-red-200 cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {file && !data.length && (
                        <Button
                            onClick={processExcelFile}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 cursor-pointer"
                        >
                            {loading ? "Đang xử lý..." : "Xử lý File Excel"}
                        </Button>
                    )}

                    {data.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">
                                Dữ liệu sẽ được import ({data.length} khung giờ)
                            </h3>
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    <strong>Lưu ý:</strong> Dữ liệu sẽ được nhóm
                                    theo ngày và gửi với format:
                                    <code className="block mt-1 p-2 bg-white rounded text-xs">
                                        {`{timeTemplates: [{date: "YYYY-MM-DD", times: [{start: "HH:MM:SS", end: "HH:MM:SS"}]}]}`}
                                    </code>
                                </p>
                            </div>
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
                                                <TableHead>
                                                    Trạng thái
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    className={`hover:bg-gray-50 ${
                                                        !item.valid ||
                                                        item.validationErrors
                                                            .length > 0
                                                            ? "bg-red-100"
                                                            : ""
                                                    }`}
                                                >
                                                    <TableCell>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-blue-50 text-blue-700 border-blue-200"
                                                        >
                                                            {item.dateDisplay ||
                                                                "N/A"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.startTime ||
                                                            "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.endTime || "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-[#248FCA]/10 text-[#248FCA]"
                                                        >
                                                            {item.duration
                                                                ? `${Math.floor(
                                                                      item.duration /
                                                                          60
                                                                  )}h ${
                                                                      item.duration %
                                                                      60
                                                                  }m`
                                                                : "N/A"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.valid &&
                                                        item.validationErrors
                                                            .length === 0 ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-green-50 text-green-700 border-green-200"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Hợp lệ
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-red-50 text-red-700 border-red-200"
                                                                title={
                                                                    item.validationErrors.join(
                                                                        "\n"
                                                                    ) ||
                                                                    "Lỗi không xác định"
                                                                }
                                                            >
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                Không hợp lệ
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button
                                    onClick={handleImport}
                                    disabled={
                                        loading ||
                                        data.some(
                                            (item) =>
                                                !item.valid ||
                                                item.validationErrors.length > 0
                                        )
                                    }
                                    className="bg-[#248FCA] hover:bg-[#248FCA]/90 cursor-pointer"
                                >
                                    Tạo các khung giờ
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">
                            Hướng dẫn định dạng file Excel:
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>
                                • <strong>Cột Date/Ngày:</strong> Ngày tư vấn
                                (định dạng DD/MM/YYYY hoặc YYYY-MM-DD)
                            </li>
                            <li>
                                • <strong>Cột Start Time:</strong> Giờ bắt đầu
                                (định dạng HH:MM hoặc HH:MM:SS)
                            </li>
                            <li>
                                • <strong>Cột End Time:</strong> Giờ kết thúc
                                (định dạng HH:MM hoặc HH:MM:SS)
                            </li>
                            <li>
                                • Giờ kết thúc phải lớn hơn giờ bắt đầu và tối
                                thiểu là 15 phút
                            </li>
                            <li>
                                • Các khoảng thời gian tư vấn trong ngày không
                                được trùng nhau
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

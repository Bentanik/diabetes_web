import * as XLSX from "xlsx";

// Hàm kiểm tra loại file được phép (.xlsx, .xls, .csv)
export const validateFileType = (file: File) => {
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

// Hàm tìm giá trị trong dòng Excel theo tên cột
export const findColumnValue = (row: any, possibleNames: string[]) => {
    const normalizedRow: Record<string, any> = {};
    for (const key in row) {
        normalizedRow[key.trim().toLowerCase()] = row[key];
    }
    for (const name of possibleNames) {
        const key = name.toLowerCase().trim();
        if (normalizedRow[key] != null) {
            return normalizedRow[key];
        }
    }
    return null;
};

// Hàm parse ngày từ nhiều định dạng
export const parseDate = (dateValue: string) => {
    const ddmmyyyy = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
        const day = parseInt(ddmmyyyy[1]);
        const month = parseInt(ddmmyyyy[2]);
        const year = parseInt(ddmmyyyy[3]);
        return new Date(year, month - 1, day);
    }
    const yyyymmdd = dateValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (yyyymmdd) {
        const year = parseInt(yyyymmdd[1]);
        const month = parseInt(yyyymmdd[2]);
        const day = parseInt(yyyymmdd[3]);
        return new Date(year, month - 1, day);
    }
    const ddmmyyyy2 = dateValue.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (ddmmyyyy2) {
        const day = parseInt(ddmmyyyy2[1]);
        const month = parseInt(ddmmyyyy2[2]);
        const year = parseInt(ddmmyyyy2[3]);
        return new Date(year, month - 1, day);
    }
    return new Date(dateValue);
};

// Hàm parse thời gian thành chuỗi "HH:MM" trong định dạng 24h
export const parseTime = (timeValue: any) => {
    if (typeof timeValue === "number") {
        // Chuyển đổi số thập phân Excel (phân số ngày) thành giờ
        const totalMinutes = Math.floor(timeValue * 24 * 60); // Tổng phút trong ngày
        const hours = Math.floor(totalMinutes / 60) % 24; // Giờ
        const minutes = totalMinutes % 60; // Phút
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
    }
    if (typeof timeValue === "string") {
        const timeMatch = timeValue.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
        if (timeMatch) {
            const hours = Number.parseInt(timeMatch[1], 10);
            const minutes = Number.parseInt(timeMatch[2], 10);
            if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                return `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}`;
            }
        }
        // Nếu không parse được, giữ nguyên giá trị thô (ví dụ: "1:45")
        return timeValue;
    }
    return timeValue ? timeValue.toString() : "";
};

// Hàm tính độ dài thời gian giữa startTime và endTime
export const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    if (endMinutes < startMinutes) {
        endMinutes += 24 * 60; // Thêm 24 giờ nếu vượt qua nửa đêm
    }
    return endMinutes - startMinutes;
};

// Hàm validate và chuyển đổi dữ liệu từ Excel
export const validateAndTransformData = (rawData: any[]) => {
    const validData: any[] = [];
    const slotsByDate: Record<string, any[]> = {};

    rawData.forEach((row, index) => {
        const rowNumber = index + 2;
        const validationErrors: string[] = [];

        const startTime =
            findColumnValue(row, [
                "start time",
                "start_time",
                "starttime",
                "giờ bắt đầu",
                "gio bat dau",
            ]) || "";
        const endTime =
            findColumnValue(row, [
                "end time",
                "end_time",
                "endtime",
                "giờ kết thúc",
                "gio ket thuc",
            ]) || "";
        const dateValue =
            findColumnValue(row, [
                "date",
                "ngày",
                "ngay",
                "datetime",
                "consultation date",
                "ngay tu van",
            ]) || "";

        let dataItem: any = {
            startTime: startTime,
            endTime: endTime,
            date: dateValue,
            dateDisplay: dateValue,
            duration: 0,
            originalRow: rowNumber,
            valid: false,
            validationErrors,
        };

        try {
            let parsedDate;
            if (typeof dateValue === "number") {
                const dateInfo = XLSX.SSF.parse_date_code(dateValue);
                parsedDate = new Date(dateInfo.y, dateInfo.m - 1, dateInfo.d);
            } else if (typeof dateValue === "string") {
                parsedDate = parseDate(dateValue);
            } else {
                parsedDate = new Date(dateValue);
            }
            if (isNaN(parsedDate.getTime())) {
                validationErrors.push(`Định dạng ngày không hợp lệ`);
            } else {
                dataItem.date = parsedDate.toISOString().split("T")[0];
                dataItem.dateDisplay = parsedDate.toLocaleDateString("vi-VN");
            }

            const parsedStartTime = parseTime(startTime);
            const parsedEndTime = parseTime(endTime);
            dataItem.startTime = parsedStartTime || startTime;
            dataItem.endTime = parsedEndTime || endTime;

            if (parsedStartTime && parsedEndTime) {
                if (parsedStartTime >= parsedEndTime) {
                    validationErrors.push(
                        `Giờ bắt đầu phải nhỏ hơn giờ kết thúc`
                    );
                } else {
                    const duration = calculateDuration(
                        parsedStartTime,
                        parsedEndTime
                    );
                    dataItem.duration = duration;
                    if (duration < 15) {
                        validationErrors.push(
                            `Thời lượng phải tối thiểu 15 phút (hiện tại: ${duration} phút)`
                        );
                    }
                }
            } else {
                validationErrors.push(
                    `Định dạng giờ không hợp lệ (chỉ hỗ trợ 24h)`
                );
            }

            dataItem.valid = validationErrors.length === 0;

            if (!slotsByDate[dataItem.date]) {
                slotsByDate[dataItem.date] = [];
            }
            slotsByDate[dataItem.date].push(dataItem);

            validData.push(dataItem);
        } catch (err: any) {
            validationErrors.push(err.message);
            validData.push(dataItem);
        }
    });

    Object.keys(slotsByDate).forEach((date) => {
        const slots = slotsByDate[date];
        slots.sort((a, b) => {
            const aStart = parseTime(a.startTime).split(":").map(Number);
            const bStart = parseTime(b.startTime).split(":").map(Number);
            return aStart[0] * 60 + aStart[1] - (bStart[0] * 60 + bStart[1]);
        });

        for (let i = 0; i < slots.length; i++) {
            const slotA = slots[i];
            if (!slotA.valid) continue;
            for (let j = i + 1; j < slots.length; j++) {
                const slotB = slots[j];
                if (!slotB.valid) continue;
                const aStartMinutes = parseTime(slotA.startTime)
                    .split(":")
                    .map(Number);
                const aEndMinutes = parseTime(slotA.endTime)
                    .split(":")
                    .map(Number);
                const bStartMinutes = parseTime(slotB.startTime)
                    .split(":")
                    .map(Number);
                const bEndMinutes = parseTime(slotB.endTime)
                    .split(":")
                    .map(Number);
                const aStartTotal = aStartMinutes[0] * 60 + aStartMinutes[1];
                const aEndTotal = aEndMinutes[0] * 60 + aEndMinutes[1];
                const bStartTotal = bStartMinutes[0] * 60 + bStartMinutes[1];
                const bEndTotal = bEndMinutes[0] * 60 + bEndMinutes[1];
                if (bStartTotal >= aEndTotal) {
                    break;
                }
                if (bStartTotal < aEndTotal && aStartTotal < bEndTotal) {
                    slotA.valid = false;
                    slotB.valid = false;
                    slotA.validationErrors.push(
                        `Trùng thời gian với dòng ${slotB.originalRow}`
                    );
                    slotB.validationErrors.push(
                        `Trùng thời gian với dòng ${slotA.originalRow}`
                    );
                }
            }
        }
    });

    return validData;
};

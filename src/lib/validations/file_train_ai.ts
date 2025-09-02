export interface FileValidationResult {
  valid: boolean;
  blockingErrors: string[];
  warningErrors: string[];
}

export const fileForTrainAI = {
  maxSizeMB: 10,
  allowedTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],
  invalidNameChars: [
    "/",
    "\\",
    "*",
    "?",
    "&",
    "%",
    "#",
    ":",
    "|",
    '"',
    "<",
    ">",
  ],

  validate(file: File): FileValidationResult {
    const blockingErrors: string[] = [];
    const warningErrors: string[] = [];

    // 1. Kiểm tra loại file (MIME type)
    if (!this.allowedTypes.includes(file.type)) {
      blockingErrors.push(
        "Định dạng tài liệu bắt buộc phải là PDF, DOCX hoặc TXT."
      );
    }

    // 2. Kiểm tra kích thước (warning nếu vượt quá, không chặn)
    if (file.size > this.maxSizeMB * 1024 * 1024) {
      warningErrors.push(
        `Dung lượng file vượt quá ${this.maxSizeMB}MB. Vui lòng chọn file nhỏ hơn.`
      );
    }

    // 3. Kiểm tra tên file chứa ký tự không hợp lệ
    for (const ch of this.invalidNameChars) {
      if (file.name.includes(ch)) {
        warningErrors.push(
          `Tên file chứa ký tự không hợp lệ: ${this.invalidNameChars
            .filter((ch) => file.name.includes(ch))
            .join(", ")}.`
        );
        break; // Chỉ cần báo một lần
      }
    }

    // 4. Kiểm tra phần mở rộng (extension) phù hợp với MIME type (phòng trường hợp bị đổi .exe thành .txt)
    const fileName = file.name.toLowerCase();
    if (file.type === "text/plain" && !fileName.endsWith(".txt")) {
      blockingErrors.push("File văn bản phải có phần mở rộng .txt.");
    } else if (file.type === "application/pdf" && !fileName.endsWith(".pdf")) {
      blockingErrors.push("File PDF phải có phần mở rộng .pdf.");
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      !fileName.endsWith(".docx")
    ) {
      blockingErrors.push("File Word phải có phần mở rộng .docx.");
    }

    return {
      valid: blockingErrors.length === 0, // Chỉ valid khi không có blocking error
      blockingErrors,
      warningErrors,
    };
  },
};

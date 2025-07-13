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

    if (!this.allowedTypes.includes(file.type)) {
      blockingErrors.push("Định dạng tài liệu bắt buộc PDF hoặc DOCX.");
    }

    if (file.size > this.maxSizeMB * 1024 * 1024) {
      warningErrors.push(`Dung lượng file vượt quá ${this.maxSizeMB}MB.`);
    }

    for (const ch of this.invalidNameChars) {
      if (file.name.includes(ch)) {
        warningErrors.push(
          `Tên file chứa ký tự không hợp lệ: ${this.invalidNameChars.join(" ")}`
        );
        break;
      }
    }

    return {
      valid: blockingErrors.length === 0 && warningErrors.length === 0,
      blockingErrors,
      warningErrors,
    };
  },
};

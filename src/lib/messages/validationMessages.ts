export const validationMessages = {
  email: {
    required: "Email không được để trống",
    invalid: "Email không hợp lệ",
  },
  fullName: {
    required: "Tên không được để trống",
    minLength: "Tên phải có ít nhất 4 ký tự",
    maxLength: "Tên không được vượt quá 100 ký tự",
  },
  otp: {
    required: "Mã OTP không được để trống",
    length: "Mã OTP phải có đúng 6 ký tự",
    invalid: "Mã OTP chỉ được chứa số",
  },
  password: {
    required: "Mật khẩu không được để trống",
    min_length: "Mật khẩu phải có ít nhất 6 ký tự",
    max_length: "Mật khẩu phải có tối đa 50 ký tự",
  },
  confirm_password: {
    required: "Xác nhận mật khẩu không được để trống",
    min_length: "Xác nhận mật khẩu phải có ít nhất 6 ký tự",
    max_length: "Xác nhận mật khẩu phải có tối đa 50 ký tự",
    not_match: "Mật khẩu xác nhận không khớp",
  },
};

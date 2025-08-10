import { validationMessages } from "@/lib/messages/validationMessages";
import z from "zod";

export const sendRegisterEmailSchema = z.object({
    email: z
        .string()
        .nonempty({ message: validationMessages.email.required })
        .email({ message: validationMessages.email.invalid }),

    fullName: z
        .string()
        .nonempty({ message: validationMessages.fullName.required })
        .min(4, { message: validationMessages.fullName.minLength })
        .max(100, { message: validationMessages.fullName.maxLength }),
});

export type SendRegisterEmailFormData = z.infer<typeof sendRegisterEmailSchema>;

export const verifyRegisterEmailSchema = z.object({
    otp: z
        .string()
        .nonempty({ message: validationMessages.otp.required })
        .length(6, validationMessages.otp.length)
        .regex(/^\d+$/, validationMessages.otp.invalid),
});

export type VerifyRegisterEmailFormData = z.infer<
    typeof verifyRegisterEmailSchema
>;

export const registerEmailSchema = z
    .object({
        password: z
            .string()
            .nonempty({ message: validationMessages.password.required })
            .min(6, validationMessages.password.min_length)
            .max(50, validationMessages.password.max_length),
        confirm_password: z
            .string()
            .nonempty({ message: validationMessages.confirm_password.required })
            .min(6, validationMessages.confirm_password.min_length)
            .max(50, validationMessages.confirm_password.max_length),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: validationMessages.confirm_password.not_match,
        path: ["confirm_password"],
    });

export type RegisterEmailFormData = z.infer<typeof registerEmailSchema>;

export const loginSchema = z.object({
    email: z
        .string()
        .nonempty({ message: validationMessages.email.required })
        .email({ message: validationMessages.email.invalid }),
    password: z
        .string()
        .nonempty({ message: validationMessages.password.required })
        .min(6, validationMessages.password.min_length)
        .max(50, validationMessages.password.max_length),
});

export type LoginSchemaFormData = z.infer<typeof loginSchema>;

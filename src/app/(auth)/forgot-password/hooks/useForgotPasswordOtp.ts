'use client'

import { useBackdrop } from "@/context/backdrop_context";
import {
    verifyForgotPasswordSchema,
    VerifyForgotPasswordFormData,
} from "@/lib/validations/auth.schema";
import { useServiceVerifyForgotPassword } from "@/services/auth/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseForgotPasswordOtpProps {
    email: string;
}

export default function useForgotPasswordOtp({ email }: UseForgotPasswordOtpProps) {
    const [otpValue, setOtpValue] = useState<string>("");
    const router = useRouter();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        reset,
    } = useForm<VerifyForgotPasswordFormData>({
        resolver: zodResolver(verifyForgotPasswordSchema),
        defaultValues: {
            otp: "",
            password: "",
            confirm_password: "",
        },
    });

    const { mutate: verifyForgotPassword } = useServiceVerifyForgotPassword();
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const handleOtpChange = (value: string) => {
        setOtpValue(value);
        setValue("otp", value);
    };

    const onSubmit = async (data: VerifyForgotPasswordFormData) => {
        try {
            const request: REQUEST.TVerifyForgotPassword = {
                email: email,
                otp: data.otp,
                password: data.password,
            };

            showBackdrop();
            verifyForgotPassword(request, {
                onSuccess: async (data) => {
                    if (data) {
                        hideBackdrop();
                        reset();
                        setOtpValue("");
                        // Redirect to login page after successful password reset
                        router.push("/login");
                    }
                },
                onError: (error) => {
                    hideBackdrop();
                    error.errors?.forEach((error) => {
                        if (error.code === "auth_error_11") {
                            setError("otp", {
                                type: "manual",
                                message: error.message,
                            });
                        }
                        if (error.code === "auth_error_13") {
                            setError("password", {
                                type: "manual",
                                message: error.message,
                            });
                        }
                    });
                },
            });
        } catch (err) {
            console.log("err: ", err);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        onSubmit,
        setValue,
        setError,
        otpValue,
        handleOtpChange,
    };
}

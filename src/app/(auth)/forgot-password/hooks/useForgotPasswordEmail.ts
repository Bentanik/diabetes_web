'use client'

import { useBackdrop } from "@/context/backdrop_context";
import {
    forgotPasswordEmailSchema,
    ForgotPasswordEmailSchemaFormData,
} from "@/lib/validations/auth.schema";
import { useServiceForgotPasswordEmail } from "@/services/auth/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function useForgotPasswordEmail() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [email, setEmail] = useState("");
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
    } = useForm<ForgotPasswordEmailSchemaFormData>({
        resolver: zodResolver(forgotPasswordEmailSchema),
        defaultValues: {
            email: "",
        },
    });

    const { mutate: forgotPasswordEmail } = useServiceForgotPasswordEmail();
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const onSubmit = async (data: ForgotPasswordEmailSchemaFormData) => {
        try {
            showBackdrop();
            const request: REQUEST.TForgotPasswordEmail = {
                email: data?.email,
            };

            forgotPasswordEmail(request, {
                onSuccess: () => {
                    setEmail(data.email);
                    setIsSuccess(true);
                },
                onError: (error) => {
                    error.errors?.forEach((error) => {
                        if (error.code === "auth_error_17") {
                            setError("email", {
                                type: "manual",
                                message: error.message,
                            });
                        }
                    });
                },
                onSettled: () => {
                    hideBackdrop();
                },
            });
        } catch (error) {
            console.log("error: ", error);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        onSubmit,
        setValue,
        setError,
        isSuccess,
        email,
    };
}

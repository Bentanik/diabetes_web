"use client";

import React, { useState } from "react";
import { Metadata } from "next";
import ForgotPasswordSendMail from "@/app/(auth)/forgot-password/components/forgot-password-sendmail";
import ForgotPasswordOtp from "@/app/(auth)/forgot-password/components/forgot-password-otp";

export default function ForgotPasswordPage() {
    const [currentStep, setCurrentStep] = useState<"sendmail" | "otp">(
        "sendmail"
    );
    const [email, setEmail] = useState("");

    const handleStepChange = (step: "sendmail" | "otp", userEmail?: string) => {
        setCurrentStep(step);
        if (userEmail) {
            setEmail(userEmail);
        }
    };

    return (
        <div className="w-full">
            {currentStep === "sendmail" ? (
                <ForgotPasswordSendMail onSuccess={handleStepChange} />
            ) : (
                <ForgotPasswordOtp
                    email={email}
                    onBack={() => handleStepChange("sendmail")}
                />
            )}
        </div>
    );
}

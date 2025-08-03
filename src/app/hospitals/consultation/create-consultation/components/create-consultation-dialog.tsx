"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, CircleAlert } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import TimePicker from "@/components/time-picker";

interface CreateConsultationDialogProps {
    onSubmit: (data: REQUEST.TCreateConsultation) => void;
}

interface FormData {
    start: string;
    end: string;
}

const CreateConsultationDialog: React.FC<CreateConsultationDialogProps> = ({
    onSubmit,
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const form = useForm<FormData>({
        defaultValues: {
            start: "00:00",
            end: "00:00",
        },
        resolver: async (data) => {
            const errors: any = {};
            const start = new Date(`1970-01-01T${data.start}:00`);
            const end = new Date(`1970-01-01T${data.end}:00`);
            const diff = (end.getTime() - start.getTime()) / 1000 / 60; // Difference in minutes

            if (diff < 30) {
                errors.end = {
                    type: "manual",
                    message: "Thời gian tư vấn phải ít nhất 30 phút.",
                };
            }

            return { values: data, errors };
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    const handleCancel = () => {
        reset();
        setIsDialogOpen(false);
    };

    const onFormSubmit = (data: FormData) => {
        const formData: REQUEST.TCreateConsultation = {
            timeTemplates: [
                {
                    start: data.start,
                    end: data.end,
                },
            ],
        };
        onSubmit(formData);
        setIsDialogOpen(false);
    };

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleCancel();
                }
                setIsDialogOpen(open);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="px-6 py-5 bg-[#248FCA] hover:bg-[#2490cada] cursor-pointer"
                >
                    <Plus width={20} height={20} color="white" />
                    Tạo cuộc tư vấn mới cho bác sĩ
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-[1.5rem] text-[#248FCA]">
                        Tạo cuộc tư vấn mới
                    </DialogTitle>
                    <DialogDescription>
                        Chọn thời gian bắt đầu và kết thúc để tạo cuộc tư vấn
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className="flex flex-col flex-1 mt-5"
                    >
                        <div className="flex-1 space-y-6">
                            <div className="flex gap-6">
                                <div>
                                    <Label className="flex font-medium items-center gap-2 text-gray-800 mb-5">
                                        Thời gian bắt đầu
                                    </Label>
                                    <div className="flex items-center gap-6">
                                        <Controller
                                            control={control}
                                            name="start"
                                            render={({ field }) => (
                                                <TimePicker
                                                    time={field.value}
                                                    onTimeChange={
                                                        field.onChange
                                                    }
                                                />
                                            )}
                                        />
                                        <ArrowRight />
                                    </div>
                                    {errors.start && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.start.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label className="flex font-medium items-center gap-2 text-gray-800 mb-5">
                                        Thời gian kết thúc
                                    </Label>
                                    <div className="flex items-center gap-6">
                                        <Controller
                                            control={control}
                                            name="end"
                                            render={({ field }) => (
                                                <TimePicker
                                                    time={field.value}
                                                    onTimeChange={
                                                        field.onChange
                                                    }
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors.end && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.end.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <DialogDescription className="flex items-center gap-1">
                                <CircleAlert className="w-4" color="gray" />
                                Lưu ý thời gian tối thiểu cho một cuộc tư vấn là
                                30 phút
                            </DialogDescription>
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                className="px-8 h-12 mt-15 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                            >
                                Tạo cuộc tư vấn
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default CreateConsultationDialog;

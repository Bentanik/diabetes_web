"use client";

import React, { useMemo, useState } from "react";
import Header from "./header";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import useCreatePackage, {
    PackageFormData,
} from "@/app/admin/package/create-package/hooks/use-create-package";

export default function CreatePackage() {
    const { form, onSubmit, isPending } = useCreatePackage();

    const formatDate = (d: string) => {
        const date = new Date(d);
        return `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
    };
    const todayFormatted = useMemo(
        () => formatDate(new Date().toISOString()),
        []
    );

    const currentValues = form.watch();

    const formattedPrice = useMemo(() => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(currentValues.price);
    }, [currentValues.price]);

    const handleFormSubmit = async (data: PackageFormData) => {
        try {
            const formData: REQUEST.TCreatePackage = {
                name: data.name,
                description: data.description,
                price: data.price,
                sessions: data.sessions,
                durationInMonths: data.durationInMonths,
            };
            onSubmit(formData);
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return (
        <div>
            <Header />
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[10%]">
                    <div>
                        <div className="mb-6">
                            <div className="flex items-center gap-2">
                                <Sparkles
                                    className="w-5 h-5"
                                    color="var(--primary-color)"
                                />
                                <h2 className="text-lg font-semibold text-[var(--primary-color)]">
                                    Thông tin gói tư vấn
                                </h2>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Nhập đầy đủ thông tin để tạo gói tư vấn hấp dẫn
                                cho khách hàng
                            </p>
                        </div>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleFormSubmit)}
                                className="space-y-5"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên gói</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ví dụ: Gói tư vấn riêng 40 lượt có thời hạn 5 tháng"
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mô tả</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={5}
                                                    placeholder="Mô tả ngắn gọn về gói dịch vụ, quyền lợi và giá trị mang lại..."
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giá (VNĐ)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        placeholder="600000"
                                                        value={field.value}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target
                                                                    .value ===
                                                                    ""
                                                                    ? 0
                                                                    : Number(
                                                                          e
                                                                              .target
                                                                              .value
                                                                      )
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sessions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số lượt</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        placeholder="40"
                                                        value={field.value}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target
                                                                    .value ===
                                                                    ""
                                                                    ? 0
                                                                    : Number(
                                                                          e
                                                                              .target
                                                                              .value
                                                                      )
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="durationInMonths"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Thời hạn (tháng)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        placeholder="5"
                                                        value={field.value}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target
                                                                    .value ===
                                                                    ""
                                                                    ? 0
                                                                    : Number(
                                                                          e
                                                                              .target
                                                                              .value
                                                                      )
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="bg-[#248FCA] text-white hover:bg-[#3b9bcf] transition-colors flex items-center gap-2 px-4 py-6 rounded-lg cursor-pointer"
                                    >
                                        Tạo gói tư vấn
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>

                    <div>
                        <div className="border border-gray-200 rounded-2xl w-[80%]">
                            <div className="bg-[#248FCA] rounded-t-2xl">
                                <h3 className="text-base font-semibold text-[white] p-5">
                                    {currentValues.name?.trim() ||
                                        "Tên gói tư vấn"}
                                </h3>
                            </div>
                            <div className="p-5">
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                    {currentValues.description?.trim() ||
                                        "Mô tả ngắn gọn về gói dịch vụ, quyền lợi và giá trị mang lại..."}
                                </p>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Giá:
                                        </span>
                                        <span className="font-semibold text-gray-800 text-lg">
                                            {formattedPrice || "0 VNĐ"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Số lượt:
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {currentValues.sessions || 0} lượt
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Thời hạn:
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {currentValues.durationInMonths ||
                                                0}{" "}
                                            tháng
                                        </span>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Tạo:
                                        </span>
                                        <span className="text-gray-700">
                                            {todayFormatted}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

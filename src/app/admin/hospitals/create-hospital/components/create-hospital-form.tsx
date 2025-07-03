/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Upload,
    Building2,
    Mail,
    Phone,
    MapPin,
    FileText,
    ImageIcon,
    AlertCircle,
    CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import useCreateHospital, {
    HospitalFormData,
} from "@/app/admin/hospitals/create-hospital/hooks/use-create-hospital";

export default function CreateHospitalForm() {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { form, onSubmit } = useCreateHospital();

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Kích thước file không được vượt quá 5MB");
                return;
            }

            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Vui lòng chọn file hình ảnh");
                return;
            }

            setLogoFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearImages = () => {
        setLogoFile(null);
        setLogoPreview(null);
    };

    const handleFormSubmit = (data: HospitalFormData) => {
        setIsSubmitting(true);
        try {
            if (logoFile !== null) {
                const formData: REQUEST.TCreateHospital = {
                    name: data.name,
                    address: data.address,
                    contactNumber: data.contactNumber,
                    email: data.email,
                    description: data.description ?? "",
                    establishedDate: data.establishedDate,
                    logo: logoFile,
                };
                onSubmit(formData, handleClearImages);
            }
        } catch (error) {
            console.error("Error creating hospital:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // const itemVariants = {
    //     hidden: { opacity: 0, y: 20 },
    //     visible: {
    //         opacity: 1,
    //         y: 0,
    //         transition: { duration: 0.5, ease: "easeOut" },
    //     },
    // };

    return (
        <div className="min-h-screen">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="space-y-8"
                >
                    {/* Logo Upload Section */}
                    <motion.div className="space-y-4">
                        <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                            <ImageIcon className="h-5 w-5 text-[#248fca]" />
                            Logo bệnh viện
                        </Label>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id="logo-upload"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex items-center gap-2 h-12 px-6 border-2 border-[#248fca] text-[#248fca] hover:bg-[#248fca] hover:text-white transition-all duration-300"
                                    asChild
                                >
                                    <label
                                        htmlFor="logo-upload"
                                        className="cursor-pointer"
                                    >
                                        <Upload className="h-5 w-5" />
                                        Chọn logo
                                    </label>
                                </Button>
                            </div>
                            {logoPreview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-20 h-20 rounded-xl border-4 border-[#248fca]/20 overflow-hidden shadow-lg"
                                >
                                    <img
                                        src={logoPreview || "/placeholder.svg"}
                                        alt="Logo preview"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">
                            Chấp nhận file JPG, PNG. Kích thước tối đa 5MB.
                        </p>
                    </motion.div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                            <Building2 className="h-5 w-5 text-[#248fca]" />
                                            Tên bệnh viện *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Nhập tên bệnh viện"
                                                className="h-12 text-base border-2 focus:border-[#248fca] transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                            <Mail className="h-5 w-5 text-[#248fca]" />
                                            Email *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="hospital@example.com"
                                                className="h-12 text-base border-2 focus:border-[#248fca] transition-colors outline-none focus:ring-0"
                                            />
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div>
                            <FormField
                                control={form.control}
                                name="contactNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                            <Phone className="h-5 w-5 text-[#248fca]" />
                                            Số điện thoại *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="0123 456 789"
                                                className="h-12 text-base border-2 focus:border-[#248fca] transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div>
                            <FormField
                                control={form.control}
                                name="establishedDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                            <Calendar className="h-5 w-5 text-[#248fca]" />
                                            Ngày thành lập *
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full h-12 justify-start text-left font-normal border-2 focus:border-[#248fca] transition-colors",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-5 w-5 text-[#248fca]" />
                                                        {field.value
                                                            ? format(
                                                                  field.value,
                                                                  "dd/MM/yyyy",
                                                                  { locale: vi }
                                                              )
                                                            : "Chọn ngày thành lập"}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date: Date) =>
                                                        date > new Date() ||
                                                        date <
                                                            new Date(
                                                                "1900-01-01"
                                                            )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage className="flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    </div>

                    <motion.div>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                        <MapPin className="h-5 w-5 text-[#248fca]" />
                                        Địa chỉ *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Nhập địa chỉ đầy đủ của bệnh viện"
                                            className="h-12 text-base border-2 focus:border-[#248fca] transition-colors"
                                        />
                                    </FormControl>
                                    <FormMessage className="flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                        <FileText className="h-5 w-5 text-[#248fca]" />
                                        Mô tả
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Mô tả về bệnh viện, chuyên khoa, dịch vụ..."
                                            rows={4}
                                            className="resize-none text-base border-2 focus:border-[#248fca] transition-colors"
                                        />
                                    </FormControl>
                                    <FormMessage className="flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* Submit Buttons */}
                    <motion.div className="flex justify-end gap-4 pt-8 border-t-2 border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            className="px-8 h-12 text-base border-2 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                                form.reset();
                                setLogoFile(null);
                                setLogoPreview(null);
                            }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 h-12 text-base bg-[#248fca] hover:bg-[#1e7bb8] transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: "linear",
                                        }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Đang tạo...
                                </div>
                            ) : (
                                "Tạo bệnh viện"
                            )}
                        </Button>
                    </motion.div>
                </form>
            </Form>
        </div>
    );
}

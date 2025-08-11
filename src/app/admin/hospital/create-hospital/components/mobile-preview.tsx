import React, { useEffect } from "react";
import Image from "next/image";
import { Smartphone, Globe, MapPin, Phone, Mail } from "lucide-react";
import AutoCarouselMobile from "./auto-carousel";

interface MobilePreviewProps {
    avatarPreview?: string;
    imagesPreview?: { id: string; preview: string }[];
    currentContentHtml: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    website: string;
}

export default function MobilePreview({
    avatarPreview,
    imagesPreview,
    currentContentHtml,
    name,
    phone,
    email,
    location,
    website,
}: MobilePreviewProps) {
    useEffect(() => {}, [imagesPreview]);
    return (
        <div className="flex-1 relative flex justify-center">
            <div>
                <div className="flex justify-center font-semibold text-lg items-center gap-2">
                    <Smartphone className="h-5 w-5 text-[#248fca]" />
                    Xem trước trên mobile
                </div>
                <div className="relative inline-block mt-10">
                    <Image
                        src="/images/phone.png"
                        alt="phone frame"
                        width={385}
                        height={667}
                        className="mx-auto"
                    />
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-lg overflow-auto wrap-break-word"
                        style={{
                            width: "340px",
                            height: "600px",
                        }}
                    >
                        <div>
                            <div>
                                <div className="flex gap-5 leading-5">
                                    <Image
                                        src={
                                            avatarPreview ||
                                            "/images/default_img.jpg"
                                        }
                                        alt="avatar"
                                        width={100}
                                        height={50}
                                        className="rounded-2xl object-cover h-[100px]"
                                    />
                                    <div>
                                        <h2 className="font-medium text-[1.2rem] mt-5 line-clamp-2 max-w-[150px]">
                                            {name || "Tên Bệnh Viện"}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* List Images */}
                            <div>
                                <AutoCarouselMobile
                                    imagesPreview={imagesPreview}
                                />
                            </div>
                            <div className="mt-4">
                                <p className="font-medium text-[1.1rem] text-[#248FCA]">
                                    Thông tin bệnh viện
                                </p>
                                <p className="text-[#a5a5a5] font-light text-[0.9rem]">
                                    Đây là thông tin cơ bản của bệnh viện, bạn
                                    có thể liên hệ qua số điện thoại
                                </p>
                                <div className="mt-2">
                                    {/* Website */}
                                    <div className="flex gap-3">
                                        <div className="flex gap-2">
                                            <Globe width={20} />
                                            <span className="">Website:</span>
                                        </div>
                                        <span className="text-[#0099ff] max-w-[250px] line-clamp-1">
                                            {website}
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex gap-3 mt-2">
                                        <div className="flex gap-2">
                                            <MapPin width={20} />
                                            <span className="]">Địa chỉ:</span>
                                        </div>
                                        <span className="max-w-[200px] line-clamp-1">
                                            {location}
                                        </span>
                                    </div>

                                    {/* Phone number */}
                                    <div className="flex gap-3 mt-2">
                                        <div className="flex gap-2">
                                            <Phone width={20} />
                                            <span className="">
                                                Số điện thoại:
                                            </span>
                                        </div>
                                        <span className="max-w-[300px]">
                                            {phone}
                                        </span>
                                    </div>

                                    {/* Email */}
                                    <div className="flex gap-3 mt-2">
                                        <div className="flex gap-2">
                                            <Mail width={20} />
                                            <span className="]">Email:</span>
                                        </div>
                                        <span className="max-w-[300px] line-clamp-1">
                                            {email}
                                        </span>
                                    </div>
                                </div>
                                {/* Website */}
                            </div>
                            <div className="mt-4">
                                <p className="font-medium text-[1.1rem] text-[#248FCA]">
                                    Giới thiệu bệnh viện
                                </p>
                                <div
                                    className="prose prose-sm max-w-none mt-2"
                                    dangerouslySetInnerHTML={{
                                        __html: currentContentHtml || "",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

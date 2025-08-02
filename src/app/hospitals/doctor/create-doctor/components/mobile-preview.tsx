import React from "react";
import Image from "next/image";
import { Smartphone, CircleUserRound, BadgeCheck } from "lucide-react";

interface MobilePreviewProps {
    avatarPreview?: string;
    currentContentHtml: string;
}

export default function MobilePreview({
    avatarPreview,
    currentContentHtml,
}: MobilePreviewProps) {
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
                                            "/images/default_user.png"
                                        }
                                        alt="avatar"
                                        width={100}
                                        height={100}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <p className="text-[gray] font-thin text-[0.9rem]">
                                            PGS. TS. BS
                                        </p>
                                        <h2 className="font-medium text-[1.2rem]">
                                            Lâm Việt Trung
                                        </h2>
                                        <div className="flex gap-1 items-center">
                                            <BadgeCheck
                                                width={15}
                                                color="#0066ff"
                                            />
                                            <p className="text-[#0066ff] text-[0.9rem]">
                                                Bác sĩ
                                            </p>
                                        </div>
                                        <p className=" text-[0.9rem]">
                                            <span className="font-medium">
                                                25
                                            </span>{" "}
                                            năm kinh nghiệm
                                        </p>
                                    </div>
                                </div>
                                <div className="text-thin mt-1 text-[0.9rem]">
                                    Chuyên khoa:{" "}
                                    <span className="px-3 py-1 bg-gray-200 rounded-full text-[1rem]">
                                        Tiêu hóa
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-10">
                                <CircleUserRound />
                                <p>Giới thiệu bác sĩ</p>
                            </div>
                            <div
                                className="prose prose-sm max-w-none mt-5"
                                dangerouslySetInnerHTML={{
                                    __html: currentContentHtml || "",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

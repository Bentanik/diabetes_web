import React from "react";
import Image from "next/image";
import { BadgeCheck, CircleUserRound, Smartphone } from "lucide-react";

interface PhonePreviewProps {
    thumbnailPreview: string | null;
    firstName: string;
    middleName: string | undefined;
    lastName: string;
    position: number;
    exp: number;
    currentContentHtml: string;
}

const getPosition = (position: number) => {
    switch (position) {
        case 0:
            return "Giám đốc";
        case 1:
            return "Phó Giám đốc";
        case 2:
            return "Trưởng khoa";
        case 3:
            return "Phó trưởng khoa";
        case 4:
            return "Bác sĩ";
        default:
            return "Chức vụ không xác định";
    }
};

export default function PhonePreview({
    thumbnailPreview,
    firstName,
    middleName,
    lastName,
    position,
    exp,
    currentContentHtml,
}: PhonePreviewProps) {
    return (
        <div className="flex-1 relative flex justify-center">
            <div className="">
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
                                            thumbnailPreview ||
                                            "/images/default_user.png"
                                        }
                                        alt="avatar"
                                        width={100}
                                        height={100}
                                        className="rounded-full object-cover w-[100px] h-[100px]"
                                    />
                                    <div className="mt-3">
                                        <div className="font-medium text-[1.2rem] flex flex-wrap gap-1">
                                            <span>{firstName || "Họ"}</span>
                                            {middleName && (
                                                <span>{middleName}</span>
                                            )}
                                            <span>{lastName || "Tên"}</span>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <BadgeCheck
                                                width={15}
                                                color="#0066ff"
                                            />
                                            <p className="text-[#0066ff] text-[0.9rem]">
                                                {getPosition(position)}
                                            </p>
                                        </div>
                                        <p className=" text-[0.9rem]">
                                            <span className="font-medium">
                                                {exp || "0"}
                                            </span>{" "}
                                            năm kinh nghiệm
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="font-medium text-[1.1rem] text-[#248FCA] mt-5">
                                Giới thiệu bác sĩ
                            </p>
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

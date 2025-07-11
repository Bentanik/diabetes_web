import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

const Header = () => {
    return (
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
            <div>
                <div className="flex items-center gap-5">
                    <Link href={`/hospital/doctor`}>
                        <ArrowLeft color="#248fca" />
                    </Link>

                    <h1 className="text-2xl font-bold text-[var(--primary-color)]">
                        Tạo nội dung bài viết
                    </h1>
                </div>
                <p className="text-gray-600 mt-1 ml-11 text-sm">
                    Tạo bài viết mới
                </p>
            </div>
        </div>
    );
};

export default function DoctorDetailComponent({ doctorId }: REQUEST.DoctorId) {
    return (
        <div>
            <header>
                <Header />
            </header>
            <main>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
                    <div className="p-5">
                        {/* Header */}
                        <div>
                            <Image src="/images/auth1.png" alt="avatar" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

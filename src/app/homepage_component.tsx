"use client";

import React, { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HomeHero from "@/components/home_hero";
import { useAppSelector } from "@/stores";

// Lazy load các phần ít quan trọng hoặc có thể tải sau
const HomeFeature = React.lazy(() => import("@/components/home_feature"));
const HomeUseWhom = React.lazy(() => import("@/components/home_use_whom"));
const HomeFAQ = React.lazy(() => import("@/components/home_faq"));

export default function HomepageComponent() {
    const userState = useAppSelector((state) => state.userSlice);

    if (
        userState.user?.roles?.includes("SystemAdmin") ||
        userState.user?.roles?.includes("Moderator")
    ) {
        return (window.location.href = "/admin/home");
    }
    if (userState.user?.roles?.includes("HospitalStaff")) {
        return (window.location.href = "/hospitals/home");
    }

    return (
        <div className="font-be-vietnam-pro overflow-x-hidden">
            <Header />

            <main className="relative">
                <HomeHero />

                <Suspense
                    fallback={
                        <div className="py-10 text-center">
                            Đang tải tính năng...
                        </div>
                    }
                >
                    <HomeFeature />
                </Suspense>

                <Suspense
                    fallback={
                        <div className="py-10 text-center">
                            Đang tải phần người dùng...
                        </div>
                    }
                >
                    <HomeUseWhom />
                </Suspense>

                <Suspense
                    fallback={
                        <div className="py-10 text-center">
                            Đang tải câu hỏi thường gặp...
                        </div>
                    }
                >
                    <HomeFAQ />
                </Suspense>
            </main>

            <Footer />
        </div>
    );
}

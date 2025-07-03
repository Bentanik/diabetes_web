import HomepageComponent from "@/app/homepage_component";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Trang chủ",
    description: "Trang chủ của hệ thống",
};

export default function HomePage() {
    return (
        <div>
            <HomepageComponent />
        </div>
    );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Provider from "@/providers";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const beVietnam = Be_Vietnam_Pro({
    subsets: ["vietnamese"],
    variable: "--font-be-vietnam-pro",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Diabetes Doctor Management System",
    description: "Diabetes Doctor Management System",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${beVietnam.variable} antialiased`}
            >
                <Toaster
                    position="top-right"
                    toastOptions={{ duration: 5000 }}
                />
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}

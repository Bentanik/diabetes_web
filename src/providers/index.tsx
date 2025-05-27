'use client';


import { Backdrop } from "@/components/backdrop";
import { BackdropProvider } from "@/context/backdrop_context";
import { StoreProvider } from "@/providers/redux-provider";
import dynamic from "next/dynamic";

const ReactQueryProvider = dynamic(
    () => import("@/providers/query-provider").then((mod) => mod.default),
    { ssr: false }
);

export default function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StoreProvider>
            <BackdropProvider>
                <Backdrop />
                <ReactQueryProvider>
                    {children}
                </ReactQueryProvider>
            </BackdropProvider>
        </StoreProvider>
    );
}
import React from "react";
import Header from "./header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default function ManageConsultation() {
    return (
        <div>
            <Header />
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shawdow-hospital">
                <SidebarProvider>
                    {/* <AppSidebar variant="inset" /> */}
                    {/* <SidebarInset> */}
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <SectionCards />
                                <div className="px-4 lg:px-6">
                                    <ChartAreaInteractive />
                                </div>
                                {/* <DataTable data={data} /> */}
                            </div>
                        </div>
                    </div>
                    {/* </SidebarInset> */}
                </SidebarProvider>
            </div>
        </div>
    );
}

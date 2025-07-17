"use client"
import CheckMain from "@/app/admin/train-ai/check/components/check_main"
import Header from "@/app/admin/train-ai/check/components/header"

export default function CheckComponent() {
    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <CheckMain />
            </div>
        </div>
    )
}

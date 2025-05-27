import React from 'react';
import { cn } from "@/lib/utils";
import { useBackdrop } from '@/context/backdrop_context'; 

export const Backdrop: React.FC = () => {
    const { open, hideBackdrop } = useBackdrop();

    return (
        <div
            className={cn(
                "fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity z-50",
                open ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={hideBackdrop}
            style={{ pointerEvents: open ? "auto" : "none" }}
        >
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        </div>
    );
};

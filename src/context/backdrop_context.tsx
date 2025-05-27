'use client';

import React, { createContext, useContext, useState } from 'react';

// Định nghĩa giá trị của context
interface BackdropContextType {
    open: boolean;
    showBackdrop: () => void;
    hideBackdrop: () => void;
}

// Khởi tạo Context
const BackdropContext = createContext<BackdropContextType | undefined>(undefined);

// Cung cấp Context cho các component con
export const BackdropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);

    // Hiển thị Backdrop
    const showBackdrop = () => setOpen(true);

    // Ẩn Backdrop
    const hideBackdrop = () => setOpen(false);

    return (
        <BackdropContext.Provider value={{ open, showBackdrop, hideBackdrop }}>
            {children}
        </BackdropContext.Provider>
    );
};

// Hook sử dụng Context
export const useBackdrop = (): BackdropContextType => {
    const context = useContext(BackdropContext);
    if (!context) {
        throw new Error('useBackdrop must be used within a BackdropProvider');
    }
    return context;
};

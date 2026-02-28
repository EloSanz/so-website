"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    isZenMode: boolean;
    toggleZenMode: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isZenMode, setIsZenMode] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const setSidebarOpen = (isOpen: boolean) => setIsSidebarOpen(isOpen);
    const toggleZenMode = () => {
        const nextZen = !isZenMode;
        setIsZenMode(nextZen);
        if (nextZen) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, setSidebarOpen, isZenMode, toggleZenMode }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

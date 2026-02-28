"use client";

import Link from "next/link";
import { Terminal, Menu } from "lucide-react";

import { ThemeToggle } from "./ThemeToggle";

export function MobileHeader() {
    return (
        <header className="lg:hidden h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold tracking-tight text-foreground">OS Deep Dive</span>
            </Link>

            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link
                    href="/"
                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
                >
                    <Menu className="w-5 h-5 text-foreground/70" />
                </Link>
            </div>
        </header>
    );
}

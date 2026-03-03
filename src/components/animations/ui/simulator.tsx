import React from 'react';
import { cn } from '@/lib/utils';

export function SimulatorContainer({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("w-full h-full p-4 flex flex-col gap-6", className)} {...props}>
            {children}
        </div>
    );
}

export function SimulatorHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-4 bg-muted/20 p-4 rounded-2xl border border-border", className)} {...props}>
            {children}
        </div>
    );
}

export function SimulatorHeaderControls({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex flex-wrap items-center gap-6", className)} {...props}>
            {children}
        </div>
    );
}

export function SimulatorHeaderActions({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex items-center gap-2", className)} {...props}>
            {children}
        </div>
    );
}

export function SimulatorPanel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("relative flex-1 bg-muted/20 rounded-3xl border border-border p-4 md:p-6 lg:p-8 overflow-hidden flex flex-col items-center justify-center", className)} {...props}>
            {children}
        </div>
    );
}

interface SimulatorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'play' | 'icon' | 'destructive';
}

export function SimulatorButton({ className, variant = 'default', children, ...props }: SimulatorButtonProps) {
    const baseClasses = "transition-all font-bold tracking-widest disabled:opacity-30 flex items-center justify-center gap-2";

    const variantClasses = {
        default: "px-4 py-2 rounded-xl bg-muted border border-border text-[10px] uppercase text-foreground hover:bg-muted/80 font-mono",
        play: "p-2 rounded-xl shadow-lg bg-primary shadow-primary/20 text-white hover:brightness-110",
        icon: "p-2 rounded-xl bg-muted border border-border text-foreground hover:bg-muted/80 shadow-md",
        destructive: "p-2 rounded-xl shadow-lg bg-orange-500 shadow-orange-500/20 text-white hover:brightness-110",
    };

    return (
        <button
            className={cn(baseClasses, variantClasses[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}

interface SimulatorMetricProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: React.ReactNode;
}

export function SimulatorMetric({ label, value, className, ...props }: SimulatorMetricProps) {
    return (
        <div className={cn("text-center", className)} {...props}>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{label}</div>
            <div className="text-lg md:text-xl font-black text-foreground">{value}</div>
        </div>
    );
}

export function SimulatorDivider({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("h-8 w-px bg-border", className)} {...props} />
    );
}

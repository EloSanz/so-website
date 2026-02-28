"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Pause, RefreshCcw, Zap, Clock, HardDrive } from "lucide-react";

type ProcessState = "NEW" | "READY" | "RUNNING" | "BLOCKED" | "EXIT";

interface Process {
    id: string;
    state: ProcessState;
    color: string;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#6366f1"];

export function ProcessStateSimulator() {
    const [process, setProcess] = useState<Process>({
        id: "PID 1024",
        state: "READY",
        color: "#3b82f6",
    });
    const [history, setHistory] = useState<string[]>(["Proceso inicializado en READY"]);

    const log = (msg: string) => {
        setHistory((prev) => [msg, ...prev].slice(0, 5));
    };

    const transitionTo = (newState: ProcessState, reason: string) => {
        setProcess((prev) => ({ ...prev, state: newState }));
        log(`${reason} -> ${newState}`);
    };

    const handleDispatch = () => transitionTo("RUNNING", "Scheduler: Dispatch");
    const handleTimeSlice = () => transitionTo("READY", "Interrupt: Time Slice");
    const handleIOWait = () => transitionTo("BLOCKED", "Syscall: I/O Wait");
    const handleIOFinish = () => transitionTo("READY", "IRQ: I/O Complete");
    const handleExit = () => transitionTo("EXIT", "Syscall: Exit");
    const handleRestart = () => {
        setProcess({ id: "PID 1024", state: "READY", color: "#3b82f6" });
        setHistory(["Proceso reiniciado en READY"]);
    };

    const statePositions: Record<ProcessState, { x: number; y: number }> = {
        NEW: { x: -250, y: -100 },
        READY: { x: -150, y: 0 },
        RUNNING: { x: 150, y: 0 },
        BLOCKED: { x: 0, y: 150 },
        EXIT: { x: 250, y: -100 },
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 select-none">
            <div className="flex-1 relative flex items-center justify-center min-h-[300px]">
                {/* Connection Arrows (Simplified SVG background) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="-300 -200 600 400">
                    {/* Ready <-> Running */}
                    <path d="M -100 0 L 100 0" stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                    <path d="M 100 -20 Q 0 -50 -100 -20" stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                    {/* Running -> Blocked -> Ready */}
                    <path d="M 140 30 Q 100 120 20 140" stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                    <path d="M -20 140 Q -100 120 -140 30" stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orientation="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
                        </marker>
                    </defs>
                </svg>

                {/* State Labels */}
                {Object.entries(statePositions).map(([state, pos]) => (
                    <div
                        key={state}
                        className={cn(
                            "absolute text-[10px] font-black tracking-tighter uppercase opacity-30 transform -translate-x-1/2 -translate-y-1/2",
                            process.state === state && "opacity-100 text-primary scale-110"
                        )}
                        style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)` }}
                    >
                        {state}
                    </div>
                ))}

                {/* Animated Process Token */}
                <motion.div
                    animate={{
                        x: statePositions[process.state].x,
                        y: statePositions[process.state].y,
                        scale: process.state === "EXIT" ? 0 : 1,
                        opacity: process.state === "EXIT" ? 0 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="z-20 w-16 h-16 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: process.color }}
                >
                    <div className="text-[8px] opacity-80">PROCESO</div>
                    <div>{process.id.split(' ')[1]}</div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 justify-center">
                {process.state === "READY" && (
                    <button
                        onClick={handleDispatch}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white font-bold text-sm hover:scale-105 transition-transform"
                    >
                        <Play className="w-4 h-4" /> Despachar (CPU)
                    </button>
                )}

                {process.state === "RUNNING" && (
                    <>
                        <button
                            onClick={handleTimeSlice}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-sm hover:scale-105 transition-transform"
                        >
                            <Clock className="w-4 h-4" /> Time Slice
                        </button>
                        <button
                            onClick={handleIOWait}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-sm hover:scale-105 transition-transform"
                        >
                            <HardDrive className="w-4 h-4" /> Pedir E/S
                        </button>
                        <button
                            onClick={handleExit}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 text-white font-bold text-sm hover:scale-105 transition-transform"
                        >
                            <Zap className="w-4 h-4" /> Terminar
                        </button>
                    </>
                )}

                {process.state === "BLOCKED" && (
                    <button
                        onClick={handleIOFinish}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:scale-105 transition-transform"
                    >
                        <RefreshCcw className="w-4 h-4" /> Fin E/S
                    </button>
                )}

                {process.state === "EXIT" && (
                    <button
                        onClick={handleRestart}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:scale-105 transition-transform"
                    >
                        <RefreshCcw className="w-4 h-4" /> Nuevo Proceso
                    </button>
                )}
            </div>

            {/* History Log */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Eventos de Planificación</div>
                <div className="space-y-1">
                    {history.map((h, i) => (
                        <div key={i} className={cn("text-xs font-mono", i === 0 ? "text-primary font-bold" : "text-muted-foreground opacity-70")}>
                            {i === 0 ? "> " : "  "} {h}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

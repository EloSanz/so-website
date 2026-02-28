'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Cpu, ListOrdered, BarChart3, Info } from 'lucide-react';

interface Process {
    id: string;
    name: string;
    color: string;
    burstTime: number;
    remainingTime: number;
    status: 'ready' | 'running' | 'finished';
}

const COLORS = [
    '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#f472b6'
];

export default function SJFAnimation() {
    const [processes, setProcesses] = useState<Process[]>([
        { id: 'p1', name: 'P1', color: COLORS[0], burstTime: 8, remainingTime: 8, status: 'ready' },
        { id: 'p2', name: 'P2', color: COLORS[1], burstTime: 3, remainingTime: 3, status: 'ready' },
        { id: 'p3', name: 'P3', color: COLORS[2], burstTime: 5, remainingTime: 5, status: 'ready' },
    ]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [runningProcessId, setRunningProcessId] = useState<string | null>(null);
    const [readyQueue, setReadyQueue] = useState<string[]>(['p1', 'p2', 'p3']);
    const [finishedProcesses, setFinishedProcesses] = useState<string[]>([]);
    const [totalTime, setTotalTime] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // SJF Logic: Sort ready queue by burstTime
    const sortReadyQueue = (queue: string[], allProcesses: Process[]) => {
        return [...queue].sort((a, b) => {
            const procA = allProcesses.find(p => p.id === a)!;
            const procB = allProcesses.find(p => p.id === b)!;
            return procA.burstTime - procB.burstTime;
        });
    };

    const reset = () => {
        setIsPlaying(false);
        const initialProcesses: Process[] = [
            { id: 'p1', name: 'P1', color: COLORS[0], burstTime: 8, remainingTime: 8, status: 'ready' },
            { id: 'p2', name: 'P2', color: COLORS[1], burstTime: 3, remainingTime: 3, status: 'ready' },
            { id: 'p3', name: 'P3', color: COLORS[2], burstTime: 5, remainingTime: 5, status: 'ready' },
        ];
        setProcesses(initialProcesses);
        setReadyQueue(sortReadyQueue(['p1', 'p2', 'p3'], initialProcesses));
        setFinishedProcesses([]);
        setRunningProcessId(null);
        setTotalTime(0);
    };

    const addProcess = () => {
        if (processes.length >= 6) return;
        const id = `p${processes.length + 1}`;
        const burstTime = Math.floor(Math.random() * 7) + 2;
        const newProcess: Process = {
            id,
            name: id.toUpperCase(),
            color: COLORS[processes.length % COLORS.length],
            burstTime,
            remainingTime: burstTime,
            status: 'ready'
        };
        const newProcesses = [...processes, newProcess];
        setProcesses(newProcesses);
        setReadyQueue(sortReadyQueue([...readyQueue, id], newProcesses));
    };

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(step, 800);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, runningProcessId, readyQueue, processes]);

    const step = () => {
        if (!runningProcessId) {
            if (readyQueue.length > 0) {
                // Since it's sorted, we take the first one
                const nextId = readyQueue[0];
                setRunningProcessId(nextId);
                setReadyQueue(prev => prev.slice(1));
                updateProcessStatus(nextId, 'running');
            } else if (finishedProcesses.length === processes.length) {
                setIsPlaying(false);
            }
            return;
        }

        const currentProcess = processes.find(p => p.id === runningProcessId)!;
        const newRemainingTime = Math.max(0, currentProcess.remainingTime - 1);

        setTotalTime(prev => prev + 1);
        setProcesses(prev => prev.map(p =>
            p.id === runningProcessId ? { ...p, remainingTime: newRemainingTime } : p
        ));

        if (newRemainingTime === 0) {
            setFinishedProcesses(prev => [...prev, runningProcessId]);
            updateProcessStatus(runningProcessId, 'finished');
            setRunningProcessId(null);
        }
    };

    const updateProcessStatus = (id: string, status: 'ready' | 'running' | 'finished') => {
        setProcesses(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };

    return (
        <div className="w-full h-full p-4 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={18} className="text-blue-400" />
                        <span className="text-sm font-black text-white uppercase tracking-tighter">Shortest Job First</span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Reloj Central</div>
                        <div className="text-lg font-black text-white">{totalTime}s</div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={addProcess}
                        disabled={isPlaying || processes.length >= 6}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase font-black text-white hover:bg-white/10 disabled:opacity-30 transition-all tracking-widest"
                    >
                        + Nuevo Proc
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`p-2 rounded-xl transition-all shadow-lg ${isPlaying ? 'bg-orange-500 shadow-orange-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}
                    >
                        {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white" />}
                    </button>
                    <button onClick={reset} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20">
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                <div className="md:col-span-3 bg-white/5 rounded-3xl border border-white/5 p-6 relative overflow-hidden flex flex-col">
                    <div className="text-[10px] font-bold text-white/30 uppercase mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2"><ListOrdered size={12} /> Cola de Listos (Ordenada por Duración)</div>
                        <div className="flex items-center gap-1 text-blue-400/50"><Info size={10} /> SJF No-Apropiativo</div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-end min-h-[140px] border-b border-white/5 pb-4">
                        <AnimatePresence>
                            {readyQueue.map((id) => {
                                const p = processes.find(proc => proc.id === id)!;
                                return (
                                    <motion.div
                                        key={id}
                                        layoutId={id}
                                        initial={{ scale: 0.5, opacity: 0, y: 20 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 0.5, opacity: 0, y: -20 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div
                                            className="w-12 rounded-t-xl transition-all group-hover:brightness-110 shadow-lg relative flex items-center justify-center font-black text-white"
                                            style={{
                                                backgroundColor: p.color,
                                                height: `${p.burstTime * 12}px`,
                                                minHeight: '40px'
                                            }}
                                        >
                                            <span className="text-xs">{p.name}</span>
                                            <div className="absolute -top-6 text-[10px] font-mono text-white/40">{p.burstTime}s</div>
                                        </div>
                                        <div className="w-12 h-1 bg-white/10 rounded-full" />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                        {readyQueue.length === 0 && (
                            <div className="w-full h-full flex items-center justify-center text-white/10 text-[10px] uppercase font-black tracking-widest">Cola Vacía</div>
                        )}
                    </div>
                    <div className="mt-2 text-[9px] text-white/20 italic italic flex justify-center">Los procesos más cortos se adelantan en la fila</div>
                </div>

                <div className="bg-emerald-500/5 rounded-3xl border-2 border-dashed border-emerald-500/20 p-4 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-[10px] font-bold text-emerald-500/50 uppercase flex items-center gap-1">
                        <Cpu size={12} /> CPU
                    </div>
                    <AnimatePresence mode="wait">
                        {runningProcessId ? (
                            <motion.div
                                key={runningProcessId}
                                layoutId={runningProcessId}
                                className="w-24 h-24 rounded-3xl flex flex-col items-center justify-center text-white font-black text-3xl shadow-2xl z-10 relative overflow-hidden"
                                style={{ backgroundColor: processes.find(p => p.id === runningProcessId)!.color }}
                            >
                                <div className="z-10">{processes.find(p => p.id === runningProcessId)!.name}</div>
                                <div className="text-[10px] font-bold opacity-60 z-10">TERMINANDO...</div>

                                {/* Progress background */}
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 bg-black/20"
                                    initial={{ height: '0%' }}
                                    animate={{ height: `${(1 - processes.find(p => p.id === runningProcessId)!.remainingTime / processes.find(p => p.id === runningProcessId)!.burstTime) * 100}%` }}
                                />
                            </motion.div>
                        ) : (
                            <div className="text-white/10 uppercase tracking-widest font-black text-[10px]">CPU Ociosa</div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                {processes.map(p => (
                    <div key={p.id} className={`p-3 rounded-2xl border transition-all ${p.status === 'finished' ? 'bg-emerald-500/10 border-emerald-500/20 opacity-40' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-white/60">{p.name}</span>
                            <span className="text-[8px] font-mono text-white/40">{p.burstTime}s</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full"
                                style={{ backgroundColor: p.color }}
                                animate={{ width: `${(p.remainingTime / p.burstTime) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

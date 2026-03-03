'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Cpu, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    SimulatorContainer, SimulatorHeader, SimulatorHeaderControls,
    SimulatorHeaderActions, SimulatorButton, SimulatorMetric, SimulatorDivider
} from './ui/simulator';

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

export default function RoundRobinAnimation() {
    const [quantum, setQuantum] = useState(2);
    const [processes, setProcesses] = useState<Process[]>([
        { id: 'p1', name: 'P1', color: COLORS[0], burstTime: 5, remainingTime: 5, status: 'ready' },
        { id: 'p2', name: 'P2', color: COLORS[1], burstTime: 3, remainingTime: 3, status: 'ready' },
        { id: 'p3', name: 'P3', color: COLORS[2], burstTime: 2, remainingTime: 2, status: 'ready' },
    ]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentQuantum, setCurrentQuantum] = useState(0);
    const [runningProcessId, setRunningProcessId] = useState<string | null>(null);
    const [readyQueue, setReadyQueue] = useState<string[]>(['p1', 'p2', 'p3']);
    const [finishedProcesses, setFinishedProcesses] = useState<string[]>([]);
    const [totalTime, setTotalTime] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const reset = () => {
        setIsPlaying(false);
        const initialProcesses: Process[] = [
            { id: 'p1', name: 'P1', color: COLORS[0], burstTime: 5, remainingTime: 5, status: 'ready' },
            { id: 'p2', name: 'P2', color: COLORS[1], burstTime: 3, remainingTime: 3, status: 'ready' },
            { id: 'p3', name: 'P3', color: COLORS[2], burstTime: 2, remainingTime: 2, status: 'ready' },
        ];
        setProcesses(initialProcesses);
        setReadyQueue(['p1', 'p2', 'p3']);
        setFinishedProcesses([]);
        setRunningProcessId(null);
        setCurrentQuantum(0);
        setTotalTime(0);
    };

    const addProcess = () => {
        if (processes.length >= 6) return;
        const id = `p${processes.length + 1}`;
        const burstTime = Math.floor(Math.random() * 5) + 2;
        const newProcess: Process = {
            id,
            name: id.toUpperCase(),
            color: COLORS[processes.length % COLORS.length],
            burstTime,
            remainingTime: burstTime,
            status: 'ready'
        };
        setProcesses([...processes, newProcess]);
        setReadyQueue([...readyQueue, id]);
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
    }, [isPlaying, runningProcessId, readyQueue, currentQuantum, quantum, processes]);

    const step = () => {
        if (!runningProcessId) {
            if (readyQueue.length > 0) {
                const nextId = readyQueue[0];
                setRunningProcessId(nextId);
                setReadyQueue(prev => prev.slice(1));
                setCurrentQuantum(0);
                updateProcessStatus(nextId, 'running');
            } else if (finishedProcesses.length === processes.length) {
                setIsPlaying(false);
            }
            return;
        }

        const currentProcess = processes.find(p => p.id === runningProcessId)!;
        const newRemainingTime = Math.max(0, currentProcess.remainingTime - 1);
        const newQuantumCount = currentQuantum + 1;

        setTotalTime(prev => prev + 1);
        setProcesses(prev => prev.map(p =>
            p.id === runningProcessId ? { ...p, remainingTime: newRemainingTime } : p
        ));

        if (newRemainingTime === 0) {
            setFinishedProcesses(prev => [...prev, runningProcessId]);
            updateProcessStatus(runningProcessId, 'finished');
            setRunningProcessId(null);
            setCurrentQuantum(0);
        } else if (newQuantumCount >= quantum) {
            setReadyQueue(prev => [...prev, runningProcessId]);
            updateProcessStatus(runningProcessId, 'ready');
            setRunningProcessId(null);
            setCurrentQuantum(0);
        } else {
            setCurrentQuantum(newQuantumCount);
        }
    };

    const updateProcessStatus = (id: string, status: 'ready' | 'running' | 'finished') => {
        setProcesses(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };

    return (
        <SimulatorContainer>
            <SimulatorHeader>
                <SimulatorHeaderControls>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Quantum: {quantum}s</label>
                        <input
                            type="range" min="1" max="5" value={quantum}
                            onChange={(e) => setQuantum(parseInt(e.target.value))}
                            disabled={isPlaying}
                            className="w-24 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                    <SimulatorDivider />
                    <SimulatorMetric label="Global" value={`${totalTime}s`} />
                </SimulatorHeaderControls>

                <SimulatorHeaderActions>
                    <SimulatorButton
                        onClick={addProcess}
                        disabled={isPlaying || processes.length >= 6}
                    >
                        + Proc
                    </SimulatorButton>
                    <SimulatorButton
                        onClick={() => setIsPlaying(!isPlaying)}
                        variant={isPlaying ? "destructive" : "play"}
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </SimulatorButton>
                    <SimulatorButton onClick={reset} variant="icon">
                        <RotateCcw size={18} />
                    </SimulatorButton>
                </SimulatorHeaderActions>
            </SimulatorHeader>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                <div className="md:col-span-3 bg-muted/20 rounded-3xl border border-border p-4 relative overflow-hidden">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2">
                        <ListOrdered size={12} /> Cola de Listos
                    </div>
                    <div className="flex flex-wrap gap-3 items-center min-h-[80px]">
                        <AnimatePresence>
                            {readyQueue.map((id) => {
                                const p = processes.find(proc => proc.id === id)!;
                                return (
                                    <motion.div
                                        key={id}
                                        layoutId={id}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl relative"
                                        style={{ backgroundColor: p.color }}
                                    >
                                        {p.name}
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-background/80 backdrop-blur-sm rounded-full text-[8px] text-foreground flex items-center justify-center border border-border">
                                            {p.remainingTime}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="bg-blue-500/5 rounded-3xl border-2 border-dashed border-blue-500/20 p-4 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-[10px] font-bold text-primary/50 uppercase flex items-center gap-1">
                        <Cpu size={12} /> CPU
                    </div>
                    <AnimatePresence mode="wait">
                        {runningProcessId ? (
                            <motion.div
                                key={runningProcessId}
                                layoutId={runningProcessId}
                                className="w-20 h-20 rounded-3xl flex flex-col items-center justify-center text-white font-black text-3xl shadow-2xl z-10"
                                style={{ backgroundColor: processes.find(p => p.id === runningProcessId)!.color }}
                            >
                                {processes.find(p => p.id === runningProcessId)!.name}
                                <div className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-tighter">
                                    {currentQuantum + 1}/{quantum}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-muted-foreground uppercase tracking-widest font-black text-[10px]">Idle</div>
                        )}
                    </AnimatePresence>
                    {runningProcessId && (
                        <motion.div
                            animate={{ opacity: [0, 0.2, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute inset-0 bg-blue-500"
                        />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {processes.map(p => (
                    <div key={p.id} className={`p-2 rounded-2xl border transition-all ${p.status === 'finished' ? 'bg-green-500/10 border-green-500/20 grayscale-50 opacity-40' : 'bg-muted/20 border-border'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-foreground">{p.name}</span>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full mb-1">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: p.color }}
                                animate={{ width: `${(p.remainingTime / p.burstTime) * 100}%` }}
                            />
                        </div>
                        <div className="text-[8px] text-muted-foreground text-right font-mono">{p.remainingTime}/{p.burstTime}s</div>
                    </div>
                ))}
            </div>
        </SimulatorContainer>
    );
}

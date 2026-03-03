'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Play, RotateCcw, ArrowRightLeft } from 'lucide-react';
import {
    SimulatorContainer, SimulatorHeader, SimulatorHeaderControls,
    SimulatorHeaderActions, SimulatorButton, SimulatorMetric, SimulatorDivider
} from './ui/simulator';

export default function DiskSchedulingAnimation() {
    const [requests, setRequests] = useState<number[]>([20, 80, 40, 60, 10]);
    const [currentHead, setCurrentHead] = useState(50);
    const [visited, setVisited] = useState<number[]>([50]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [algorithm, setAlgorithm] = useState<'FCFS' | 'SSTF'>('FCFS');

    const addRequest = () => {
        if (requests.length >= 8) return;
        const newReq = Math.floor(Math.random() * 90) + 5;
        setRequests([...requests, newReq]);
    };

    const step = () => {
        if (requests.length === 0) {
            setIsProcessing(false);
            return;
        }

        let nextTarget: number;
        let newRequests = [...requests];

        if (algorithm === 'FCFS') {
            nextTarget = newRequests.shift()!;
        } else {
            // SSTF (Shortest Seek Time First)
            let closestIdx = 0;
            let minDistance = Math.abs(currentHead - newRequests[0]);
            for (let i = 1; i < newRequests.length; i++) {
                const dist = Math.abs(currentHead - newRequests[i]);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestIdx = i;
                }
            }
            nextTarget = newRequests.splice(closestIdx, 1)[0];
        }

        setCurrentHead(nextTarget);
        setVisited(prev => [...prev, nextTarget]);
        setRequests(newRequests);
    };

    useEffect(() => {
        if (isProcessing) {
            const timer = setTimeout(step, 1000);
            return () => clearTimeout(timer);
        }
    }, [isProcessing, requests]);

    const reset = () => {
        setIsProcessing(false);
        setRequests([20, 80, 40, 60, 10]);
        setCurrentHead(50);
        setVisited([50]);
    };

    return (
        <SimulatorContainer>
            <SimulatorHeader>
                <SimulatorHeaderControls>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Algoritmo</label>
                        <div className="flex gap-1 overflow-hidden p-1 bg-muted rounded-lg">
                            {(['FCFS', 'SSTF'] as const).map(alg => (
                                <button
                                    key={alg}
                                    onClick={() => setAlgorithm(alg)}
                                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${algorithm === alg ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground/60 hover:text-foreground'}`}
                                >
                                    {alg}
                                </button>
                            ))}
                        </div>
                    </div>
                    <SimulatorDivider />
                    <SimulatorMetric label="Cilindro Actual" value={currentHead} />
                </SimulatorHeaderControls>

                <SimulatorHeaderActions>
                    <SimulatorButton
                        onClick={addRequest}
                        disabled={isProcessing}
                    >
                        REQ+
                    </SimulatorButton>
                    <SimulatorButton
                        onClick={() => setIsProcessing(!isProcessing)}
                        variant={isProcessing ? "destructive" : "play"}
                    >
                        {isProcessing ? <ArrowRightLeft size={18} /> : <Play size={18} />}
                    </SimulatorButton>
                    <SimulatorButton onClick={reset} variant="icon">
                        <RotateCcw size={18} />
                    </SimulatorButton>
                </SimulatorHeaderActions>
            </SimulatorHeader>

            <div className="relative flex-1 bg-muted/20 rounded-3xl border border-border p-8 flex flex-col justify-center overflow-hidden">
                {/* Track Line */}
                <div className="relative h-2 w-full bg-border rounded-full mb-12">
                    {/* Cylinder Markers */}
                    {[0, 25, 50, 75, 100].map(m => (
                        <div key={m} className="absolute -top-1 w-px h-4 bg-border/50" style={{ left: `${m}%` }}>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-muted-foreground/40">{m}</span>
                        </div>
                    ))}

                    {/* Pending Requests */}
                    {requests.map((r, i) => (
                        <motion.div
                            key={`${r}-${i}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 w-6 h-6 bg-muted border border-border rounded-full flex items-center justify-center text-[10px] font-bold text-foreground/60 z-10"
                            style={{ left: `calc(${r}% - 12px)` }}
                        >
                            {r}
                        </motion.div>
                    ))}

                    {/* Current Head */}
                    <motion.div
                        animate={{ left: `calc(${currentHead}% - 16px)` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="absolute -top-12 w-8 h-20 flex flex-col items-center z-20"
                    >
                        <div className="w-8 h-8 rounded-xl bg-blue-500 shadow-xl shadow-blue-500/40 flex items-center justify-center text-white">
                            <Database size={16} />
                        </div>
                        <div className="w-0.5 h-12 bg-blue-500/50" />
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    </motion.div>
                </div>

                {/* Seek Graph */}
                <div className="h-32 flex items-end gap-1 px-4">
                    {visited.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${v}%` }}
                            className="flex-1 bg-gradient-to-t from-blue-500/20 to-blue-500/5 rounded-t-sm border-t border-blue-500/30"
                        />
                    ))}
                    {new Array(Math.max(0, 15 - visited.length)).fill(0).map((_, i) => (
                        <div key={i} className="flex-1" />
                    ))}
                </div>
                <div className="absolute bottom-4 left-8 text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                    Historial de Cilindros Visitados
                </div>
            </div>
        </SimulatorContainer>
    );
}

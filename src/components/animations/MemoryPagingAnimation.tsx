'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, LayoutTemplate, ArrowRight, Table, RefreshCcw, Cpu, HardDrive } from 'lucide-react';
import {
    SimulatorContainer, SimulatorHeader, SimulatorHeaderControls,
    SimulatorHeaderActions, SimulatorButton, SimulatorMetric, SimulatorDivider
} from './ui/simulator';

export default function MemoryPagingAnimation() {
    const [frames, setFrames] = useState<(string | null)[]>([null, null, null, null]);
    const [queue, setQueue] = useState<string[]>([]);
    const [faults, setFaults] = useState(0);
    const [history, setHistory] = useState<string[]>([]);

    // These states are new and implied by the SimulatorMetric components in the provided diff.
    // They are initialized to null/default values to ensure the code is syntactically correct.
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [selectedOffset, setSelectedOffset] = useState<string | null>(null);
    const [translatedFrame, setTranslatedFrame] = useState<string | null>(null);


    const pages = ['A', 'B', 'C', 'D', 'E'];

    const requestPage = (page: string) => {
        if (frames.includes(page)) {
            setHistory(prev => [`Hit: Página ${page} ya está en RAM`, ...prev].slice(0, 4));
            return;
        }

        // Page Fault
        setFaults(f => f + 1);
        setHistory(prev => [`Fault! Subiendo Página ${page} a RAM`, ...prev].slice(0, 4));

        let newFrames = [...frames];
        let newQueue = [...queue];

        const emptyIndex = newFrames.indexOf(null);
        if (emptyIndex !== -1) {
            newFrames[emptyIndex] = page;
            newQueue.push(page);
        } else {
            // FIFO Replacement
            const victim = newQueue.shift()!;
            const victimIndex = newFrames.indexOf(victim);
            newFrames[victimIndex] = page;
            newQueue.push(page);
        }

        setFrames(newFrames);
        setQueue(newQueue);
    };

    const reset = () => {
        setFrames([null, null, null, null]);
        setQueue([]);
        setFaults(0);
        setHistory([]);
        // Reset new states as well
        setSelectedPage(null);
        setSelectedOffset(null);
        setTranslatedFrame(null);
    };

    return (
        <SimulatorContainer>
            <SimulatorHeader>
                <SimulatorHeaderControls className="gap-8">
                    <SimulatorMetric
                        label="Lógico (CPU)"
                        value={
                            <div className="flex items-center gap-2">
                                <span className="text-primary">{selectedPage !== null ? selectedPage : '-'}</span>
                                <span className="text-muted-foreground/30 text-sm">|</span>
                                <span className="text-foreground/60">{selectedOffset !== null ? selectedOffset : '-'}</span>
                            </div>
                        }
                    />
                    <SimulatorDivider />
                    <SimulatorMetric
                        label="Físico (RAM)"
                        value={
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-500">{translatedFrame !== null ? translatedFrame : '-'}</span>
                                <span className="text-muted-foreground/30 text-sm">|</span>
                                <span className="text-foreground/60">{selectedOffset !== null ? selectedOffset : '-'}</span>
                            </div>
                        }
                    />
                </SimulatorHeaderControls>

                <SimulatorHeaderActions>
                    <div className="flex gap-1 mr-4">
                        {pages.map(p => (
                            <button
                                key={p}
                                onClick={() => {
                                    requestPage(p);
                                    setSelectedPage(p);
                                    setSelectedOffset('00');
                                    const frameIndex = frames.indexOf(p);
                                    if (frameIndex !== -1) {
                                        setTranslatedFrame(frameIndex.toString());
                                    } else {
                                        setTranslatedFrame('FAULT');
                                    }
                                }}
                                className="w-8 h-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-lg shadow-primary/20 transition-all active:scale-90"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <SimulatorButton onClick={reset} variant="icon">
                        <RefreshCcw size={18} />
                    </SimulatorButton>
                </SimulatorHeaderActions>
            </SimulatorHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                {/* Physical Memory */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/40 font-bold text-[10px] uppercase px-2">
                        <Cpu size={14} /> Memoria RAM (Frames)
                    </div>
                    <div className="grid grid-cols-2 gap-3 h-full">
                        {frames.map((f, i) => (
                            <div key={i} className="bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col items-center justify-center relative overflow-hidden h-24">
                                <div className="absolute top-2 left-2 text-[8px] font-bold text-white/20 tracking-tighter">FRAME {i}</div>
                                <AnimatePresence mode="wait">
                                    {f ? (
                                        <motion.div
                                            key={f}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/20"
                                        >
                                            {f}
                                        </motion.div>
                                    ) : (
                                        <div className="text-white/5 text-[10px] uppercase font-bold tracking-widest italic">Vaciando...</div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Disk & Stats */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/40 font-bold text-[10px] uppercase px-2">
                            <HardDrive size={14} /> Swap (Disco)
                        </div>
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-wrap gap-2 italic text-white/20 text-xs">
                            Páginas esperando solicitud del procesador...
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-white/40 uppercase px-2">Algoritmo: FIFO</div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 min-h-[120px] divide-y divide-white/5">
                            {history.map((h, i) => (
                                <div key={i} className={`py-2 text-xs font-medium ${i === 0 ? 'text-white' : 'text-white/40'}`}>
                                    {i === 0 ? '→ ' : '  '} {h}
                                </div>
                            ))}
                            {history.length === 0 && <div className="text-white/10 text-xs italic py-4">Sistema IDLE. Solicitá una página para empezar.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </SimulatorContainer>
    );
}

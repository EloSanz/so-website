'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Zap, TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import {
    SimulatorContainer, SimulatorHeader, SimulatorHeaderControls,
    SimulatorHeaderActions, SimulatorButton, SimulatorMetric, SimulatorDivider
} from './ui/simulator';

const PAGE_COLORS: Record<string, string> = {
    A: 'bg-blue-500', B: 'bg-violet-500', C: 'bg-emerald-500',
    D: 'bg-amber-500', E: 'bg-rose-500', F: 'bg-cyan-500', G: 'bg-pink-500',
};

function simulateFIFO(sequence: string[], frameCount: number): { faults: number; steps: { page: string; frames: (string | null)[]; fault: boolean }[] } {
    const frames: (string | null)[] = Array(frameCount).fill(null);
    const queue: string[] = [];
    let faults = 0;
    const steps: { page: string; frames: (string | null)[]; fault: boolean }[] = [];

    for (const page of sequence) {
        if (frames.includes(page)) {
            steps.push({ page, frames: [...frames], fault: false });
            continue;
        }
        faults++;
        const emptyIdx = frames.indexOf(null);
        if (emptyIdx !== -1) {
            frames[emptyIdx] = page;
            queue.push(page);
        } else {
            const victim = queue.shift()!;
            const victimIdx = frames.indexOf(victim);
            frames[victimIdx] = page;
            queue.push(page);
        }
        steps.push({ page, frames: [...frames], fault: true });
    }
    return { faults, steps };
}

function simulateLRU(sequence: string[], frameCount: number): { faults: number; steps: { page: string; frames: (string | null)[]; fault: boolean }[] } {
    const frames: (string | null)[] = Array(frameCount).fill(null);
    const lastUsed: Map<string, number> = new Map();
    let faults = 0;
    const steps: { page: string; frames: (string | null)[]; fault: boolean }[] = [];

    for (let t = 0; t < sequence.length; t++) {
        const page = sequence[t];
        lastUsed.set(page, t);
        if (frames.includes(page)) {
            steps.push({ page, frames: [...frames], fault: false });
            continue;
        }
        faults++;
        const emptyIdx = frames.indexOf(null);
        if (emptyIdx !== -1) {
            frames[emptyIdx] = page;
        } else {
            // find LRU among frames
            let lruPage = frames[0]!;
            let lruTime = lastUsed.get(lruPage) ?? -1;
            for (const f of frames) {
                if (f && (lastUsed.get(f) ?? -1) < lruTime) {
                    lruPage = f;
                    lruTime = lastUsed.get(f) ?? -1;
                }
            }
            const victimIdx = frames.indexOf(lruPage);
            frames[victimIdx] = page;
        }
        steps.push({ page, frames: [...frames], fault: true });
    }
    return { faults, steps };
}

export default function BeladyAnimation() {
    const [frameCount, setFrameCount] = useState(3);
    const [sequence, setSequence] = useState<string[]>(['A', 'B', 'C', 'D', 'A', 'B', 'E', 'A', 'B', 'C', 'D', 'E']);
    const [showResults, setShowResults] = useState(false);

    const pages = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    const addPage = (p: string) => {
        setSequence(prev => [...prev, p]);
        setShowResults(false);
    };

    const removeLast = () => {
        setSequence(prev => prev.slice(0, -1));
        setShowResults(false);
    };

    const reset = () => {
        setSequence([]);
        setShowResults(false);
    };

    const loadBelady = () => {
        setSequence(['A', 'B', 'C', 'D', 'A', 'B', 'E', 'A', 'B', 'C', 'D', 'E']);
        setShowResults(false);
    };

    // Results for multiple frame sizes
    const results = showResults ? [3, 4, 5].map(fc => ({
        frames: fc,
        fifo: simulateFIFO(sequence, fc),
        lru: simulateLRU(sequence, fc),
    })) : [];

    const fifoAnomaly = results.length >= 2 && results[1].fifo.faults > results[0].fifo.faults;

    return (
        <SimulatorContainer>
            <SimulatorHeader>
                <SimulatorHeaderControls className="gap-4">
                    <SimulatorMetric label="Secuencia" value={sequence.length} />
                    <SimulatorDivider />
                    <SimulatorMetric label="Frames Inicial" value={
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setFrameCount(Math.max(1, frameCount - 1))}
                                className="w-6 h-6 rounded bg-muted hover:bg-muted/80 text-xs font-bold"
                            >-</button>
                            <span className="w-6 text-center">{frameCount}</span>
                            <button
                                onClick={() => setFrameCount(Math.min(6, frameCount + 1))}
                                className="w-6 h-6 rounded bg-muted hover:bg-muted/80 text-xs font-bold"
                            >+</button>
                        </div>
                    } />
                </SimulatorHeaderControls>
                <SimulatorHeaderActions>
                    <SimulatorButton onClick={loadBelady} variant="default">
                        <Zap size={14} /> Belady
                    </SimulatorButton>
                    <SimulatorButton onClick={() => setShowResults(true)} variant="play" disabled={sequence.length === 0}>
                        <TrendingUp size={16} />
                    </SimulatorButton>
                    <SimulatorButton onClick={reset} variant="icon">
                        <RefreshCcw size={18} />
                    </SimulatorButton>
                </SimulatorHeaderActions>
            </SimulatorHeader>

            {/* Sequence builder */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase px-2">Armá tu secuencia:</div>
                    <div className="flex gap-1">
                        {pages.map(p => (
                            <button
                                key={p}
                                onClick={() => addPage(p)}
                                className={`w-8 h-8 rounded-lg ${PAGE_COLORS[p]} text-blue-200 font-black text-xs shadow-lg hover:scale-110 active:scale-90 transition-all`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button onClick={removeLast} className="p-1.5 rounded-lg bg-muted hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 transition-all" title="Borrar último">
                        <Trash2 size={14} />
                    </button>
                </div>
                {/* Current sequence */}
                <div className="flex flex-wrap gap-1 p-3 rounded-xl bg-muted/10 border border-border min-h-[40px]">
                    {sequence.length === 0 && <span className="text-muted-foreground/20 text-xs italic">Clickeá las letras para armar la secuencia de acceso a páginas...</span>}
                    {sequence.map((p, i) => (
                        <motion.span
                            key={`${i}-${p}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`w-7 h-7 rounded-md ${PAGE_COLORS[p]} text-blue-200 font-bold text-[10px] flex items-center justify-center shadow-md`}
                        >
                            {p}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Results comparison */}
            <AnimatePresence>
                {showResults && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 flex-1 overflow-auto"
                    >
                        {/* Summary table */}
                        <div className="rounded-2xl border border-border overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-muted/20">
                                        <th className="p-3 text-left text-muted-foreground font-bold uppercase text-[10px]">Frames</th>
                                        <th className="p-3 text-center text-muted-foreground font-bold uppercase text-[10px]">FIFO Faults</th>
                                        <th className="p-3 text-center text-muted-foreground font-bold uppercase text-[10px]">LRU Faults</th>
                                        <th className="p-3 text-center text-muted-foreground font-bold uppercase text-[10px]">Diferencia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((r, idx) => (
                                        <tr key={r.frames} className={`border-t border-border ${idx === 1 && fifoAnomaly ? 'bg-rose-500/10' : ''}`}>
                                            <td className="p-3 font-black text-foreground">{r.frames} frames</td>
                                            <td className="p-3 text-center">
                                                <span className={`font-black text-lg ${idx > 0 && r.fifo.faults > results[idx - 1].fifo.faults ? 'text-rose-400' : 'text-foreground'}`}>
                                                    {r.fifo.faults}
                                                </span>
                                                {idx > 0 && r.fifo.faults > results[idx - 1].fifo.faults && (
                                                    <TrendingUp className="inline ml-1 text-rose-400" size={14} />
                                                )}
                                                {idx > 0 && r.fifo.faults < results[idx - 1].fifo.faults && (
                                                    <TrendingDown className="inline ml-1 text-emerald-400" size={14} />
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className="font-black text-lg text-foreground">{r.lru.faults}</span>
                                                {idx > 0 && r.lru.faults <= results[idx - 1].lru.faults && (
                                                    <TrendingDown className="inline ml-1 text-emerald-400" size={14} />
                                                )}
                                            </td>
                                            <td className="p-3 text-center font-mono font-bold">
                                                {r.fifo.faults > r.lru.faults ? (
                                                    <span className="text-rose-400">FIFO +{r.fifo.faults - r.lru.faults}</span>
                                                ) : r.fifo.faults < r.lru.faults ? (
                                                    <span className="text-emerald-400">LRU +{r.lru.faults - r.fifo.faults}</span>
                                                ) : (
                                                    <span className="text-muted-foreground">Empate</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Anomaly alert */}
                        {fifoAnomaly && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium"
                            >
                                <span className="font-black">🚨 ¡Anomalía de Belady detectada!</span> FIFO con 4 frames tiene <strong>más</strong> fallos que con 3 frames.
                                Esto NO pasa con LRU porque es un algoritmo de pila (stack algorithm).
                            </motion.div>
                        )}

                        {/* Step-by-step for FIFO with 3 frames */}
                        <div className="space-y-2">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase px-2">Detalle FIFO — {results[0].frames} Frames</div>
                            <div className="flex flex-wrap gap-1">
                                {results[0].fifo.steps.map((s, i) => (
                                    <div key={i} className={`rounded-lg p-1.5 border text-center min-w-[50px] ${s.fault ? 'border-rose-500/30 bg-rose-500/10' : 'border-emerald-500/30 bg-emerald-500/10'}`}>
                                        <div className={`text-[9px] font-bold ${s.fault ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {s.fault ? 'FAULT' : 'HIT'}
                                        </div>
                                        <div className={`text-xs font-black ${PAGE_COLORS[s.page].replace('bg-', 'text-')}`}>{s.page}</div>
                                        <div className="text-[8px] text-muted-foreground/40 font-mono">
                                            [{s.frames.map(f => f || '·').join('')}]
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SimulatorContainer>
    );
}

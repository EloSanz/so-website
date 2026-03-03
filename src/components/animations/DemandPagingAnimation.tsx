'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Cpu, HardDrive, ArrowDown, ArrowUp, AlertTriangle, CheckCircle2, XCircle, Zap } from 'lucide-react';
import {
    SimulatorContainer, SimulatorHeader, SimulatorHeaderControls,
    SimulatorHeaderActions, SimulatorButton, SimulatorMetric, SimulatorDivider
} from './ui/simulator';

type Algorithm = 'FIFO' | 'LRU' | 'OPT';

interface PageEntry {
    page: string;
    frame: number;
    valid: boolean;
    dirty: boolean;
    refBit: boolean;
    loadOrder: number;
    lastUsed: number;
}

interface LogEntry {
    step: number;
    page: string;
    type: 'hit' | 'fault' | 'fault-replace';
    victim?: string;
    dirtyWrite?: boolean;
    message: string;
}

const DISK_PAGES = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];
const FRAME_COUNT = 4;
const PAGE_COLORS: Record<string, string> = {
    P0: 'from-blue-500 to-blue-600',
    P1: 'from-violet-500 to-violet-600',
    P2: 'from-emerald-500 to-emerald-600',
    P3: 'from-amber-500 to-amber-600',
    P4: 'from-rose-500 to-rose-600',
    P5: 'from-cyan-500 to-cyan-600',
    P6: 'from-pink-500 to-pink-600',
    P7: 'from-teal-500 to-teal-600',
};

const PAGE_SHADOW: Record<string, string> = {
    P0: 'shadow-blue-500/30',
    P1: 'shadow-violet-500/30',
    P2: 'shadow-emerald-500/30',
    P3: 'shadow-amber-500/30',
    P4: 'shadow-rose-500/30',
    P5: 'shadow-cyan-500/30',
    P6: 'shadow-pink-500/30',
    P7: 'shadow-teal-500/30',
};

export default function DemandPagingAnimation() {
    const [algorithm, setAlgorithm] = useState<Algorithm>('FIFO');
    const [pageTable, setPageTable] = useState<PageEntry[]>([]);
    const [faults, setFaults] = useState(0);
    const [hits, setHits] = useState(0);
    const [log, setLog] = useState<LogEntry[]>([]);
    const [stepCount, setStepCount] = useState(0);
    const [activeFrame, setActiveFrame] = useState<number | null>(null);
    const [lastAction, setLastAction] = useState<'hit' | 'fault' | 'fault-replace' | null>(null);
    const [sequence, setSequence] = useState<string[]>([]);

    // Generate frames array for display
    const frames: (PageEntry | null)[] = Array.from({ length: FRAME_COUNT }, (_, i) => {
        return pageTable.find(e => e.frame === i && e.valid) || null;
    });

    const findVictim = useCallback((table: PageEntry[], algo: Algorithm, futureSequence: string[]): number => {
        const validEntries = table.filter(e => e.valid);
        if (algo === 'FIFO') {
            // Oldest loaded page
            let oldest = validEntries[0];
            for (const entry of validEntries) {
                if (entry.loadOrder < oldest.loadOrder) oldest = entry;
            }
            return table.indexOf(oldest);
        } else if (algo === 'LRU') {
            // Least recently used
            let lru = validEntries[0];
            for (const entry of validEntries) {
                if (entry.lastUsed < lru.lastUsed) lru = entry;
            }
            return table.indexOf(lru);
        } else {
            // OPT: farthest future use
            let bestIdx = 0;
            let farthest = -1;
            for (let i = 0; i < validEntries.length; i++) {
                const nextUse = futureSequence.indexOf(validEntries[i].page);
                if (nextUse === -1) return table.indexOf(validEntries[i]); // never used again = perfect victim
                if (nextUse > farthest) {
                    farthest = nextUse;
                    bestIdx = i;
                }
            }
            return table.indexOf(validEntries[bestIdx]);
        }
    }, []);

    const requestPage = useCallback((page: string, isWrite: boolean = false) => {
        const newStep = stepCount + 1;
        setStepCount(newStep);
        setSequence(prev => [...prev, page]);

        setPageTable(prevTable => {
            const table = prevTable.map(e => ({ ...e }));
            const existing = table.find(e => e.page === page && e.valid);

            if (existing) {
                // HIT
                existing.lastUsed = newStep;
                existing.refBit = true;
                if (isWrite) existing.dirty = true;
                setHits(h => h + 1);
                setActiveFrame(existing.frame);
                setLastAction('hit');
                setLog(prev => [{
                    step: newStep, page, type: 'hit' as const,
                    message: `✅ Hit! ${page} ya está en Frame ${existing.frame}${isWrite ? ' (escritura → dirty)' : ''}`
                }, ...prev].slice(0, 8));
                return table;
            }

            // PAGE FAULT
            setFaults(f => f + 1);
            const usedFrames = table.filter(e => e.valid).map(e => e.frame);
            const freeFrame = Array.from({ length: FRAME_COUNT }, (_, i) => i).find(f => !usedFrames.includes(f));

            if (freeFrame !== undefined) {
                // Free frame available
                const newEntry: PageEntry = {
                    page, frame: freeFrame, valid: true, dirty: isWrite,
                    refBit: true, loadOrder: newStep, lastUsed: newStep
                };
                table.push(newEntry);
                setActiveFrame(freeFrame);
                setLastAction('fault');
                setLog(prev => [{
                    step: newStep, page, type: 'fault' as const,
                    message: `⚡ Page Fault! ${page} cargada en Frame ${freeFrame} (había frame libre)`
                }, ...prev].slice(0, 8));
                return table;
            }

            // Need replacement
            const futureSeq = [...sequence, page].slice(sequence.length);
            const victimIdx = findVictim(table, algorithm, futureSeq);
            const victim = table[victimIdx];
            const victimPage = victim.page;
            const victimFrame = victim.frame;
            const wasDirty = victim.dirty;

            // Invalidate victim
            victim.valid = false;

            // Load new page
            const newEntry: PageEntry = {
                page, frame: victimFrame, valid: true, dirty: isWrite,
                refBit: true, loadOrder: newStep, lastUsed: newStep
            };
            table.push(newEntry);
            setActiveFrame(victimFrame);
            setLastAction('fault-replace');
            setLog(prev => [{
                step: newStep, page, type: 'fault-replace' as const,
                victim: victimPage, dirtyWrite: wasDirty,
                message: `💥 Page Fault! Víctima: ${victimPage}${wasDirty ? ' (dirty → swap out a disco)' : ' (limpia → descartada)'}. ${page} → Frame ${victimFrame}`
            }, ...prev].slice(0, 8));
            return table;
        });
    }, [stepCount, algorithm, findVictim, sequence]);

    const reset = () => {
        setPageTable([]);
        setFaults(0);
        setHits(0);
        setLog([]);
        setStepCount(0);
        setActiveFrame(null);
        setLastAction(null);
        setSequence([]);
    };

    const runPresetSequence = () => {
        reset();
        const preset = ['P0', 'P1', 'P2', 'P3', 'P0', 'P1', 'P4', 'P0', 'P1', 'P2', 'P3', 'P4'];
        let i = 0;
        const interval = setInterval(() => {
            if (i >= preset.length) { clearInterval(interval); return; }
            requestPage(preset[i]);
            i++;
        }, 1200);
    };

    const total = hits + faults;
    const hitRate = total > 0 ? Math.round((hits / total) * 100) : 0;

    const pagesOnDisk = DISK_PAGES.filter(p => !pageTable.some(e => e.page === p && e.valid));

    return (
        <SimulatorContainer>
            <SimulatorHeader>
                <SimulatorHeaderControls className="gap-4">
                    <SimulatorMetric label="Algoritmo" value={
                        <div className="flex gap-1">
                            {(['FIFO', 'LRU', 'OPT'] as Algorithm[]).map(a => (
                                <button
                                    key={a}
                                    onClick={() => { setAlgorithm(a); reset(); }}
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${algorithm === a
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                        }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    } />
                    <SimulatorDivider />
                    <SimulatorMetric label="Faults" value={
                        <span className="text-rose-400">{faults}</span>
                    } />
                    <SimulatorMetric label="Hits" value={
                        <span className="text-emerald-400">{hits}</span>
                    } />
                    <SimulatorMetric label="Hit Rate" value={
                        <span className={hitRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}>{hitRate}%</span>
                    } />
                </SimulatorHeaderControls>

                <SimulatorHeaderActions>
                    <SimulatorButton onClick={runPresetSequence} variant="default">
                        <Zap size={14} /> Auto
                    </SimulatorButton>
                    <SimulatorButton onClick={reset} variant="icon">
                        <RefreshCcw size={18} />
                    </SimulatorButton>
                </SimulatorHeaderActions>
            </SimulatorHeader>

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 flex-1 min-h-0">
                {/* DISK */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-[10px] uppercase px-2">
                        <HardDrive size={14} /> Disco (Swap)
                    </div>
                    <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
                        {DISK_PAGES.map(p => {
                            const inRam = pageTable.some(e => e.page === p && e.valid);
                            return (
                                <div key={p} className="flex flex-col gap-1">
                                    <button
                                        onClick={() => requestPage(p)}
                                        disabled={inRam}
                                        className={`relative rounded-xl p-2 text-center transition-all ${inRam
                                            ? 'bg-muted/20 border border-dashed border-muted-foreground/20 opacity-30 cursor-not-allowed'
                                            : `bg-gradient-to-br ${PAGE_COLORS[p]} text-white shadow-lg ${PAGE_SHADOW[p]} hover:scale-105 active:scale-95 cursor-pointer`
                                            }`}
                                    >
                                        <div className="text-xs font-black text-blue-400">{p}</div>
                                        {inRam && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-[8px] font-bold text-muted-foreground">EN RAM</span>
                                            </div>
                                        )}
                                    </button>
                                    <div className="flex justify-center gap-0.5">
                                        <button
                                            onClick={() => requestPage(p, true)}
                                            className="text-[8px] px-1.5 py-0.5 rounded bg-muted/40 hover:bg-orange-500/30 text-muted-foreground hover:text-orange-400 transition-all font-bold"
                                            title="Escribir (marca dirty)"
                                        >
                                            W
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RAM FRAMES + PAGE TABLE */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-[10px] uppercase px-2">
                        <Cpu size={14} /> RAM — {FRAME_COUNT} Frames
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {frames.map((entry, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    borderColor: activeFrame === i && lastAction
                                        ? lastAction === 'hit' ? 'rgb(52, 211, 153)' : 'rgb(244, 63, 94)'
                                        : 'rgba(255,255,255,0.05)'
                                }}
                                transition={{ duration: 0.3 }}
                                className="rounded-2xl border-2 bg-muted/10 p-3 flex flex-col items-center justify-center relative overflow-hidden min-h-[100px]"
                            >
                                <div className="absolute top-1.5 left-2 text-[8px] font-bold text-muted-foreground/40 tracking-tighter">
                                    F{i}
                                </div>
                                <AnimatePresence mode="wait">
                                    {entry ? (
                                        <motion.div
                                            key={entry.page}
                                            initial={{ y: 30, opacity: 0, scale: 0.8 }}
                                            animate={{ y: 0, opacity: 1, scale: 1 }}
                                            exit={{ y: -30, opacity: 0, scale: 0.8 }}
                                            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                                            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${PAGE_COLORS[entry.page]} flex items-center justify-center font-black text-sm shadow-xl ${PAGE_SHADOW[entry.page]}`}
                                        >
                                            <span className="text-blue-200">{entry.page}</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-muted-foreground/10 text-[9px] uppercase font-bold tracking-widest"
                                        >
                                            Libre
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {/* Bits below frame */}
                                {entry && (
                                    <div className="flex gap-2 mt-2">
                                        <span className={`text-[8px] font-bold px-1 rounded ${entry.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                            V={entry.valid ? '1' : '0'}
                                        </span>
                                        <span className={`text-[8px] font-bold px-1 rounded ${entry.dirty ? 'bg-orange-500/20 text-orange-400' : 'bg-muted/30 text-muted-foreground/50'}`}>
                                            D={entry.dirty ? '1' : '0'}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Sequence strip */}
                    {sequence.length > 0 && (
                        <div className="mt-2 p-3 rounded-xl bg-muted/10 border border-border">
                            <div className="text-[9px] font-bold text-muted-foreground/50 uppercase mb-1.5">Secuencia de accesos</div>
                            <div className="flex flex-wrap gap-1">
                                {sequence.map((p, i) => {
                                    const wasHit = log.find(l => l.step === i + 1)?.type === 'hit';
                                    return (
                                        <span
                                            key={i}
                                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${wasHit
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-rose-500/20 text-rose-400'
                                                }`}
                                        >
                                            {p}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* LOG */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-[10px] uppercase px-2">
                        <AlertTriangle size={14} /> Event Log
                    </div>
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                        <AnimatePresence initial={false}>
                            {log.map((entry, i) => (
                                <motion.div
                                    key={entry.step}
                                    initial={{ opacity: 0, x: 20, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                                    className={`text-[11px] font-medium p-2.5 rounded-xl border ${i === 0
                                        ? entry.type === 'hit'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                            : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                                        : 'bg-muted/5 border-border text-muted-foreground/60'
                                        }`}
                                >
                                    <span className="text-muted-foreground/30 mr-1">#{entry.step}</span>
                                    {entry.message}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {log.length === 0 && (
                            <div className="text-muted-foreground/20 text-xs italic py-8 text-center">
                                Hacé click en una página del disco para solicitar su carga en RAM
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SimulatorContainer>
    );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, ArrowRight, Search, Zap } from 'lucide-react';
import {
    SimulatorContainer, SimulatorHeader, SimulatorHeaderControls,
    SimulatorHeaderActions, SimulatorButton, SimulatorMetric, SimulatorDivider
} from './ui/simulator';

interface TranslationResult {
    logicalAddr: number;
    pageNum: number;
    offset: number;
    tlbHit: boolean;
    frame: number | null;
    pageFault: boolean;
    physicalAddr: number | null;
    steps: { text: string; type: 'info' | 'hit' | 'miss' | 'fault' }[];
}

const PAGE_TABLE: (number | null)[] = [
    5, null, 8, 3, null, 12, null, 7,
    null, 1, null, 9, null, 4, null, 11,
];

const PAGE_SIZE = 256;

export default function MMUTranslatorAnimation() {
    const [inputAddr, setInputAddr] = useState('');
    const [tlb, setTlb] = useState([
        { page: 0, frame: 5, valid: true },
        { page: 3, frame: 3, valid: true },
        { page: 7, frame: 7, valid: true },
        { page: 11, frame: 9, valid: false },
    ]);
    const [result, setResult] = useState<TranslationResult | null>(null);
    const [currentStep, setCurrentStep] = useState(-1);
    const [autoPlaying, setAutoPlaying] = useState(false);

    const translate = (addrStr: string) => {
        const addr = parseInt(addrStr);
        if (isNaN(addr) || addr < 0 || addr >= PAGE_SIZE * PAGE_TABLE.length) return;

        const pageNum = Math.floor(addr / PAGE_SIZE);
        const offset = addr % PAGE_SIZE;
        const steps: { text: string; type: 'info' | 'hit' | 'miss' | 'fault' }[] = [];

        steps.push({ text: `Dirección lógica: ${addr}`, type: 'info' });
        steps.push({ text: `Página = ${addr} ÷ ${PAGE_SIZE} = ${pageNum} | Offset = ${addr} mod ${PAGE_SIZE} = ${offset}`, type: 'info' });

        const tlbEntry = tlb.find(e => e.page === pageNum && e.valid);
        let frame: number | null = null;
        let tlbHit = false;
        let pageFault = false;

        if (tlbEntry) {
            tlbHit = true;
            frame = tlbEntry.frame;
            steps.push({ text: `¡TLB Hit! Página ${pageNum} → Frame ${frame}`, type: 'hit' });
        } else {
            steps.push({ text: `TLB Miss → buscando en la MPT...`, type: 'miss' });
            const ptEntry = PAGE_TABLE[pageNum];
            if (ptEntry !== null) {
                frame = ptEntry;
                steps.push({ text: `MPT[${pageNum}] = Frame ${frame} (válida ✓)`, type: 'hit' });
                const newTlb = [...tlb];
                const replaceIdx = newTlb.findIndex(e => !e.valid);
                const idx = replaceIdx !== -1 ? replaceIdx : 0;
                newTlb[idx] = { page: pageNum, frame, valid: true };
                setTlb(newTlb);
                steps.push({ text: `TLB actualizado: entrada ${idx} ← Pág ${pageNum}`, type: 'info' });
            } else {
                pageFault = true;
                steps.push({ text: `MPT[${pageNum}] = INVÁLIDA → ¡PAGE FAULT!`, type: 'fault' });
                steps.push({ text: `El SO debe traer la página ${pageNum} desde disco`, type: 'fault' });
            }
        }

        let physicalAddr: number | null = null;
        if (frame !== null) {
            physicalAddr = frame * PAGE_SIZE + offset;
            steps.push({ text: `Dir. Física = F${frame} × ${PAGE_SIZE} + ${offset} = ${physicalAddr}`, type: 'hit' });
        }

        const res: TranslationResult = { logicalAddr: addr, pageNum, offset, tlbHit, frame, pageFault, physicalAddr, steps };
        setResult(res);
        setCurrentStep(-1);

        setAutoPlaying(true);
        let step = 0;
        const interval = setInterval(() => {
            if (step >= res.steps.length) { clearInterval(interval); setAutoPlaying(false); return; }
            setCurrentStep(step);
            step++;
        }, 1000);
    };

    const reset = () => {
        setResult(null);
        setCurrentStep(-1);
        setTlb([
            { page: 0, frame: 5, valid: true },
            { page: 3, frame: 3, valid: true },
            { page: 7, frame: 7, valid: true },
            { page: 11, frame: 9, valid: false },
        ]);
    };

    const tryRandom = () => {
        const addr = Math.floor(Math.random() * PAGE_SIZE * PAGE_TABLE.length);
        setInputAddr(addr.toString());
        translate(addr.toString());
    };

    const stepColors = { info: 'bg-muted/20 border-border text-foreground', hit: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', miss: 'bg-amber-500/10 border-amber-500/30 text-amber-400', fault: 'bg-rose-500/10 border-rose-500/30 text-rose-400' };

    return (
        <SimulatorContainer>
            <SimulatorHeader>
                <SimulatorHeaderControls className="gap-4">
                    <SimulatorMetric label="Tamaño Pág" value={`${PAGE_SIZE}B`} />
                    <SimulatorDivider />
                    <SimulatorMetric label="Páginas" value={PAGE_TABLE.length} />
                </SimulatorHeaderControls>
                <SimulatorHeaderActions>
                    <input
                        type="number"
                        value={inputAddr}
                        onChange={e => setInputAddr(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && translate(inputAddr)}
                        placeholder="Dir. lógica"
                        className="w-24 px-2 py-1.5 rounded-lg bg-muted border border-border text-xs font-mono text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-primary"
                        min={0} max={PAGE_SIZE * PAGE_TABLE.length - 1}
                    />
                    <SimulatorButton onClick={() => translate(inputAddr)} variant="play" disabled={!inputAddr || autoPlaying}>
                        <Search size={16} />
                    </SimulatorButton>
                    <SimulatorButton onClick={tryRandom} variant="default" disabled={autoPlaying}>
                        <Zap size={14} /> Random
                    </SimulatorButton>
                    <SimulatorButton onClick={reset} variant="icon">
                        <RefreshCcw size={18} />
                    </SimulatorButton>
                </SimulatorHeaderActions>
            </SimulatorHeader>

            {/* Main content — stacks on mobile */}
            <div className="flex flex-col gap-4 flex-1 min-h-0">
                {/* Step-by-step translation — the main focus */}
                <div className="space-y-2 min-h-[60px]">
                    {result ? (
                        <AnimatePresence initial={false}>
                            {result.steps.map((step, i) => (
                                i <= currentStep && (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20, height: 0 }}
                                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                                        className={`p-3 rounded-xl border text-sm font-medium ${stepColors[step.type]}`}
                                    >
                                        <span className="font-bold mr-2 text-muted-foreground/40">#{i + 1}</span>
                                        {step.text}
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="text-muted-foreground/30 text-sm italic py-6 text-center">
                            Ingresá una dirección lógica (0–{PAGE_SIZE * PAGE_TABLE.length - 1}) y mirá cómo la MMU la traduce paso a paso
                        </div>
                    )}
                </div>

                {/* Final result card */}
                {result && currentStep >= result.steps.length - 1 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-2xl border-2 ${result.pageFault ? 'border-rose-500/40 bg-rose-500/10' : 'border-emerald-500/40 bg-emerald-500/10'}`}
                    >
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <div className="text-center">
                                <div className="text-[9px] text-muted-foreground uppercase font-bold">Lógica</div>
                                <div className="text-xl font-black text-primary font-mono">{result.logicalAddr}</div>
                                <div className="text-[10px] text-muted-foreground font-mono">Pág {result.pageNum} : Off {result.offset}</div>
                            </div>
                            <ArrowRight size={20} className="text-muted-foreground/30" />
                            <div className="text-center">
                                <div className="text-[9px] text-muted-foreground uppercase font-bold">Física</div>
                                <div className={`text-xl font-black font-mono ${result.pageFault ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {result.physicalAddr ?? 'PAGE FAULT'}
                                </div>
                                {result.frame !== null && (
                                    <div className="text-[10px] text-muted-foreground font-mono">Frame {result.frame} : Off {result.offset}</div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-3">
                            {result.tlbHit ? (
                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">TLB HIT</span>
                            ) : (
                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">TLB MISS</span>
                            )}
                            {result.pageFault && (
                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-rose-500/20 text-rose-400">PAGE FAULT</span>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* TLB + Page Table side by side */}
                <div className="grid grid-cols-2 gap-3">
                    {/* TLB */}
                    <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase px-1">TLB (Caché)</div>
                        {tlb.map((entry, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    borderColor: result && result.tlbHit && result.pageNum === entry.page && entry.valid
                                        ? 'rgb(52, 211, 153)' : 'rgba(255,255,255,0.05)'
                                }}
                                className="flex items-center justify-between p-2 rounded-lg bg-muted/10 border-2 text-xs"
                            >
                                <span className={`text-[8px] font-bold px-1 rounded ${entry.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    {entry.valid ? 'V' : 'I'}
                                </span>
                                <span className="font-mono font-bold text-foreground">P{entry.page}</span>
                                <ArrowRight size={10} className="text-muted-foreground/30" />
                                <span className="font-mono font-bold text-primary">F{entry.frame}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Page Table — compact grid */}
                    <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase px-1">MPT</div>
                        <div className="grid grid-cols-2 gap-0.5">
                            {PAGE_TABLE.map((frame, page) => {
                                const isActive = result && result.pageNum === page && !result.tlbHit;
                                return (
                                    <div
                                        key={page}
                                        className={`flex items-center gap-1 px-1.5 py-1 rounded text-[10px] ${isActive ? (frame !== null ? 'bg-emerald-500/15 ring-1 ring-emerald-500/40' : 'bg-rose-500/15 ring-1 ring-rose-500/40') : ''}`}
                                    >
                                        <span className="font-mono text-muted-foreground/50 w-5">P{page}</span>
                                        <span className={`font-bold ${frame !== null ? 'text-emerald-400' : 'text-rose-400/50'}`}>
                                            {frame !== null ? `F${frame}` : '✗'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </SimulatorContainer>
    );
}

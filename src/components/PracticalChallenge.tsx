'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lightbulb, Eye, EyeOff, CheckCircle2, Trophy, Code2 } from 'lucide-react';
import { PracticalChallenge as PracticalChallengeType } from '@/lib/data/types';
import { cn } from '@/lib/utils';

interface PracticalChallengeProps {
    challenge: PracticalChallengeType;
}

export const PracticalChallenge: React.FC<PracticalChallengeProps> = ({ challenge }) => {
    const [showHints, setShowHints] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    return (
        <section id="challenge" className="my-16 scroll-mt-24">
            <div className="relative group">
                {/* Background Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

                <div className="relative flex flex-col gap-8 p-10 rounded-[2.5rem] bg-card border border-border/50 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-inner">
                                <Trophy className="w-6 h-6 text-amber-500" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-500/80">Desafío Práctico</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground">
                            {challenge.title}
                        </h2>
                        <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-3xl">
                            {challenge.description}
                        </p>
                    </div>

                    {/* Task Card */}
                    <div className="p-8 rounded-3xl bg-muted/30 border border-border/40 backdrop-blur-sm relative overflow-hidden group/task">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/task:opacity-10 transition-opacity">
                            <Terminal className="w-24 h-24 rotate-12" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            La Misión
                        </h3>
                        <p className="text-foreground/80 leading-relaxed font-medium italic">
                            "{challenge.task}"
                        </p>
                    </div>

                    {/* Hints & Solution Buttons */}
                    <div className="flex flex-wrap gap-4">
                        {challenge.hints && challenge.hints.length > 0 && (
                            <button
                                onClick={() => setShowHints(!showHints)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 border-2",
                                    showHints
                                        ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                                        : "bg-muted/50 border-transparent text-muted-foreground hover:border-amber-500/30 hover:text-amber-500"
                                )}
                            >
                                <Lightbulb className={cn("w-4 h-4 transition-transform", showHints && "rotate-12")} />
                                {showHints ? 'Ocultar Pistas' : '¿Necesitás una ayuda?'}
                            </button>
                        )}

                        {challenge.solutionCode && (
                            <button
                                onClick={() => setShowSolution(!showSolution)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 border-2",
                                    showSolution
                                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
                                        : "bg-primary border-transparent text-primary-foreground hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                                )}
                            >
                                {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {showSolution ? 'Ocultar Solución' : 'Ver la Solución'}
                            </button>
                        )}
                    </div>

                    {/* Hints Content */}
                    <AnimatePresence>
                        {showHints && challenge.hints && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid gap-3 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                                    {challenge.hints.map((hint, idx) => (
                                        <div key={idx} className="flex gap-3 text-sm text-foreground/80 font-medium leading-relaxed">
                                            <span className="text-amber-500/50 mt-1">•</span>
                                            {hint}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Solution Content */}
                    <AnimatePresence>
                        {showSolution && challenge.solutionCode && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="rounded-3xl overflow-hidden border border-emerald-500/20 bg-[#0d1117] relative">
                                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                            {challenge.solutionCode.language}
                                        </span>
                                    </div>
                                    <div className="p-8 pt-12 overflow-x-auto">
                                        <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                                            <code>{challenge.solutionCode.code}</code>
                                        </pre>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

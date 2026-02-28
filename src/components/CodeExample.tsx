'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, EyeOff, Terminal } from 'lucide-react';

interface CodeExampleProps {
    language: string;
    snippet: string;
    revealQuestion?: string;
    revealAnswer?: string;
}

export const CodeExample: React.FC<CodeExampleProps> = ({
    language,
    snippet,
    revealQuestion,
    revealAnswer
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="my-8 rounded-[2rem] overflow-hidden border border-border/50 bg-[#0d1117] shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 bg-muted/5 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                        <Terminal className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground font-bold tracking-widest uppercase">{language}</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/10" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/10" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/10" />
                </div>
            </div>

            <div className="p-8 overflow-x-auto bg-[#0d1117]">
                <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                    <code>{snippet}</code>
                </pre>
            </div>

            {(revealQuestion || revealAnswer) && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-8 text-left border-t border-border/50 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden"
                >
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-emerald-500/20' : 'bg-primary/10 group-hover:bg-primary/20'}`}>
                                <Play className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'text-emerald-400 rotate-90' : 'text-primary'}`} />
                            </div>
                            <span className="text-sm font-bold text-foreground/90 tracking-tight">
                                {revealQuestion || "¿Qué muestra la consola?"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                            <span className="text-[10px] font-bold tracking-widest uppercase mr-1">{isOpen ? 'OCULTAR' : 'REVELAR'}</span>
                            {isOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, y: 10 }}
                                animate={{ height: 'auto', opacity: 1, y: 0 }}
                                exit={{ height: 0, opacity: 0, y: 10 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="overflow-hidden relative z-10"
                            >
                                <div className="mt-6 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                    <p className="text-lg font-bold text-emerald-400/90 leading-relaxed">
                                        {revealAnswer}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 text-[11px] font-bold text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors uppercase tracking-[0.2em]"
                        >
                            Hacé click para ver la magia...
                        </motion.div>
                    )}
                </button>
            )}
        </div>
    );
};

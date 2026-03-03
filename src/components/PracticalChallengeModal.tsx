'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Terminal, CheckCircle2, Lightbulb, Eye, EyeOff } from 'lucide-react';
import { PracticalChallenge as PracticalChallengeType } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { Modal, ModalOverlay, ModalContent, ModalBody } from './ui/modal';
import { CodeWindow, CodeBlock } from './ui/code-window';

interface PracticalChallengeModalProps {
    challenge: PracticalChallengeType;
    isOpen: boolean;
    onClose: () => void;
}

export const PracticalChallengeModal: React.FC<PracticalChallengeModalProps> = ({ challenge, isOpen, onClose }) => {
    const [showHints, setShowHints] = React.useState(false);
    const [showSolution, setShowSolution] = React.useState(false);

    // Prevent scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay onClose={onClose} />
            <ModalContent className="max-w-4xl max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors z-50 pointer-events-auto"
                >
                    <X className="w-6 h-6 text-muted-foreground" />
                </button>
                <ModalBody className="p-6 md:p-10">

                    <div className="flex flex-col gap-8">
                        {/* Header */}
                        <div className="flex flex-col gap-4 pr-12">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-inner">
                                    <Trophy className="w-6 h-6 text-amber-500" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-500/80 tracking-widest">Desafío Práctico</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tight text-foreground">
                                {challenge.title}
                            </h2>
                            <p className="text-lg text-muted-foreground/90 leading-relaxed">
                                {challenge.description}
                            </p>
                        </div>

                        {/* Task Card */}
                        <div className="p-8 rounded-3xl bg-muted/30 border border-border/40 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Terminal className="w-24 h-24 rotate-12" />
                            </div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                                <CheckCircle2 className="w-5 h-5" />
                                La Misión
                            </h3>
                            <p className="text-foreground/90 leading-relaxed font-medium italic text-lg">
                                "{challenge.task}"
                            </p>
                        </div>

                        {/* Interactions */}
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

                        {/* Content Areas */}
                        <AnimatePresence>
                            {showHints && challenge.hints && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid gap-3 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                                        <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Lightbulb className="w-3.5 h-3.5" />
                                            Pistas del Profe
                                        </h4>
                                        {challenge.hints.map((hint, idx) => (
                                            <div key={idx} className="flex gap-4 text-base text-foreground/80 font-medium leading-relaxed">
                                                <span className="text-amber-500/50 mt-1 flex-shrink-0">•</span>
                                                {hint}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {showSolution && challenge.solutionCode && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <CodeWindow language={challenge.solutionCode.language} variant="code" className="rounded-3xl border-emerald-500/20">
                                        <CodeBlock>{challenge.solutionCode.code}</CodeBlock>
                                    </CodeWindow>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

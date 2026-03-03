'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, Play, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InterruptAnimation from './InterruptAnimation';
import { cn } from '@/lib/utils';
import { ProcessStateSimulator } from './ProcessStateSimulator';
import RoundRobinAnimation from './RoundRobinAnimation';
import DeadlockAnimation from './DeadlockAnimation';
import MemoryPagingAnimation from './MemoryPagingAnimation';
import DiskSchedulingAnimation from './DiskSchedulingAnimation';
import SJFAnimation from './SJFAnimation';
import DemandPagingAnimation from './DemandPagingAnimation';
import BeladyAnimation from './BeladyAnimation';
import MMUTranslatorAnimation from './MMUTranslatorAnimation';

interface Animation {
    id: string;
    title: string;
    description: string;
    instructions?: string[];
}

interface Props {
    animations: Animation[];
}

export default function AnimationLab({ animations }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const next = () => setCurrentIndex((prev) => (prev + 1) % animations.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + animations.length) % animations.length);

    const currentAnimation = animations[currentIndex];

    const renderComponent = (animId: string) => {
        // Map animation IDs to components
        switch (animId) {
            case 'interrupt': return <InterruptAnimation />;
            case 'process-states': return <ProcessStateSimulator />;
            case 'rr': return <RoundRobinAnimation />;
            case 'deadlock': return <DeadlockAnimation />;
            case 'paging': return <MemoryPagingAnimation />;
            case 'disk': return <DiskSchedulingAnimation />;
            case 'sjf': return <SJFAnimation />;
            case 'demand-paging': return <DemandPagingAnimation />;
            case 'belady-visualizer': return <BeladyAnimation />;
            case 'mmu-translator': return <MMUTranslatorAnimation />;
            default: return (
                <div className="text-center space-y-4 opacity-40 py-20">
                    <Play className="w-12 h-12 mx-auto" />
                    <p className="text-sm font-medium italic">Animación "{animId}" en desarrollo...</p>
                </div>
            );
        }
    };

    return (
        <>
            {/* Blurred backdrop over the whole page */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md cursor-pointer"
                    />
                )}
            </AnimatePresence>

            <div className={cn(
                "rounded-3xl border flex flex-col overflow-hidden min-h-[500px] w-full transition-all duration-300",
                isModalOpen ? "relative z-[70] bg-card shadow-2xl shadow-primary/20 ring-1 ring-primary/20" : "bg-card border-border shadow-2xl shadow-primary/5"
            )}>
                {/* Header with Navigation */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold">{currentAnimation.title}</h3>
                            <p className="text-xs text-muted-foreground">{currentAnimation.description}</p>
                        </div>
                    </div>

                    {animations.length > 1 && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground mr-2 tabular-nums">
                                {currentIndex + 1} / {animations.length}
                            </span>
                            {currentAnimation.instructions && currentAnimation.instructions.length > 0 && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="p-2 rounded-lg hover:bg-muted transition-colors border border-border text-blue-400 hover:text-blue-300 mr-2"
                                    title="Instrucciones"
                                >
                                    <Info size={16} />
                                </button>
                            )}
                            <button
                                onClick={prev}
                                className="p-2 rounded-lg hover:bg-muted transition-colors border border-border"
                                title="Anterior"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={next}
                                className="p-2 rounded-lg hover:bg-muted transition-colors border border-border"
                                title="Siguiente"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content & Side Panel Wrapper */}
                <div className="flex-1 flex w-full relative overflow-hidden">
                    {/* Content Area */}
                    <div className="flex-1 flex items-center justify-center bg-muted/10 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentAnimation.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="w-full max-w-4xl h-full flex items-center justify-center p-4 md:p-8"
                            >
                                {renderComponent(currentAnimation.id)}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Side Info Panel previously here */}
                </div>
            </div>

            {/* Fixed Drawer Side Panel */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-card border-l border-border shadow-2xl z-[80] flex flex-col"
                    >
                        {/* Panel Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <Info className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold leading-tight">Instrucciones</h3>
                                    <p className="text-xs text-muted-foreground">{currentAnimation.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto w-full p-6 no-scrollbar">
                            <div className="space-y-6">
                                {currentAnimation.instructions?.map((instruction, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold border border-primary/20">
                                            {idx + 1}
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                                            {instruction}
                                        </p>
                                    </div>
                                ))}
                                {(!currentAnimation.instructions || currentAnimation.instructions.length === 0) && (
                                    <p className="text-sm text-muted-foreground text-center py-8 italic">
                                        No hay instrucciones detalladas para esta animación.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

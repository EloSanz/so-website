'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InterruptAnimation from './InterruptAnimation';
import { ProcessStateSimulator } from './ProcessStateSimulator';
import RoundRobinAnimation from './RoundRobinAnimation';
import DeadlockAnimation from './DeadlockAnimation';
import MemoryPagingAnimation from './MemoryPagingAnimation';
import DiskSchedulingAnimation from './DiskSchedulingAnimation';
import SJFAnimation from './SJFAnimation';

interface Animation {
    id: string;
    title: string;
    description: string;
}

interface Props {
    animations: Animation[];
}

export default function AnimationLab({ animations }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

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
            default: return (
                <div className="text-center space-y-4 opacity-40 py-20">
                    <Play className="w-12 h-12 mx-auto" />
                    <p className="text-sm font-medium italic">Animación "{animId}" en desarrollo...</p>
                </div>
            );
        }
    };

    return (
        <div className="rounded-3xl bg-card border border-border shadow-2xl shadow-primary/5 flex flex-col overflow-hidden min-h-[500px] w-full">
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

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center bg-muted/10 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] overflow-hidden">
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
        </div>
    );
}

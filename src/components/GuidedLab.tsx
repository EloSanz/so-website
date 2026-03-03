'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, CheckCircle2, FlaskConical, Info } from 'lucide-react';
import { GuidedLab as GuidedLabType, LabStep } from '../lib/data/types';
import { cn } from '@/lib/utils';
import { CodeWindow, CodeBlock, TerminalCommand } from './ui/code-window';

interface GuidedLabProps {
    lab: GuidedLabType;
}

export const GuidedLab: React.FC<GuidedLabProps> = ({ lab }) => {
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const currentStep = lab.steps[activeStepIndex];

    const difficultyColors = {
        'Fácil': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        'Medio': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        'Duro': 'text-rose-400 bg-rose-400/10 border-rose-400/20'
    };

    return (
        <div className="my-12 relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
                            <FlaskConical className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">{lab.title}</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-2xl">{lab.description}</p>
                </div>
                <div className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold border w-fit",
                    difficultyColors[lab.difficulty]
                )}>
                    Nivel: {lab.difficulty}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Steps Navigation (Left Rail) */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <BookOpen className="w-3 h-3" />
                        Pasos del Laboratorio
                    </div>
                    {lab.steps.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => setActiveStepIndex(index)}
                            className={cn(
                                "w-full text-left p-4 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
                                activeStepIndex === index
                                    ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5"
                                    : "bg-muted/5 border-border/50 hover:border-border hover:bg-muted/10"
                            )}
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={cn(
                                    "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors",
                                    activeStepIndex === index
                                        ? "bg-primary text-white"
                                        : "bg-muted border border-border group-hover:bg-muted-foreground/10"
                                )}>
                                    {index + 1}
                                </div>
                                <div className="flex flex-col">
                                    <span className={cn(
                                        "text-sm font-bold transition-colors",
                                        activeStepIndex === index ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                                    )}>
                                        {step.title}
                                    </span>
                                </div>
                                {activeStepIndex === index && (
                                    <motion.div layoutId="activeStep" className="absolute inset-0 bg-primary/5 z-0" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Step Content (Right Area) */}
                <div className="lg:col-span-8 space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Step Description Card */}
                            <div className="p-8 rounded-[2rem] bg-card border border-border shadow-sm">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <ChevronRight className="w-5 h-5 text-primary" />
                                    {currentStep.title}
                                </h3>
                                <p className="text-foreground/80 leading-relaxed mb-6">
                                    {currentStep.description}
                                </p>

                                {/* Code/Terminal Area */}
                                {currentStep.command && (
                                    <CodeWindow variant="terminal" className="mb-6">
                                        <TerminalCommand command={currentStep.command} />
                                    </CodeWindow>
                                )}

                                {currentStep.code && (
                                    <CodeWindow language="Código C" variant="code" className="mb-6">
                                        <CodeBlock>{currentStep.code}</CodeBlock>
                                    </CodeWindow>
                                )}

                                {/* Technical Explanation */}
                                <div className="space-y-4 pt-6 mt-6 border-t border-border/50">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-xl bg-amber-500/10 flex-shrink-0">
                                            <Info className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-foreground mb-1">Explicación para el Examen</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {currentStep.explanation}
                                            </p>
                                        </div>
                                    </div>

                                    {currentStep.technicalDetail && (
                                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                            <p className="text-xs text-primary/80 font-medium leading-relaxed italic">
                                                Pro-tip: {currentStep.technicalDetail}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Navigation Buttons for Steps */}
                            <div className="flex justify-between items-center px-2">
                                <button
                                    onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                                    disabled={activeStepIndex === 0}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold border border-border bg-card hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Paso Anterior
                                </button>
                                {activeStepIndex === lab.steps.length - 1 ? (
                                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-6 py-2.5 rounded-xl border border-emerald-500/20">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Laboratorio Completado
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setActiveStepIndex(Math.min(lab.steps.length - 1, activeStepIndex + 1))}
                                        className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                    >
                                        Siguiente Paso
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

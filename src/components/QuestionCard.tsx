'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, BookOpen, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseTextWithTerms } from '@/lib/utils/textParser';
import { InteractiveCard, RevealBadge } from './ui/interactive-card';

interface QuestionProps {
    q: {
        type: 'V/F' | 'Desarrollo';
        question: string;
        answer: string;
        explanation?: string;
    };
}

export const QuestionCard: React.FC<QuestionProps> = ({ q }) => {
    const [isOpen, setIsOpen] = useState(false);

    const isFalse = q.answer === 'F' || q.answer === 'Falso';
    const answerText = q.type === 'V/F'
        ? (isFalse ? 'Falso' : 'Verdadero')
        : q.answer;

    return (
        <InteractiveCard isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-start gap-5">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500",
                    isOpen ? "scale-110 shadow-lg" : "",
                    q.type === 'V/F'
                        ? (isOpen ? "bg-blue-500 text-white shadow-blue-500/20" : "bg-blue-500/10 text-blue-500")
                        : (isOpen ? "bg-purple-500 text-white shadow-purple-500/20" : "bg-purple-500/10 text-purple-500")
                )}>
                    {q.type === 'V/F' ? <HelpCircle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                            {q.type}
                        </span>
                        <RevealBadge isOpen={isOpen} />
                    </div>

                    <h3 className="text-lg font-semibold leading-tight text-foreground/90">
                        {parseTextWithTerms(q.question)}
                    </h3>

                    <AnimatePresence initial={false}>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            >
                                <div className="pt-4 mt-4 border-t border-border/50">
                                    <div className="bg-muted/40 rounded-2xl p-5 space-y-3 border border-border/30">
                                        <div className="flex items-center gap-2">
                                            {q.type === 'V/F' ? (
                                                <>
                                                    {isFalse ? (
                                                        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                        </div>
                                                    )}
                                                    <span className={cn(
                                                        "text-xs font-black uppercase tracking-widest",
                                                        isFalse ? "text-red-500" : "text-green-500"
                                                    )}>
                                                        {answerText}
                                                    </span>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest">
                                                    <ChevronDown className="w-4 h-4" />
                                                    <span>RESPUESTA CORRECTA</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-sm text-foreground/80 leading-relaxed font-medium">
                                            {q.type === 'Desarrollo' ? (
                                                parseTextWithTerms(q.answer)
                                            ) : (
                                                q.explanation && (
                                                    <p className="italic bg-background/50 p-3 rounded-xl border border-border/20">
                                                        {parseTextWithTerms(q.explanation)}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </InteractiveCard>
    );
};

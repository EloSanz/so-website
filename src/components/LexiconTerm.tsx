'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseTextWithTerms } from '@/lib/utils/textParser';

interface LexiconTermProps {
    term: string;
    definition: string;
}

export const LexiconTerm: React.FC<LexiconTermProps> = ({ term, definition }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span
            className="relative inline cursor-help group"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <span className="text-blue-500 font-bold border-b border-blue-500/30 group-hover:border-blue-500 transition-colors">
                {term}
            </span>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-2xl bg-card border border-border shadow-2xl shadow-blue-500/10 pointer-events-none"
                    >
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Referencia Técnica</span>
                            <p className="text-sm text-foreground/90 leading-relaxed font-normal">
                                {parseTextWithTerms(definition)}
                            </p>
                        </div>

                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-3 h-3 bg-card border-r border-b border-border rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
};


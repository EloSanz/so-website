'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GuidedLab as GuidedLabType } from '@/lib/data/types';
import { GuidedLab } from './GuidedLab';

interface GuidedLabModalProps {
    lab: GuidedLabType | null;
    isOpen: boolean;
    onClose: () => void;
}

export const GuidedLabModal: React.FC<GuidedLabModalProps> = ({ lab, isOpen, onClose }) => {
    if (!lab) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-5xl max-h-[90vh] z-50 overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 w-fit">
                                    Laboratorio Guiado
                                </span>
                                <h2 className="text-xl font-bold tracking-tight">{lab.title}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Lab Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                            <GuidedLab lab={lab} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

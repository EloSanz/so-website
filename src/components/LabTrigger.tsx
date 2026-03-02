'use client';

import React, { useState } from 'react';
import { Terminal, Code2, ArrowRight } from 'lucide-react';
import { PracticalChallengeModal } from './PracticalChallengeModal';
import { GuidedLabModal } from './GuidedLabModal';
import { PracticalChallenge as PracticalChallengeType, GuidedLab as GuidedLabType } from '@/lib/data/types';

interface LabTriggerProps {
    language?: string;
    task: string;
    challenge?: PracticalChallengeType;
    guidedLab?: GuidedLabType;
}

export const LabTrigger: React.FC<LabTriggerProps> = ({ language, task, challenge, guidedLab }) => {
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
    const [isLabModalOpen, setIsLabModalOpen] = useState(false);

    const handleOpen = () => {
        if (challenge) {
            setIsChallengeModalOpen(true);
        } else if (guidedLab) {
            setIsLabModalOpen(true);
        }
    };

    const hasModal = !!challenge || !!guidedLab;

    return (
        <>
            <div
                onClick={hasModal ? handleOpen : undefined}
                className={`p-8 rounded-3xl bg-foreground text-background relative overflow-hidden group/lab border border-border shadow-2xl transition-all ${hasModal
                        ? "cursor-pointer hover:ring-4 hover:ring-primary/20 active:scale-[0.98]"
                        : ""
                    }`}
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/lab:opacity-20 group-hover/lab:scale-110 transition-all duration-500">
                    <Terminal className="w-32 h-32 -rotate-12" />
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                        <p className="text-lg font-medium opacity-90 leading-relaxed group-hover/lab:text-primary transition-colors pr-8">
                            {task}
                        </p>
                        {hasModal && (
                            <div className="bg-primary/10 p-2 rounded-xl group-hover/lab:bg-primary group-hover/lab:text-primary-foreground transition-all">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        )}
                    </div>

                    {hasModal && (
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary opacity-0 group-hover/lab:opacity-100 translate-y-2 group-hover/lab:translate-y-0 transition-all duration-300">
                            <Code2 className="w-4 h-4" />
                            Hacé click para ver {challenge ? "el desafío" : "el laboratorio"} completo
                        </div>
                    )}
                </div>

                {/* Animated Gradient Border effect on hover */}
                {hasModal && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover/lab:opacity-100 transition-opacity" />
                )}
            </div>

            {challenge && (
                <PracticalChallengeModal
                    challenge={challenge}
                    isOpen={isChallengeModalOpen}
                    onClose={() => setIsChallengeModalOpen(false)}
                />
            )}

            {guidedLab && (
                <GuidedLabModal
                    lab={guidedLab}
                    isOpen={isLabModalOpen}
                    onClose={() => setIsLabModalOpen(false)}
                />
            )}
        </>
    );
};

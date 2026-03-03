'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2, Trophy, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModuleConversation } from '@/lib/data/types';
import { parseTextWithTerms } from '@/lib/utils/textParser';
import { ChatBubble, VerdictCard } from './ui/interactive-card';

interface StudentDebateProps {
    conversation: ModuleConversation;
}

export const StudentDebate = ({ conversation }: StudentDebateProps) => {
    if (!conversation) return null;

    return (
        <section id="debate" className="w-full space-y-10 py-16 scroll-mt-24">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary/80">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Debate</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                    {conversation.title}
                </h2>
                <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
                    Dos gigantes de la computación se cruzan en un chat para discutir sobre <span className="text-primary font-semibold underline decoration-primary/30 underline-offset-4">{conversation.topic}</span>.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8 relative">
                {/* Chat Background Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-[3rem] -z-10 blur-3xl opacity-50" />

                <div className="space-y-6 px-2 md:px-0">
                    {conversation.messages.map((msg, i) => (
                        <ChatBubble
                            key={i}
                            name={msg.name}
                            message={parseTextWithTerms(msg.message)}
                            isExpert={msg.role === 'expert'}
                            index={i}
                        />
                    ))}
                </div>

                {/* Conclusion / Verdict Card */}
                <VerdictCard delay={conversation.messages.length * 0.15 + 0.5}>
                    {/* Decorative Background Icon */}
                    <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
                        <Trophy className="w-48 h-48 text-emerald-500 rotate-12" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white ring-4 ring-emerald-500/10">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-foreground tracking-tight">
                                    Veredicto: <span className="text-emerald-500">{conversation.conclusion.winner}</span> tenía razón
                                </h3>
                                <div className="h-1 w-20 bg-emerald-500/30 rounded-full mt-1" />
                            </div>
                        </div>

                        <div className="relative pl-8 border-l-2 border-emerald-500/20">
                            <Quote className="absolute -left-2 -top-2 w-6 h-6 text-emerald-500/20 rotate-180" />
                            <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-medium italic">
                                {parseTextWithTerms(conversation.conclusion.explanation)}
                            </p>
                        </div>
                    </div>
                </VerdictCard>
            </div>
        </section>
    );
};

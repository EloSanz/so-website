'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, Zap, Code2, MessageCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';
import { ReadingProgress } from './ReadingProgress';

interface TOCItem {
    id: string;
    title: string;
}

interface TableOfContentsProps {
    topics: TOCItem[];
    hasConversation?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ topics, hasConversation }) => {
    const [activeId, setActiveId] = useState<string>('');
    const { isZenMode } = useSidebar();

    useEffect(() => {
        if (isZenMode) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, {
            rootMargin: '-10% 0% -80% 0%',
            threshold: 0,
        });

        topics.forEach((topic) => {
            const el = document.getElementById(topic.id);
            if (el) observer.observe(el);
        });

        ['animation', 'debate', 'challenge', 'practice'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [topics, isZenMode, hasConversation]);

    if (isZenMode) return null;

    return (
        <aside className="hidden xl:block w-80 shrink-0 sticky top-0 self-start h-fit max-h-screen overflow-y-auto border-l border-border/50 py-12 px-8 no-scrollbar">
            <div className="space-y-8">
                <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50 px-4">En esta página</h4>
                    <nav className="flex flex-col gap-1 font-medium">
                        {topics.map(topic => (
                            <Link
                                key={topic.id}
                                href={`#${topic.id}`}
                                className={cn(
                                    "text-sm px-4 py-2 transition-all duration-300 relative border-l-2 -ml-[2px]",
                                    activeId === topic.id
                                        ? "text-primary border-primary bg-primary/5 font-bold translate-x-1"
                                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                                )}
                            >
                                {topic.title}
                            </Link>
                        ))}

                        <Link
                            href="#animation"
                            className={cn(
                                "text-sm px-4 py-2 transition-all duration-300 flex items-center gap-2 border-l-2 -ml-[2px]",
                                activeId === 'animation'
                                    ? "text-primary border-primary bg-primary/5 font-bold translate-x-1"
                                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            <Activity className={cn("w-3 h-3 transition-colors", activeId === 'animation' ? "text-primary" : "text-primary/40")} />
                            Simulaciones
                        </Link>
                        {hasConversation && (
                            <Link
                                href="#debate"
                                className={cn(
                                    "text-sm px-4 py-2 transition-all duration-300 flex items-center gap-2 border-l-2 -ml-[2px]",
                                    activeId === 'debate'
                                        ? "text-primary border-primary bg-primary/5 font-bold translate-x-1"
                                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                                )}
                            >
                                <MessageCircle className={cn("w-3 h-3 transition-colors", activeId === 'debate' ? "text-primary" : "text-primary/40")} />
                                Debate
                            </Link>
                        )}

                        <Link
                            href="#practice"
                            className={cn(
                                "text-sm px-4 py-2 transition-all duration-300 flex items-center gap-2 border-l-2 -ml-[2px]",
                                activeId === 'practice'
                                    ? "text-orange-500 border-orange-500 bg-orange-500/5 font-bold translate-x-1"
                                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            <Zap className={cn("w-3 h-3 transition-colors", activeId === 'practice' ? "text-orange-500" : "text-orange-500/40")} />
                            Autoevaluación
                        </Link>

                        <Link
                            href="#challenge"
                            className={cn(
                                "text-sm px-4 py-2 transition-all duration-300 flex items-center gap-2 border-l-2 -ml-[2px] pt-4 mt-2 border-t border-t-border/50",
                                activeId === 'challenge'
                                    ? "text-amber-500 border-amber-500 bg-amber-500/5 font-bold translate-x-1"
                                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            <Trophy className={cn("w-3 h-3 transition-colors", activeId === 'challenge' ? "text-amber-500" : "text-amber-500/40")} />
                            Desafío
                        </Link>
                        <ReadingProgress activeId={activeId} topics={topics} />
                    </nav>
                </div>
            </div>
        </aside>
    );
};

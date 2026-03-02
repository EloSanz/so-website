"use client";

import { usePathname } from "next/navigation";
import { learningPlan } from "@/lib/data/learningPlan";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
    className?: string;
    activeId?: string;
    topics?: { id: string; title: string }[];
}

export function ReadingProgress({ className, activeId, topics = [] }: ReadingProgressProps) {
    const pathname = usePathname();

    // Find matching module by pathname
    const moduleIndex = learningPlan.findIndex(m => pathname.startsWith(`/modules/${m.id}`));
    const currentModule = moduleIndex !== -1 ? learningPlan[moduleIndex] : null;

    if (!currentModule) return null;

    const totalModules = learningPlan.length;

    // Base progress from previous modules
    const baseProgress = (moduleIndex / totalModules) * 100;

    // Sub-progress within current module based on active topic
    const topicIndex = topics.findIndex(t => t.id === activeId);

    // Special cases for sections not in topics (animations, exam, lab)
    let adjustedTopicIndex = topicIndex;
    if (activeId === 'animation') adjustedTopicIndex = topics.length;
    if (activeId === 'practice') adjustedTopicIndex = topics.length + 1;
    if (activeId === 'lab') adjustedTopicIndex = topics.length + 2;

    const totalSubSteps = topics.length + 3; // topics + animations + practice + lab
    const subProgress = adjustedTopicIndex !== -1
        ? ((adjustedTopicIndex + 1) / totalSubSteps) * (100 / totalModules)
        : 0;

    const totalProgress = baseProgress + subProgress;

    return (
        <div className={cn("p-4 rounded-2xl bg-primary/5 border border-primary/10 mb-8", className)}>
            <div className="flex justify-between items-end mb-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Tu Camino</div>
                <div className="text-[10px] font-bold text-primary">{Math.round(totalProgress)}%</div>
            </div>
            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.4)] transition-all duration-700 ease-out"
                    style={{ width: `${totalProgress}%` }}
                />
            </div>
            <div className="mt-3 flex flex-col gap-0.5">
                <div className="text-[11px] font-bold text-foreground truncate">
                    Módulo {moduleIndex + 1}: {currentModule.title}
                </div>
                <div className="text-[10px] text-muted-foreground italic truncate">
                    {activeId && activeId !== 'animation' && activeId !== 'practice' && activeId !== 'lab'
                        ? `Leyendo: ${topics.find(t => t.id === activeId)?.title || '...'}`
                        : activeId === 'animation' ? 'Simulando conceptos...'
                            : activeId === 'practice' ? 'Poniendo el pecho al examen...'
                                : activeId === 'lab' ? 'En el laboratorio...'
                                    : 'Comenzando sección...'}
                </div>
            </div>
        </div>
    );
}

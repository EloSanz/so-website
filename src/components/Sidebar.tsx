"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { learningPlan } from "@/lib/data/learningPlan";
import { cn } from "@/lib/utils";
import { BookOpen, ChevronRight, Terminal, Activity, Cpu, Share2, Database, HardDrive, ChevronDown, PanelLeftClose, PanelLeftOpen, Monitor } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "./SidebarContext";

const icons = [BookOpen, Activity, Cpu, Share2, Database, HardDrive];

export function Sidebar() {
    const pathname = usePathname();
    const { isSidebarOpen, toggleSidebar, isZenMode, toggleZenMode } = useSidebar();
    const [expandedModule, setExpandedModule] = useState<string | null>(null);

    // Auto-expand the current module's section
    useEffect(() => {
        const currentModule = learningPlan.find(m => pathname.startsWith(`/modules/${m.id}`));
        if (currentModule) {
            setExpandedModule(currentModule.id);
        }
    }, [pathname]);

    const toggleModule = (id: string) => {
        setExpandedModule(expandedModule === id ? null : id);
    };

    return (
        <div className={cn(
            "border-r border-border bg-card/30 backdrop-blur-xl h-screen sticky top-0 overflow-y-auto transition-all duration-300 ease-in-out hidden lg:flex flex-col gap-8",
            isSidebarOpen ? "w-80 p-6" : "w-0 p-0 overflow-hidden border-none"
        )}>
            <div className="flex items-center justify-between px-2 min-w-[280px]">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h1 className="font-bold text-lg tracking-tight text-foreground">OS Deep Dive</h1>
                </Link>
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleZenMode}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            isZenMode ? "bg-primary/20 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                        title="Activar Modo Zen (F11 style)"
                    >
                        <Monitor className="w-5 h-5" />
                    </button>
                    <ThemeToggle />
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Ocultar camino a la gloria"
                    >
                        <PanelLeftClose className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <nav className="flex flex-col gap-1 min-w-[280px]">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                    El Camino a la Gloria
                </div>
                {learningPlan.map((module, index) => {
                    const Icon = icons[index] || BookOpen;
                    const isActive = pathname === `/modules/${module.id}`;
                    const isExpanded = expandedModule === module.id;
                    const hasTopics = module.topics && module.topics.length > 0;

                    return (
                        <div key={module.id} className="flex flex-col gap-1">
                            <div
                                onClick={() => toggleModule(module.id)}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "hover:bg-muted text-foreground/70 hover:text-foreground"
                                )}
                            >
                                <Link
                                    href={`/modules/${module.id}`}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Avoid triggering toggle when clicking the link
                                        if (!isExpanded) toggleModule(module.id);
                                    }}
                                    className="flex items-center gap-3 flex-1 min-w-0"
                                >
                                    <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] opacity-70 uppercase font-bold truncate">
                                            {module.unit}
                                        </div>
                                        <div className="text-sm font-medium truncate">
                                            {module.title}
                                        </div>
                                    </div>
                                </Link>

                                {hasTopics && (
                                    <button
                                        className={cn(
                                            "w-6 h-6 flex items-center justify-center rounded-lg hover:bg-black/10 transition-transform duration-200",
                                            isExpanded && "rotate-180"
                                        )}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <AnimatePresence>
                                {isExpanded && hasTopics && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden flex flex-col"
                                    >
                                        <div className="ml-7 border-l-2 border-primary/10 pl-4 py-1 flex flex-col gap-1">
                                            {module.topics?.map(topic => (
                                                <Link
                                                    key={topic.id}
                                                    href={`/modules/${module.id}#${topic.id}`}
                                                    className="text-xs py-1.5 text-muted-foreground hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4"
                                                >
                                                    {topic.id === 'lab' ? '👨‍💻' : '•'} {topic.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            <div className="mt-auto p-4 rounded-2xl bg-muted/50 border border-border">
                <div className="text-xs text-muted-foreground mb-1">Para el Final falta...</div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/6 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                </div>
                <div className="mt-2 text-[10px] font-bold text-primary italic">
                    Módulo 1: "Cien años de soledad"
                </div>
            </div>
        </div>
    );
}

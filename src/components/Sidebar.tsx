"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { learningPlan } from "@/lib/data/learningPlan";
import { cn } from "@/lib/utils";
import { BookOpen, Terminal, Activity, Cpu, Share2, Database, HardDrive, ChevronDown, PanelLeftClose, Monitor, Search, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "./SidebarContext";

const icons = [BookOpen, Activity, Cpu, Share2, Database, HardDrive];

export function Sidebar() {
    const pathname = usePathname();
    const { isSidebarOpen, toggleSidebar, isZenMode, toggleZenMode } = useSidebar();
    const [expandedModule, setExpandedModule] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

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

    // Normalize text (remove accents and lower case)
    const normalizeText = (text: string) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    interface SearchResult {
        moduleId: string;
        sectionId: string;
        moduleTitle: string;
        sectionTitle: string;
        snippet: string;
        type: 'topic' | 'exam' | 'lab';
    }

    const getSearchResults = (): SearchResult[] => {
        if (!searchQuery.trim()) return [];
        const query = normalizeText(searchQuery);
        const results: SearchResult[] = [];

        learningPlan.forEach(module => {
            const moduleTitleNorm = normalizeText(module.title);
            const moduleUnitNorm = normalizeText(module.unit);

            // Search in module titles
            if (moduleTitleNorm.includes(query) || moduleUnitNorm.includes(query)) {
                results.push({
                    moduleId: module.id,
                    sectionId: "",
                    moduleTitle: module.unit,
                    sectionTitle: module.title,
                    snippet: module.advancedFocus,
                    type: 'topic'
                });
            }

            // Search in topics
            module.topics?.forEach(topic => {
                const titleNorm = normalizeText(topic.title);
                const descNorm = topic.content?.description ? normalizeText(topic.content.description) : "";
                const itemsNorm = topic.content?.items?.map(i => normalizeText(i)) || [];

                if (titleNorm.includes(query) || descNorm.includes(query) || itemsNorm.some(i => i.includes(query))) {
                    let snippet = topic.content?.description || "";
                    if (itemsNorm.some(i => i.includes(query))) {
                        snippet = topic.content?.items?.find(i => normalizeText(i).includes(query)) || snippet;
                    }

                    results.push({
                        moduleId: module.id,
                        sectionId: topic.id,
                        moduleTitle: module.title,
                        sectionTitle: topic.title,
                        snippet: snippet.length > 80 ? snippet.slice(0, 80) + "..." : snippet,
                        type: 'topic'
                    });
                }
            });

            // Search in exam questions
            module.examQuestions?.forEach((q, idx) => {
                if (normalizeText(q.question).includes(query) || normalizeText(q.answer).includes(query)) {
                    results.push({
                        moduleId: module.id,
                        sectionId: `exam-${idx}`,
                        moduleTitle: module.title,
                        sectionTitle: "Pregunta de Examen",
                        snippet: q.question.length > 80 ? q.question.slice(0, 80) + "..." : q.question,
                        type: 'exam'
                    });
                }
            });
        });

        return results;
    };

    const searchResults = getSearchResults();

    const highlightText = (text: string, query: string) => {
        if (!query.trim()) return text;

        const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const regex = new RegExp(`(${normalizedQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');

        // We use a trick to find positions in the original text based on the normalized version
        // For simplicity in this UI, we'll do a direct case-insensitive split on the original text
        // assuming mapping is 1:1 for display purposes.
        const parts = text.split(new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi'));

        return (
            <span>
                {parts.map((part, i) =>
                    normalizeText(part) === normalizeText(query) ?
                        <span key={i} className="underline decoration-primary/40 decoration-2 underline-offset-2 font-bold text-foreground">{part}</span> :
                        part
                )}
            </span>
        );
    };

    return (
        <div className={cn(
            "border-r border-border bg-card/30 backdrop-blur-xl h-screen sticky top-0 overflow-y-auto transition-all duration-300 ease-in-out hidden lg:flex flex-col gap-6",
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

            {/* Search Bar */}
            <div className="relative group px-2 min-w-[280px]">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Search className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    placeholder="Buscá un concepto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            <nav className="flex flex-col gap-1 min-w-[280px]">
                {!searchQuery.trim() ? (
                    <>
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
                                                e.stopPropagation();
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
                                                    {module.conversation && (
                                                        <Link
                                                            href={`/modules/${module.id}#debate`}
                                                            className="text-xs py-1.5 text-muted-foreground hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4"
                                                        >
                                                            💬 Debate
                                                        </Link>
                                                    )}
                                                    {module.challenge && (
                                                        <Link
                                                            href={`/modules/${module.id}#challenge`}
                                                            className="text-xs py-1.5 text-muted-foreground hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4"
                                                        >
                                                            🏆 Desafío
                                                        </Link>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2 flex justify-between items-center">
                            <span>Resultados encontrados</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {searchResults.length}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {searchResults.length > 0 ? (
                                searchResults.map((result, i) => (
                                    <Link
                                        key={i}
                                        href={`/modules/${result.moduleId}${result.sectionId ? '#' + result.sectionId : ''}`}
                                        className="group p-3 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-muted/50 transition-all"
                                    >
                                        <div className="text-[10px] font-bold text-primary uppercase mb-1">
                                            {result.moduleTitle}
                                        </div>
                                        <div className="text-xs font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                            {highlightText(result.sectionTitle, searchQuery)}
                                        </div>
                                        <div className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                                            {highlightText(result.snippet, searchQuery)}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                        <Search className="w-6 h-6 text-muted-foreground/30" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground/80">Sin coincidencias</p>
                                    <p className="text-xs text-muted-foreground mt-1 px-4">Probá con palabras como "IPC", "Kernel" o "Memoria".</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </nav>
        </div>
    );
}

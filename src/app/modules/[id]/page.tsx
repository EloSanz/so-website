import type { Metadata } from "next";
import { QuestionCard } from "@/components/QuestionCard";
import { CodeExample } from "@/components/CodeExample";
import { TableOfContents } from "@/components/TableOfContents";
import { learningPlan } from "@/lib/data/learningPlan";
import { notFound } from "next/navigation";
import { Code2, Terminal, Play, Cpu, Info, ArrowLeft, Home, Activity, ChevronRight, BookOpen, HelpCircle, CheckCircle2, XCircle, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimationLab } from "@/components/animations";
import { parseTextWithTerms } from "@/lib/utils/textParser";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return learningPlan.map((module) => ({
        id: module.id,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const module = learningPlan.find((m) => m.id === id);

    if (!module) return { title: "Modulo no encontrado" };

    return {
        title: module.title,
        description: module.advancedFocus,
    };
}

export default async function ModulePage({ params }: Props) {
    const { id } = await params;
    const module = learningPlan.find((m) => m.id === id);

    if (!module) {
        notFound();
    }

    const topics = module.topics || [];
    const mainTopics = topics.filter(t => t.id !== 'lab');

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen">
            {/* Main Doc Content */}
            <main className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-12 lg:p-16 space-y-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
                    <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        Inicio
                    </Link>
                    <ChevronRight className="w-3 h-3 opacity-50" />
                    <span className="text-foreground/60">{module.unit}</span>
                    <ChevronRight className="w-3 h-3 opacity-50" />
                    <span className="text-foreground font-bold">{module.title}</span>
                </nav>

                {/* Article Header */}
                <header className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground">
                        {module.title}
                    </h1>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pb-4 border-b border-border/50">
                        <span className="font-bold text-primary/80 px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10">
                            DOCS-VERSION-1.0
                        </span>
                        <span>•</span>
                        <span>Último update: Febrero 2026</span>
                    </div>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {module.advancedFocus}
                    </p>
                </header>



                {/* Documentation Sections (The Vercel-style "Steps") */}
                <div className="relative pt-8">
                    {/* Vertical Line Connector */}
                    <div className="absolute left-4 top-12 bottom-0 w-px bg-border/60 hidden md:block" />

                    <div className="space-y-20">
                        {mainTopics.map((topic, index) => (
                            <section
                                key={topic.id}
                                id={topic.id}
                                className="relative md:pl-16 scroll-mt-24 group"
                            >
                                {/* Step Indicator */}
                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:border-primary group-hover:text-primary transition-all hidden md:flex z-10">
                                    {index + 1}
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                        <span className="md:hidden w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                                            {index + 1}
                                        </span>
                                        {topic.title}
                                    </h2>

                                    {topic.content ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                                            {topic.content.description.split('\n\n').map((paragraph, i) => (
                                                <p key={i} className="text-base text-foreground/80 leading-relaxed">
                                                    {parseTextWithTerms(paragraph)}
                                                </p>
                                            ))}

                                            {topic.content.code && (
                                                <CodeExample
                                                    language={topic.content.code.language}
                                                    snippet={topic.content.code.snippet}
                                                    revealQuestion={topic.content.code.revealQuestion}
                                                    revealAnswer={topic.content.code.revealAnswer}
                                                />
                                            )}

                                            {topic.content.items && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {topic.content.items.map((item, i) => (
                                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 text-sm items-start hover:bg-muted/50 transition-colors">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                            <span className="text-foreground/70">{parseTextWithTerms(item)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {topic.content.highlight && (
                                                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 border-l-4 border-l-primary flex gap-4">
                                                    <Info className="w-5 h-5 text-primary flex-shrink-0" />
                                                    <p className="text-sm text-primary font-medium italic leading-relaxed">
                                                        {parseTextWithTerms(topic.content.highlight)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-8 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                            <Terminal className="w-8 h-8 opacity-20" />
                                            <p className="text-sm italic">"Kernel Error: Contenido no linkeado todavía. Dale tiempo que el swap está a pleno."</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        ))}

                        {/* Animation / Simulation Playground */}
                        <section id="animation" className="relative md:pl-16 scroll-mt-24 group">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full border border-primary/50 bg-primary/5 flex items-center justify-center text-xs font-bold text-primary hidden md:flex z-10 transition-transform group-hover:scale-110">
                                <Activity className="w-4 h-4" />
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                        <span className="md:hidden w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                                            <Activity className="w-3 h-3" />
                                        </span>
                                        Laboratorio de Animaciones
                                    </h2>
                                    <p className="text-muted-foreground text-sm">Visualizá los conceptos en acción con este simulador interactivo.</p>
                                </div>

                                <div className="w-full">
                                    <AnimationLab animations={module.animations} />
                                </div>
                            </div>
                        </section>

                        {/* Exam Questions Section */}
                        {module.examQuestions && module.examQuestions.length > 0 && (
                            <section id="practice" className="relative md:pl-16 scroll-mt-24 group">
                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full border border-orange-500/50 bg-orange-500/5 flex items-center justify-center text-xs font-bold text-orange-500 hidden md:flex z-10 transition-transform group-hover:scale-110">
                                    <Zap className="w-4 h-4" />
                                </div>

                                <div className="space-y-8">
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                            <span className="md:hidden w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center text-[10px] text-orange-500">
                                                <Zap className="w-3 h-3" />
                                            </span>
                                            Simulacro de Examen
                                        </h2>
                                        <p className="text-muted-foreground text-sm">Ponele el pecho a estas preguntas que son fija de parcial.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {module.examQuestions.map((q, i) => (
                                            <QuestionCard key={i} q={q as any} />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Lab Section */}
                        <section id="lab" className="relative md:pl-16 scroll-mt-24 group">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full border border-primary/50 bg-primary/5 flex items-center justify-center text-xs font-bold text-primary hidden md:flex z-10 transition-transform group-hover:scale-110">
                                <Code2 className="w-4 h-4" />
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                    <span className="md:hidden w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                                        <Code2 className="w-3 h-3" />
                                    </span>
                                    Desafío Práctico: {module.lab.language}
                                </h2>

                                <div className="p-8 rounded-3xl bg-foreground text-background relative overflow-hidden group/lab border border-border shadow-2xl">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/lab:opacity-10 transition-opacity">
                                        <Terminal className="w-32 h-32 -rotate-12" />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <p className="text-lg font-medium opacity-90 leading-relaxed">
                                            {module.lab.task}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-background text-foreground font-bold hover:scale-[1.05] transition-transform active:scale-95">
                                                <Play className="w-4 h-4 fill-current" />
                                                Darle masa al lab
                                            </button>
                                            <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-background/10 text-background border border-background/20 font-bold hover:bg-background/20 transition-all">
                                                <BookOpen className="w-4 h-4" />
                                                Ver Guía Completa
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Right Sidebar - "On this page" TOC */}
            <TableOfContents topics={mainTopics} />
        </div>
    );
}



'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Lock, Unlock, RefreshCcw, Hand, Ban, ShieldAlert, Cpu, CheckCircle2, XCircle } from 'lucide-react';
import {
    SimulatorContainer, SimulatorHeader, SimulatorHeaderControls,
    SimulatorHeaderActions, SimulatorButton, SimulatorMetric, SimulatorDivider
} from './ui/simulator';
import { cn } from '@/lib/utils';

interface Resource {
    id: string;
    name: string;
    ownedBy: string | null;
}

interface Process {
    id: string;
    name: string;
    wants: string | null;
}

export default function DeadlockAnimation() {
    const [resources, setResources] = useState<Resource[]>([
        { id: 'r1', name: 'Scanner', ownedBy: null },
        { id: 'r2', name: 'Impresora', ownedBy: null },
    ]);

    const [processes, setProcesses] = useState<Process[]>([
        { id: 'p1', name: 'Proceso A', wants: null },
        { id: 'p2', name: 'Proceso B', wants: null },
    ]);

    const [message, setMessage] = useState('Asigná recursos para ver si explota todo.');
    const [isDeadlocked, setIsDeadlocked] = useState(false);
    const [isAutoSimulating, setIsAutoSimulating] = useState(false);

    // Coffman Conditions State (now an array of active conditions)
    const [coffman, setCoffman] = useState<string[]>([]);

    const assign = (pId: string, rId: string) => {
        if (isDeadlocked) return;

        setResources(prevRes => {
            const res = prevRes.find(r => r.id === rId)!;
            const proc = processes.find(p => p.id === pId)!;

            if (res.ownedBy === pId) return prevRes; // Already owns it

            if (res.ownedBy === null) {
                // Resource is free, assign it
                setProcesses(prevProc => prevProc.map(p => p.id === pId ? { ...p, wants: null } : p));
                setMessage(`${proc.name} capturó el recurso ${res.name}.`);
                return prevRes.map(r => r.id === rId ? { ...r, ownedBy: pId } : r);
            } else {
                // Resource is taken, process waits
                setProcesses(prevProc => prevProc.map(p => p.id === pId ? { ...p, wants: rId } : p));
                setMessage(`${proc.name} está bloqueado esperando ${res.name}.`);
                return prevRes;
            }
        });
    };

    const runExample = async () => {
        if (isAutoSimulating) return;
        setIsAutoSimulating(true);
        reset();

        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        setMessage("1. El Proceso A toma el Scanner.");
        assign('p1', 'r1');
        await delay(1500);

        setMessage("2. El Proceso B toma la Impresora.");
        assign('p2', 'r2');
        await delay(1500);

        setMessage("3. Ahora A pide la Impresora (pero la tiene B).");
        assign('p1', 'r2');
        await delay(1500);

        setMessage("4. Finalmente, B pide el Scanner (que tiene A). ¡Boom!");
        assign('p2', 'r1');

        setIsAutoSimulating(false);
    };

    useEffect(() => {
        const p1 = processes[0];
        const p2 = processes[1];
        const r1 = resources[0];
        const r2 = resources[1];

        const activeCoffmanConditions: string[] = [];

        // Mutual Exclusion (always true in this model)
        activeCoffmanConditions.push("Exclusión Mutua");

        // Hold and Wait
        const holdAndWait = (p1.wants !== null && (r1.ownedBy === p1.id || r2.ownedBy === p1.id)) ||
            (p2.wants !== null && (r1.ownedBy === p2.id || r2.ownedBy === p2.id));
        if (holdAndWait) {
            activeCoffmanConditions.push("Posesión y Espera");
        }

        // No Preemption (always true in this model)
        activeCoffmanConditions.push("No Expropiación");

        // Circular Wait
        const circularWait = (p1.wants === r2.id && r2.ownedBy === p2.id && p2.wants === r1.id && r1.ownedBy === p1.id);
        if (circularWait) {
            activeCoffmanConditions.push("Espera Circular");
        }

        setCoffman(activeCoffmanConditions);

        if (circularWait && activeCoffmanConditions.length === 4) {
            setIsDeadlocked(true);
            setMessage('¡DEADLOCK DETECTADO! Se cumplen las 4 condiciones de Coffman.');
        } else {
            setIsDeadlocked(false);
        }
    }, [processes, resources]);

    const reset = () => {
        setResources([
            { id: 'r1', name: 'Scanner', ownedBy: null },
            { id: 'r2', name: 'Impresora', ownedBy: null },
        ]);
        setProcesses([
            { id: 'p1', name: 'Proceso A', wants: null },
            { id: 'p2', name: 'Proceso B', wants: null },
        ]);
        setMessage('Asigná recursos para ver si explota todo.');
        setIsDeadlocked(false);
        setCoffman([]); // Reset Coffman conditions
    };

    return (
        <SimulatorContainer className="select-none h-full">
            <SimulatorHeader>
                <SimulatorHeaderControls>
                    <SimulatorMetric
                        label="Estado"
                        value={coffman.length === 4 ? <span className="text-red-500 flex items-center gap-1"><Ban size={16} /> DEADLOCK</span> : <span className="text-emerald-500 flex items-center gap-1"><Unlock size={16} /> SEGURO</span>}
                    />
                    <SimulatorDivider />
                    <div className="flex gap-1 overflow-x-auto pb-1 max-w-[200px] md:max-w-none">
                        {coffman.map(c => (
                            <div key={c} className="px-2 py-0.5 rounded text-[8px] font-bold bg-muted text-foreground border border-border whitespace-nowrap">
                                {c}
                            </div>
                        ))}
                    </div>
                </SimulatorHeaderControls>

                <SimulatorHeaderActions>
                    <SimulatorButton onClick={runExample} disabled={isAutoSimulating}>
                        Ver Ejemplo
                    </SimulatorButton>
                    <SimulatorButton onClick={reset} variant="icon">
                        <RefreshCcw size={18} />
                    </SimulatorButton>
                </SimulatorHeaderActions>
            </SimulatorHeader>

            {/* Layout principal (Grid) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
                {/* Logic Panel */}
                <div className="md:col-span-8 flex flex-col gap-6">
                    <div className="relative flex-1 flex flex-col items-center justify-center gap-12 bg-muted/20 rounded-[2rem] border border-border p-8 overflow-hidden min-h-[400px]">
                        {/* Background Decorative Rings */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-border/10 rounded-full pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-border/10 rounded-full pointer-events-none" />

                        <div className="flex flex-col md:flex-row items-center justify-around w-full gap-12 z-10">
                            {processes.map((p, idx) => (
                                <div key={p.id} className="relative flex flex-col items-center gap-6">
                                    <motion.div
                                        animate={{
                                            scale: p.wants ? 1.05 : 1,
                                            borderColor: isDeadlocked ? '#ef4444' : p.wants ? '#f97316' : '#3b82f6'
                                        }}
                                        className={cn(
                                            "w-24 h-24 rounded-3xl border-2 flex flex-col items-center justify-center transition-all shadow-2xl relative",
                                            isDeadlocked ? "bg-red-500/20" : p.wants ? "bg-orange-500/10" : "bg-blue-500/10"
                                        )}
                                    >
                                        <Cpu size={40} className={isDeadlocked ? "text-red-500" : p.wants ? "text-orange-500" : "text-blue-500"} />
                                        <span className="text-[10px] font-black text-foreground mt-2 uppercase tracking-tight">{p.name}</span>

                                        {p.wants && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white border-4 border-black shadow-lg"
                                            >
                                                <Hand size={14} />
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {resources.map(r => (
                                            <button
                                                key={r.id}
                                                onClick={() => assign(p.id, r.id)}
                                                disabled={r.ownedBy === p.id || isDeadlocked}
                                                className={cn(
                                                    "px-3 py-2 rounded-xl text-[9px] font-bold border transition-all active:scale-95",
                                                    r.ownedBy === p.id
                                                        ? "bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/20"
                                                        : "bg-muted/50 border-border text-foreground/60 hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                Pedir {r.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resources in the middle/bottom */}
                        <div className="flex gap-12 z-10">
                            {resources.map(r => (
                                <div key={r.id} className="flex flex-col items-center gap-3">
                                    <motion.div
                                        animate={{
                                            scale: r.ownedBy ? 1.1 : 1,
                                            borderColor: r.ownedBy ? '#22c55e' : 'rgba(255,255,255,0.2)'
                                        }}
                                        className={cn(
                                            "w-20 h-20 rounded-2xl border-2 flex items-center justify-center relative transition-all shadow-xl",
                                            r.ownedBy ? "bg-green-500/10" : "bg-white/5"
                                        )}
                                    >
                                        <Network size={32} className={r.ownedBy ? "text-green-500" : "text-foreground/20"} />
                                        {r.ownedBy && (
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="absolute -bottom-3 bg-green-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black shadow-lg uppercase tracking-tighter"
                                            >
                                                Asignado
                                            </motion.div>
                                        )}
                                    </motion.div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{r.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Circular Wait SVG Arrows */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orientation="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
                                </marker>
                                <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orientation="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                                </marker>
                            </defs>
                            {/* Static lines indicating requests could go here if needed */}
                        </svg>
                    </div>
                </div>

                {/* Coffman Sidebar */}
                <div className="md:col-span-4 flex flex-col gap-4">
                    <div className="p-5 rounded-[2rem] bg-muted/20 border border-border flex flex-col gap-5">
                        <h5 className="text-xs font-black text-foreground uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <ShieldAlert size={14} className="text-primary" />
                            Condiciones de Coffman
                        </h5>

                        <div className="space-y-4">
                            <CoffmanItem
                                label="Exclusión Mutua"
                                desc="Un recurso solo puede ser usado por un proceso a la vez."
                                active={coffman.includes("Exclusión Mutua")}
                            />
                            <CoffmanItem
                                label="Posesión y Espera"
                                desc="Un proceso retiene un recurso mientras espera por otro."
                                active={coffman.includes("Posesión y Espera")}
                            />
                            <CoffmanItem
                                label="No Expropiación"
                                desc="El SO no puede quitar Recursos por la fuerza."
                                active={coffman.includes("No Expropiación")}
                            />
                            <CoffmanItem
                                label="Espera Circular"
                                desc="Existe una cadena cerrada de procesos esperando entre sí."
                                active={coffman.includes("Espera Circular")}
                                isCritical
                            />
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                💡 Para eliminar un Deadlock, debés romper al menos UNA de estas 4 condiciones.
                            </p>
                        </div>
                    </div>

                    <div className="p-5 rounded-[2rem] bg-primary/10 border border-primary/20">
                        <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Pro-Tip de Examen</h5>
                        <p className="text-xs text-white/70 leading-relaxed">
                            Si el grafo tiene ciclos y los recursos tienen una sola instancia, **hay Deadlock seguro**.
                        </p>
                    </div>
                </div>
            </div>
        </SimulatorContainer>
    );
}

function CoffmanItem({ label, desc, active, isCritical }: { label: string, desc: string, active: boolean, isCritical?: boolean }) {
    return (
        <div className={cn(
            "p-3 rounded-2xl border transition-all duration-300",
            active
                ? isCritical ? "bg-red-500/20 border-red-500/40" : "bg-orange-500/20 border-orange-500/40"
                : "bg-muted/30 border-border opacity-60"
        )}>
            <div className="flex items-center justify-between mb-1">
                <span className={cn("text-[10px] font-black uppercase tracking-tight", active ? "text-foreground" : "text-foreground/40")}>
                    {label}
                </span>
                {active ? <CheckCircle2 size={14} className={isCritical ? "text-red-500" : "text-orange-500"} /> : <XCircle size={14} className="text-foreground/20" />}
            </div>
            <p className={cn("text-[9px] leading-tight leading-relaxed font-medium", active ? "text-foreground/80" : "text-foreground/30")}>
                {desc}
            </p>
        </div>
    );
}

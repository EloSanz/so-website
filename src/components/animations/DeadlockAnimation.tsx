'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RotateCcw, Box, User, Link as LinkIcon } from 'lucide-react';

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

    const assign = (pId: string, rId: string) => {
        const res = resources.find(r => r.id === rId)!;
        const proc = processes.find(p => p.id === pId)!;

        if (res.ownedBy === pId) return; // Already owns it

        if (res.ownedBy === null) {
            // Resource is free, assign it
            setResources(prev => prev.map(r => r.id === rId ? { ...r, ownedBy: pId } : r));
            setProcesses(prev => prev.map(p => p.id === pId ? { ...p, wants: null } : p));
            setMessage(`${proc.name} ahora tiene el ${res.name}.`);
        } else {
            // Resource is taken, process waits
            setProcesses(prev => prev.map(p => p.id === pId ? { ...p, wants: rId } : p));
            setMessage(`${proc.name} está esperando por el ${res.name} que tiene ${processes.find(p => p.id === res.ownedBy)!.name}.`);
        }

        // Check for Deadlock (Simplified for 2x2)
        setTimeout(() => {
            checkDeadlock();
        }, 500);
    };

    const checkDeadlock = () => {
        setProcesses(currentProcesses => {
            setResources(currentResources => {
                const p1 = currentProcesses[0];
                const p2 = currentProcesses[1];
                const r1 = currentResources[0];
                const r2 = currentResources[1];

                if (p1.wants === r2.id && r2.ownedBy === p2.id && p2.wants === r1.id && r1.ownedBy === p1.id) {
                    setMessage('¡DEADLOCK! Ambos se esperan mutuamente. El SO está frito.');
                }
                return currentResources;
            });
            return currentProcesses;
        });
    };

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
    };

    return (
        <div className="w-full h-full p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${message.includes('DEADLOCK') ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}>
                        <AlertCircle size={20} className="text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Grafo de Asignación</h4>
                        <p className="text-[10px] text-white/50">{message}</p>
                    </div>
                </div>
                <button onClick={reset} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
                    <RotateCcw size={18} />
                </button>
            </div>

            <div className="relative flex-1 flex flex-col md:flex-row items-center justify-around gap-12 bg-black/20 rounded-3xl border border-white/5 p-8 overflow-hidden">
                {processes.map((p, idx) => (
                    <div key={p.id} className="relative flex flex-col items-center gap-4">
                        <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${p.wants ? 'border-orange-500 bg-orange-500/10' : 'border-blue-500 bg-blue-500/10'}`}>
                            <User size={32} className={p.wants ? 'text-orange-500' : 'text-blue-500'} />
                            <span className="text-[10px] font-bold text-white mt-1 uppercase">{p.name}</span>
                        </div>

                        <div className="flex gap-2">
                            {resources.map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => assign(p.id, r.id)}
                                    disabled={r.ownedBy === p.id}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${r.ownedBy === p.id ? 'bg-green-500 border-green-500 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                                >
                                    Pedir {r.name.split('')[0]}
                                </button>
                            ))}
                        </div>

                        {/* Dependency Arrow */}
                        <AnimatePresence>
                            {p.wants && (
                                <motion.div
                                    initial={{ opacity: 0, pathLength: 0 }}
                                    animate={{ opacity: 1, pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute top-1/2 left-full w-12 flex items-center justify-center z-0"
                                >
                                    <ArrowRight pId={p.id} targetIdx={idx === 0 ? 1 : 0} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                <div className="flex flex-col gap-8">
                    {resources.map(r => (
                        <div key={r.id} className="flex flex-col items-center gap-2">
                            <div className={`w-14 h-14 rounded-xl border flex items-center justify-center relative transition-all ${r.ownedBy ? 'border-green-500 bg-green-500/10' : 'border-white/20 bg-white/5'}`}>
                                <Box size={24} className={r.ownedBy ? 'text-green-500' : 'text-white/20'} />
                                {r.ownedBy && (
                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                                        OWNED
                                    </div>
                                )}
                            </div>
                            <span className="text-[9px] font-bold text-white/40 uppercase">{r.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ArrowRight({ pId, targetIdx }: { pId: string, targetIdx: number }) {
    return (
        <svg width="60" height="20" className="rotate-0 md:rotate-0">
            <path d="M 0 10 L 50 10" stroke="#f97316" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orientation="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#f97316" />
                </marker>
            </defs>
        </svg>
    );
}

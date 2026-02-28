'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Bell, Shield, Database, ArrowRight, Terminal } from 'lucide-react';

export default function InterruptAnimation() {
    const [step, setStep] = useState(0);
    const [logs, setLogs] = useState<string[]>(['Sistema Operativo en reposo...']);

    const steps = [
        { title: 'Hardware: Grito!', desc: 'Un periférico (teclado, disco) envía un pulso eléctrico por la línea IRQ.', icon: <Bell className="text-orange-500" /> },
        { title: 'CPU: Check!', desc: 'La CPU termina la instrucción actual y mira el bus de interrupciones.', icon: <Cpu className="text-blue-500" /> },
        { title: 'Vector Table', desc: 'Se consulta la tabla en memoria para buscar la dirección de la RAI (ISR).', icon: <Database className="text-purple-500" /> },
        { title: 'Context Switch', desc: 'Se guardan los registros del proceso actual para no perder el hilo.', icon: <Shield className="text-red-500" /> },
        { title: 'RAI: Ejecución', desc: 'El Kernel toma el control y ejecuta el código específico para esa interrupción.', icon: <Terminal className="text-green-500" /> },
        { title: 'Return', desc: 'Se restaura el contexto y se vuelve al proceso original como si nada hubiera pasado.', icon: <ArrowRight className="text-blue-400" /> },
    ];

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
            setLogs(prev => [`> ${steps[step + 1].title}`, ...prev].slice(0, 5));
        } else {
            setStep(0);
            setLogs(['Sistema reiniciado.']);
        }
    };

    return (
        <div className="w-full h-full p-6 flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter">Interrupt Journey</h3>
                    <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Visualización de Flujo de Control</p>
                </div>
                <button
                    onClick={nextStep}
                    className="px-6 py-2 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                    {step === 0 ? 'Lanzar Interrupción' : 'Siguiente Paso'}
                </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center min-h-[250px] bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                {/* Background circuit lines */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 800 400">
                        <path d="M 100 200 L 700 200" stroke="white" strokeWidth="1" fill="none" strokeDasharray="5,5" />
                        <circle cx="100" cy="200" r="4" fill="white" />
                        <circle cx="700" cy="200" r="4" fill="white" />
                    </svg>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ x: 50, opacity: 0, scale: 0.9 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: -50, opacity: 0, scale: 0.9 }}
                        className="z-10 flex flex-col items-center text-center gap-6 max-w-sm px-6"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
                            {React.cloneElement(steps[step].icon as React.ReactElement<{ size: number }>, { size: 48 })}

                            {/* Progress Indicator */}
                            <div className="absolute -bottom-2 flex gap-1">
                                {steps.map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-orange-500 w-4' : 'bg-white/20'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xl font-bold text-white tracking-tight">{steps[step].title}</h4>
                            <p className="text-sm text-white/60 leading-relaxed font-medium">
                                {steps[step].desc}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Floating elements representing "data" */}
                {step > 0 && step < steps.length - 1 && (
                    <motion.div
                        animate={{ x: [0, 400], opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute left-1/4 w-2 h-2 bg-orange-400 rounded-full blur-sm"
                    />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-[11px] space-y-1 h-32 overflow-hidden shadow-inner">
                    <div className="text-white/20 uppercase font-bold mb-2">Kernel Log</div>
                    {logs.map((log, i) => (
                        <div key={i} className={i === 0 ? 'text-orange-400 font-bold' : 'text-white/40'}>
                            {log}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${step < 4 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} />
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">User Mode</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${step >= 4 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/10'}`} />
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Kernel Mode</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

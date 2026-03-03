'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Reusable arrow component
const Arrow = ({ className = '', dashed = false, color = 'emerald' }: { className?: string; dashed?: boolean; color?: 'emerald' | 'cyan' }) => {
    const colorClass = color === 'emerald' ? 'text-emerald-500' : 'text-cyan-400';
    return (
        <svg className={`${colorClass} ${className}`} viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="6" x2="30" y2="6" stroke="currentColor" strokeWidth="2" strokeDasharray={dashed ? "4 3" : "none"} />
            <polygon points="30,1 40,6 30,11" fill="currentColor" />
        </svg>
    );
};

// Curved dashed arrow pointing upward (for soft link back to original file)
const CurvedArrow = () => (
    <svg className="text-cyan-400 w-full h-16 md:h-20" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M180,55 C180,15 20,15 20,5" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" fill="none" />
        <polygon points="17,12 20,0 23,12" fill="currentColor" />
    </svg>
);

interface NodeBoxProps {
    label: string;
    sublabel?: string;
    variant?: 'directory' | 'inode' | 'data';
    badge?: string;
    delay?: number;
}

const NodeBox = ({ label, sublabel, variant = 'directory', badge, delay = 0 }: NodeBoxProps) => {
    const styles = {
        directory: 'bg-card border-border hover:border-emerald-500/40',
        inode: 'bg-card border-border hover:border-primary/40',
        data: 'bg-card border-border hover:border-cyan-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4 }}
            className={`relative px-3 py-2.5 md:px-4 md:py-3 rounded-xl border-2 ${styles[variant]} transition-all duration-300 text-center group cursor-default shadow-sm hover:shadow-lg`}
        >
            <span className="text-xs md:text-sm font-mono font-bold text-foreground">{label}</span>
            {sublabel && (
                <span className="block text-[10px] text-muted-foreground mt-0.5">{sublabel}</span>
            )}
            {badge && (
                <span className="absolute -top-2 -right-2 text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full shadow-lg shadow-emerald-500/30">
                    {badge}
                </span>
            )}
        </motion.div>
    );
};

const ColumnHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="text-center mb-4 md:mb-6">
        <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-foreground">{title}</h4>
        {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
    </div>
);

export const LinksDiagram = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-full my-8 p-4 md:p-8 rounded-3xl bg-muted/30 border border-border overflow-hidden"
        >
            {/* Title */}
            <div className="text-center mb-6 md:mb-10">
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-foreground">
                    <span className="text-emerald-500">Hard Link</span>
                    {' '}vs{' '}
                    <span className="text-cyan-400">Soft Link</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Cómo el sistema de archivos resuelve cada tipo de enlace</p>
            </div>

            {/* Diagram Grid */}
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-x-1 md:gap-x-3 gap-y-3">
                {/* Column Headers */}
                <ColumnHeader title="Directorio" subtitle="(Tabla)" />
                <div /> {/* Arrow spacer */}
                <ColumnHeader title="I-Nodos" subtitle="(I-Lista)" />
                <div /> {/* Arrow spacer */}
                <ColumnHeader title="Bloques" subtitle="(Disco)" />

                {/* --- ROW 1: Archivo_Original_1 → I-Nodo 5 → Datos --- */}
                <NodeBox label="Archivo_1.txt" variant="directory" delay={0.1} />
                <div className="flex items-center justify-center self-center">
                    <Arrow className="w-6 md:w-10 h-3" color="emerald" />
                </div>
                <NodeBox label="I-Nodo 5" variant="inode" badge="refs: 2" delay={0.2} />
                <div className="flex items-center justify-center self-center">
                    <Arrow className="w-6 md:w-10 h-3" color="emerald" />
                </div>
                <NodeBox label="Datos" sublabel="contenido real" variant="data" delay={0.3} />

                {/* --- ROW 2: Hard_Link → I-Nodo 5 (same!) --- */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="relative"
                >
                    <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden md:block" />
                    <NodeBox label="Hard_Link" variant="directory" delay={0} />
                </motion.div>
                <div className="flex items-center justify-center self-center">
                    <Arrow className="w-6 md:w-10 h-3" color="emerald" />
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center"
                >
                    <div className="px-3 py-2 rounded-xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5">
                        <span className="text-[10px] md:text-xs font-bold text-emerald-500">↑ Mismo I-Nodo 5</span>
                    </div>
                </motion.div>
                <div /> {/* No arrow */}
                <div /> {/* No data block (shared) */}

                {/* --- Spacer row --- */}
                <div className="col-span-5 h-2 md:h-4" />

                {/* --- ROW 3: Archivo_Original_2 → I-Nodo 7 → Datos --- */}
                <NodeBox label="Archivo_2.txt" variant="directory" delay={0.6} />
                <div className="flex items-center justify-center self-center">
                    <Arrow className="w-6 md:w-10 h-3" color="emerald" />
                </div>
                <NodeBox label="I-Nodo 7" variant="inode" delay={0.7} />
                <div className="flex items-center justify-center self-center">
                    <Arrow className="w-6 md:w-10 h-3" color="emerald" />
                </div>
                <NodeBox label="Datos" sublabel="contenido real" variant="data" delay={0.8} />

                {/* --- ROW 4: Soft_Link → I-Nodo 93 → Path string --- */}
                <NodeBox label="Soft_Link" variant="directory" delay={0.9} />
                <div className="flex items-center justify-center self-center">
                    <Arrow className="w-6 md:w-10 h-3" dashed color="cyan" />
                </div>
                <NodeBox label="I-Nodo 93" sublabel="(propio)" variant="inode" delay={1.0} />
                <div className="flex items-center justify-center self-center">
                    <Arrow className="w-6 md:w-10 h-3" dashed color="cyan" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.1 }}
                >
                    <NodeBox label="/path/Archivo_2.txt" sublabel="solo guarda la ruta" variant="data" delay={0} />
                </motion.div>
            </div>

            {/* Soft Link curved arrow visual hint */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3 }}
                className="mt-4 md:mt-6 flex items-center justify-center gap-3"
            >
                <div className="flex-1 h-px bg-border" />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <div className="w-4 h-0.5 border-t-2 border-dashed border-cyan-400" />
                    <span className="text-[10px] md:text-xs font-bold text-cyan-400">
                        Soft Link → si borrás el original, el link queda roto
                    </span>
                </div>
                <div className="flex-1 h-px bg-border" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4 }}
                className="mt-3 flex items-center justify-center gap-3"
            >
                <div className="flex-1 h-px bg-border" />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-4 h-0.5 border-t-2 border-emerald-500" />
                    <span className="text-[10px] md:text-xs font-bold text-emerald-500">
                        Hard Link → ambos nombres apuntan al mismo I-Nodo real
                    </span>
                </div>
                <div className="flex-1 h-px bg-border" />
            </motion.div>

            {/* Source credit */}
            <p className="text-[10px] text-muted-foreground/50 text-right mt-4 italic">
                Fuente: Ramiro Delizarralde (adaptado)
            </p>
        </motion.div>
    );
};

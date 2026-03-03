import React from 'react';
import { Terminal, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeWindowProps {
    children: React.ReactNode;
    language?: string;
    variant?: 'code' | 'terminal';
    className?: string;
}

export const CodeWindow: React.FC<CodeWindowProps> = ({
    children,
    language,
    variant = 'code',
    className
}) => (
    <div className={cn("bg-[#0d1117] rounded-2xl overflow-hidden border border-border/50", className)}>
        <CodeWindowHeader language={language} variant={variant} />
        <div className="p-6 overflow-x-auto">
            {children}
        </div>
    </div>
);

interface CodeWindowHeaderProps {
    language?: string;
    variant?: 'code' | 'terminal';
}

export const CodeWindowHeader: React.FC<CodeWindowHeaderProps> = ({
    language,
    variant = 'code'
}) => {
    const Icon = variant === 'terminal' ? Terminal : Code;
    const label = language || (variant === 'terminal' ? 'Terminal' : 'Código');

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/5 border-b border-border/10">
            <div className="flex items-center gap-2">
                {variant === 'code' ? (
                    <div className="p-2 rounded-xl bg-primary/10">
                        <Icon className="w-4 h-4 text-primary" />
                    </div>
                ) : (
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="text-[10px] font-mono text-muted-foreground font-bold tracking-widest uppercase">
                    {label}
                </span>
            </div>
            <TrafficLights />
        </div>
    );
};

export const TrafficLights: React.FC = () => (
    <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/10" />
    </div>
);

interface CodeBlockProps {
    children: React.ReactNode;
    className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => (
    <pre className={cn("text-sm font-mono text-slate-300 leading-relaxed", className)}>
        <code>{children}</code>
    </pre>
);

interface TerminalCommandProps {
    command: string;
}

export const TerminalCommand: React.FC<TerminalCommandProps> = ({ command }) => (
    <code className="text-emerald-400 font-mono text-sm leading-relaxed break-all">
        $ {command}
    </code>
);

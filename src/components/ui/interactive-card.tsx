import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── InteractiveCard ─── */

interface InteractiveCardProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onClick?: () => void;
    className?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
    children,
    isOpen = false,
    onClick,
    className
}) => (
    <div
        className={cn(
            "group/q bg-card border rounded-[2rem] p-6 transition-all duration-500 cursor-pointer select-none",
            isOpen
                ? "border-primary/30 shadow-2xl shadow-primary/5 ring-1 ring-primary/10"
                : "border-border hover:border-primary/20 hover:bg-muted/30 shadow-sm",
            className
        )}
        onClick={onClick}
    >
        {children}
    </div>
);

/* ─── RevealBadge ─── */

interface RevealBadgeProps {
    isOpen: boolean;
}

export const RevealBadge: React.FC<RevealBadgeProps> = ({ isOpen }) => (
    <div className={cn(
        "px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-500",
        isOpen ? "bg-primary/10 text-primary opacity-100" : "bg-muted text-muted-foreground opacity-40"
    )}>
        {isOpen ? "OCULTAR" : "REVELAR"}
    </div>
);

/* ─── ChatBubble ─── */

interface ChatBubbleProps {
    name: string;
    message: React.ReactNode;
    isExpert?: boolean;
    index?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
    name,
    message,
    isExpert = false,
    index = 0
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
            duration: 0.5,
            delay: index * 0.15,
            type: "spring",
            stiffness: 100
        }}
        className={cn(
            "flex items-end gap-3",
            isExpert ? "flex-row-reverse" : "flex-row"
        )}
    >
        {/* Avatar */}
        <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 shadow-lg",
            isExpert
                ? "bg-primary border-primary/20 text-primary-foreground rotate-3"
                : "bg-card border-border text-muted-foreground -rotate-3"
        )}>
            <User className="w-6 h-6" />
        </div>

        {/* Message Bubble */}
        <div className={cn(
            "flex flex-col gap-1.5 max-w-[85%] md:max-w-[70%]",
            isExpert ? "items-end" : "items-start"
        )}>
            <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-tighter px-2">
                {name} {isExpert && "✨"}
            </span>
            <div className={cn(
                "p-4 md:p-5 rounded-3xl text-sm md:text-base leading-relaxed shadow-xl border backdrop-blur-sm transition-all hover:scale-[1.01]",
                isExpert
                    ? "bg-primary text-primary-foreground border-primary/20 rounded-br-none shadow-primary/20"
                    : "bg-card/80 border-border rounded-bl-none text-foreground shadow-black/5"
            )}>
                {message}
            </div>
        </div>
    </motion.div>
);

/* ─── VerdictCard ─── */

interface VerdictCardProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ children, delay = 0, className }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, type: "spring" }}
        className={cn(
            "mt-16 p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 relative overflow-hidden group shadow-2xl",
            className
        )}
    >
        {children}
    </motion.div>
);

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    // Prevent scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {children}
                </div>
            )}
        </AnimatePresence>
    );
};

export const ModalOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
    />
);

interface ModalContentProps {
    children: React.ReactNode;
    className?: string;
}

export const ModalContent: React.FC<ModalContentProps> = ({ children, className }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
            "relative w-full max-h-[90vh] overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-2xl flex flex-col pointer-events-auto",
            className
        )}
    >
        {children}
    </motion.div>
);

interface ModalHeaderProps {
    children: React.ReactNode;
    onClose: () => void;
    className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, onClose, className }) => (
    <div className={cn("flex items-center justify-between p-6 border-b border-border bg-muted/30 shrink-0", className)}>
        {children}
        <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 z-50"
        >
            <X className="w-5 h-5" />
        </button>
    </div>
);

interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => (
    <div className={cn("flex-1 overflow-y-auto no-scrollbar", className)}>
        {children}
    </div>
);

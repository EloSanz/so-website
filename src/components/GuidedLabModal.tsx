'use client';

import React from 'react';
import { GuidedLab as GuidedLabType } from '@/lib/data/types';
import { GuidedLab } from './GuidedLab';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody } from './ui/modal';

interface GuidedLabModalProps {
    lab: GuidedLabType | null;
    isOpen: boolean;
    onClose: () => void;
}

export const GuidedLabModal: React.FC<GuidedLabModalProps> = ({ lab, isOpen, onClose }) => {
    if (!lab) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay onClose={onClose} />
            <ModalContent className="max-w-5xl">
                <ModalHeader onClose={onClose}>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 w-fit">
                            Laboratorio Guiado
                        </span>
                        <h2 className="text-xl font-bold tracking-tight">{lab.title}</h2>
                    </div>
                </ModalHeader>
                <ModalBody className="p-6 md:p-10 custom-scrollbar">
                    <GuidedLab lab={lab} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

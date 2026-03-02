export interface Topic {
    id: string;
    title: string;
    content?: {
        description: string;
        items?: string[];
        highlight?: string;
        code?: {
            language: string;
            snippet: string;
            revealQuestion?: string;
            revealAnswer?: string;
        };
    };
}

export interface LabStep {
    id: string;
    title: string;
    description: string;
    command?: string;
    code?: string;
    explanation: string;
    technicalDetail?: string;
}

export interface GuidedLab {
    id: string;
    title: string;
    difficulty: 'Fácil' | 'Medio' | 'Duro';
    description: string;
    steps: LabStep[];
}

export interface ChatMessage {
    role: 'student' | 'expert';
    name: string;
    message: string;
    isRight?: boolean;
}

export interface ModuleConversation {
    id: string;
    title: string;
    topic: string;
    messages: ChatMessage[];
    conclusion: {
        winner: string;
        explanation: string;
    };
}
export interface PracticalChallenge {
    id: string;
    title: string;
    description: string;
    task: string;
    hints?: string[];
    solutionCode?: {
        language: string;
        code: string;
    };
}

export interface Module {
    id: string;
    title: string;
    unit: string;
    advancedFocus: string;
    topics?: Topic[];
    lab: {
        language: string;
        task: string;
    };
    guidedLabs?: GuidedLab[];
    challenge?: PracticalChallenge;
    conversation?: ModuleConversation;
    animations: {
        id: string;
        title: string;
        description: string;
    }[];
    examQuestions?: {
        type: 'V/F' | 'Desarrollo';
        question: string;
        answer: string;
        explanation?: string;
    }[];
}

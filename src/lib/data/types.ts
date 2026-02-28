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

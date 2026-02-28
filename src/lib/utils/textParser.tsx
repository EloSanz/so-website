import React from 'react';
import { LexiconTerm } from '@/components/LexiconTerm';

/**
 * Parses a string and replaces:
 * 1. Patterns like [[Term|Definition]] with the LexiconTerm component.
 * 2. Patterns like **text** with a <strong> tag.
 * @param text The string to parse
 * @returns An array of React nodes
 */
export const parseTextWithTerms = (text: string) => {
    if (!text) return null;

    // Combined regex to match [[Term|Definition]] OR **bold**
    // Group 1 & 2: Term and Definition from [[Term|Definition]]
    // Group 3: Text from **text**
    const regex = /\[\[(.*?)\|(.*?)\]\]|\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add the text before the match
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        if (match[1] !== undefined) {
            // It's a [[Term|Definition]] match
            parts.push(
                <LexiconTerm
                    key={`term-${match.index}`}
                    term={match[1]}
                    definition={match[2]}
                />
            );
        } else if (match[3] !== undefined) {
            // It's a **bold** match
            parts.push(
                <strong key={`bold-${match.index}`} className="font-bold text-foreground drop-shadow-sm">
                    {match[3]}
                </strong>
            );
        }


        lastIndex = regex.lastIndex;
    }

    // Add the remaining text
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
};


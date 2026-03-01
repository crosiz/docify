"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface TypingEffectProps {
    content: string;
    speed?: number; // ms per character
}

export function TypingEffect({ content, speed = 15 }: TypingEffectProps) {
    const [displayedContent, setDisplayedContent] = useState("")

    useEffect(() => {
        let index = 0;
        setDisplayedContent(""); // Reset when content changes

        const timer = setInterval(() => {
            if (index < content.length) {
                setDisplayedContent((prev) => prev + content.charAt(index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [content, speed]);

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {displayedContent}
        </ReactMarkdown>
    )
}

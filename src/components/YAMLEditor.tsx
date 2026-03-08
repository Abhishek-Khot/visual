import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Check } from 'lucide-react';

interface YAMLEditorProps {
    content: string;
    sensitiveKeys?: string[];
    blockedItems?: string[];
    allowedItems?: string[];
    typingSpeed?: number;
}

const YAMLEditor: React.FC<YAMLEditorProps> = ({
    content,
    sensitiveKeys = [],
    blockedItems = [],
    allowedItems = [],
    typingSpeed = 25,
}) => {
    const lines = content.split('\n');
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        setVisibleLines(0);
        const interval = setInterval(() => {
            setVisibleLines((prev) => {
                if (prev >= lines.length) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, typingSpeed);
        return () => clearInterval(interval);
    }, [content, typingSpeed, lines.length]);

    const getLineStyle = (line: string) => {
        const trimmed = line.trim();

        // Comment
        if (trimmed.startsWith('#')) return { color: '#6b7280' };

        // Check for sensitive fields
        for (const key of sensitiveKeys) {
            if (trimmed.includes(key + ':') || trimmed.includes(key + ' :')) {
                return { color: '#f87171', isSensitive: true };
            }
        }

        // Check for blocked items
        for (const item of blockedItems) {
            if (trimmed.includes(`"${item}"`) || trimmed.includes(`'${item}'`) || trimmed.includes(`- "${item}"`)) {
                return { color: '#f87171', isBlocked: true };
            }
        }

        // Check for allowed items
        for (const item of allowedItems) {
            if (trimmed.includes(`"${item}"`) || trimmed.includes(`'${item}'`) || trimmed.includes(`- "${item}"`)) {
                return { color: '#4ade80', isAllowed: true };
            }
        }

        // Key
        if (trimmed.includes(':')) return { color: '#c084fc' };

        // Value
        return { color: '#e2e8f0' };
    };

    const maskValue = (line: string): string => {
        // Replace the value after : with masked version
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) return line;
        const key = line.slice(0, colonIdx + 1);
        return `${key} "***MASKED***"`;
    };

    return (
        <div className="terminal overflow-auto max-h-[350px]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">yaml editor</span>
            </div>

            <pre className="text-[11px] leading-relaxed">
                {lines.slice(0, visibleLines).map((line, i) => {
                    const style = getLineStyle(line);
                    const isSensitive = 'isSensitive' in style && style.isSensitive;
                    const isBlocked = 'isBlocked' in style && style.isBlocked;
                    const isAllowed = 'isAllowed' in style && style.isAllowed;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.1 }}
                            className="flex items-center gap-2"
                        >
                            <span className="text-slate-700 w-5 text-right select-none text-[9px]">
                                {i + 1}
                            </span>
                            <span style={{ color: style.color }}>
                                {isSensitive ? maskValue(line) : line}
                            </span>
                            {isSensitive && (
                                <Shield size={10} className="text-green-400 shrink-0" />
                            )}
                            {isBlocked && (
                                <Lock size={10} className="text-red-400 shrink-0" />
                            )}
                            {isAllowed && (
                                <Check size={10} className="text-green-400 shrink-0" />
                            )}
                        </motion.div>
                    );
                })}
            </pre>
        </div>
    );
};

export default React.memo(YAMLEditor);

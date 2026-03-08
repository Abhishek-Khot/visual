import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTokenize, type MockToken } from '../utils/tiktoken';

interface TokenVizProps {
    text: string;
    budget?: number;
    animate?: boolean;
}

const tokenColors: Record<string, string> = {
    word: '#22d3ee',
    subword: '#c084fc',
    special: '#fde047',
    punctuation: '#94a3b8',
};

const TokenViz: React.FC<TokenVizProps> = ({ text, budget = 4096, animate = true }) => {
    const tokens = mockTokenize(text);
    const [visibleCount, setVisibleCount] = useState(animate ? 0 : tokens.length);

    useEffect(() => {
        if (!animate) {
            setVisibleCount(tokens.length);
            return;
        }
        setVisibleCount(0);
        const interval = setInterval(() => {
            setVisibleCount((prev) => {
                if (prev >= tokens.length) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 80);
        return () => clearInterval(interval);
    }, [text, animate, tokens.length]);

    const remaining = budget - tokens.length;
    const usedPct = (tokens.length / budget) * 100;

    return (
        <div className="glass p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">tiktoken tokenization</span>
                <span className="font-mono">
                    {visibleCount}/{tokens.length} tokens
                </span>
            </div>

            {/* Token chips */}
            <div className="flex flex-wrap gap-1 min-h-[40px]">
                <AnimatePresence>
                    {tokens.slice(0, visibleCount).map((token: MockToken, i: number) => (
                        <motion.span
                            key={`${token.text}-${i}`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="inline-flex items-baseline gap-0.5 px-1.5 py-0.5 rounded text-xs font-mono"
                            style={{
                                background: `${tokenColors[token.type]}15`,
                                border: `1px solid ${tokenColors[token.type]}33`,
                                color: tokenColors[token.type],
                            }}
                        >
                            {token.text}
                            <sub className="text-[8px] opacity-50">{token.id}</sub>
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>

            {/* Budget bar */}
            <div className="space-y-1">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{
                            background: usedPct > 80 ? '#f87171' : usedPct > 50 ? '#fcd34d' : '#22c55e',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(usedPct, 100)}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>{tokens.length} used</span>
                    <span>{remaining} remaining / {budget} budget</span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(TokenViz);

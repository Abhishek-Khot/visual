import React from 'react';
import { motion } from 'framer-motion';

interface ScoreBarProps {
    score: number;
    threshold?: number;
    label?: string;
    showThreshold?: boolean;
}

const ScoreBar: React.FC<ScoreBarProps> = ({
    score,
    threshold = 0.6,
    label,
    showThreshold = true,
}) => {
    const pct = score * 100;
    const color = score >= 0.8 ? '#22c55e' : score >= 0.6 ? '#eab308' : '#ef4444';
    const gradient = score >= 0.8
        ? 'linear-gradient(90deg, #22c55e, #16a34a)'
        : score >= 0.6
            ? 'linear-gradient(90deg, #eab308, #f59e0b)'
            : 'linear-gradient(90deg, #ef4444, #dc2626)';

    return (
        <div className="space-y-1">
            {label && (
                <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-500">{label}</span>
                    <span style={{ color }}>{score.toFixed(2)} ({Math.round(pct)}%)</span>
                </div>
            )}
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                {showThreshold && (
                    <div
                        className="absolute top-0 h-full w-px border-l border-dashed z-10"
                        style={{
                            left: `${threshold * 100}%`,
                            borderColor: 'rgba(255,255,255,0.3)',
                        }}
                    />
                )}
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: gradient }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
};

export default React.memo(ScoreBar);

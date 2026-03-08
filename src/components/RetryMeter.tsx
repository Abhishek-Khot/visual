import React from 'react';
import { motion } from 'framer-motion';
import type { RetryAttempt } from '../types';
import { RefreshCw, Check, X } from 'lucide-react';

interface RetryMeterProps {
    attempts: RetryAttempt[];
    threshold?: number;
}

const RetryMeter: React.FC<RetryMeterProps> = ({ attempts, threshold = 0.6 }) => {
    return (
        <div className="glass p-4 space-y-3">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <RefreshCw size={12} className="text-purple-400" />
                <span>Retry Attempts — threshold: {threshold.toFixed(2)}</span>
            </div>

            <div className="flex flex-col gap-2">
                {attempts.map((attempt, i) => {
                    const isPassing = attempt.status === 'pass';
                    const barColor = isPassing ? '#22c55e' : attempt.score >= 0.5 ? '#eab308' : '#ef4444';
                    const pct = attempt.score * 100;

                    return (
                        <React.Fragment key={i}>
                            <motion.div
                                className="flex-1 glass p-3 space-y-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.3, duration: 0.4 }}
                                style={{
                                    borderColor: isPassing ? '#22c55e33' : '#f8717133',
                                }}
                            >
                                {/* Attempt number */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-slate-500">
                                        Attempt {attempt.attemptNumber}
                                    </span>
                                    {isPassing ? (
                                        <Check size={12} className="text-green-400" />
                                    ) : (
                                        <X size={12} className="text-red-400" />
                                    )}
                                </div>

                                {/* Score bar */}
                                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                                    {/* Threshold line */}
                                    <div
                                        className="absolute top-0 h-full w-px border-l border-dashed border-white/30 z-10"
                                        style={{ left: `${threshold * 100}%` }}
                                    />
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: barColor }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ delay: i * 0.3 + 0.2, duration: 0.5 }}
                                    />
                                </div>

                                <div className="flex justify-between text-[10px] font-mono">
                                    <span style={{ color: barColor }}>{attempt.score.toFixed(2)}</span>
                                    <span className="text-slate-600">{attempt.latencyMs}ms</span>
                                </div>

                                {/* Query snippet */}
                                <div className="text-[9px] font-mono text-slate-500 truncate">
                                    {attempt.query}
                                </div>
                            </motion.div>

                            {/* Arrow between attempts */}
                            {i < attempts.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: (i + 1) * 0.3 }}
                                    className="flex flex-col items-center text-purple-400"
                                >
                                    <RefreshCw size={10} />
                                    <span className="text-[8px] font-mono text-purple-400/60">retry</span>
                                </motion.div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(RetryMeter);

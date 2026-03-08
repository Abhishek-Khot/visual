import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap } from 'lucide-react';

interface Thread {
    id: number;
    label: string;
    target: string;
    color: string;
    status: 'idle' | 'spawning' | 'running';
}

const threadDefs: Omit<Thread, 'status'>[] = [
    { id: 1, label: 'Thread-1', target: 'Jira', color: '#c084fc' },
    { id: 2, label: 'Thread-2', target: 'MinIO', color: '#fb923c' },
    { id: 3, label: 'Thread-3', target: 'FileSystem', color: '#94a3b8' },
    { id: 4, label: 'Thread-4', target: 'WebSearch', color: '#fde047' },
];

interface ThreadPoolVizProps {
    animate?: boolean;
}

const ThreadPoolViz: React.FC<ThreadPoolVizProps> = ({ animate = true }) => {
    const [threads, setThreads] = useState<Thread[]>(
        threadDefs.map((t) => ({ ...t, status: 'idle' as const }))
    );
    const [allRunning, setAllRunning] = useState(false);

    useEffect(() => {
        if (!animate) {
            setThreads(threadDefs.map((t) => ({ ...t, status: 'running' })));
            setAllRunning(true);
            return;
        }

        threadDefs.forEach((_, i) => {
            setTimeout(() => {
                setThreads((prev) =>
                    prev.map((t, j) => j === i ? { ...t, status: 'spawning' } : t)
                );
            }, i * 400);
            setTimeout(() => {
                setThreads((prev) =>
                    prev.map((t, j) => j === i ? { ...t, status: 'running' } : t)
                );
            }, i * 400 + 300);
        });

        setTimeout(() => setAllRunning(true), threadDefs.length * 400 + 500);
    }, [animate]);

    return (
        <div className="glass-strong p-5 space-y-4 max-w-sm w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Cpu size={14} className="text-cyan-400" />
                    Thread Pool Manager
                </div>
                <span className="text-[9px] font-mono text-slate-600">
                    connectionManager.py
                </span>
            </div>

            {/* CPU icon */}
            <div className="flex justify-center">
                <motion.div
                    animate={allRunning ? {
                        boxShadow: [
                            '0 0 0px rgba(34,211,238,0)',
                            '0 0 24px rgba(34,211,238,0.4)',
                            '0 0 0px rgba(34,211,238,0)',
                        ],
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-14 h-14 rounded-xl glass flex items-center justify-center"
                    style={{ borderColor: 'rgba(34,211,238,0.3)' }}
                >
                    <Cpu size={24} className="text-cyan-400" />
                </motion.div>
            </div>

            {/* Thread slots */}
            <div className="space-y-2">
                {threads.map((thread) => (
                    <motion.div
                        key={thread.id}
                        initial={{ opacity: 0.3 }}
                        animate={{
                            opacity: thread.status === 'idle' ? 0.3 : 1,
                        }}
                        className="flex items-center gap-2"
                    >
                        {/* Thread chip */}
                        <div
                            className="flex items-center gap-1.5 glass px-2.5 py-1.5 min-w-[90px] text-[11px] font-mono"
                            style={{
                                borderColor: thread.status === 'running' ? `${thread.color}44` : 'transparent',
                                boxShadow: thread.status === 'running' ? `0 0 10px ${thread.color}22` : 'none',
                            }}
                        >
                            {thread.status === 'spawning' ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.5 }}>
                                    <Zap size={9} className="text-amber-400" />
                                </motion.div>
                            ) : thread.status === 'running' ? (
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: thread.color }} />
                                </motion.div>
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            )}
                            <span className="text-slate-400">{thread.label}</span>
                        </div>

                        {/* Arrow */}
                        {thread.status === 'running' && (
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                className="text-slate-600 flex items-center"
                            >
                                <div className="w-6 h-px" style={{ background: thread.color }} />
                                <div className="w-0 h-0 border-t-[3px] border-b-[3px] border-l-[5px] border-transparent"
                                    style={{ borderLeftColor: thread.color }} />
                            </motion.div>
                        )}

                        {/* Target */}
                        {thread.status === 'running' && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-mono"
                                style={{ color: thread.color }}
                            >
                                {thread.target}
                            </motion.span>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Status */}
            <AnimatePresence>
                {allRunning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-[10px] font-mono text-cyan-400/80"
                    >
                        ⚡ Parallel Execution Enabled — 4 threads active
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(ThreadPoolViz);

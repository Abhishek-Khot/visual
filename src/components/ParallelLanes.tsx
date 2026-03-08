import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Image, Folder, Globe, Clock, Check, RefreshCw, AlertTriangle } from 'lucide-react';

interface Lane {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    durationMs: number;
    score: number;
    status: 'pending' | 'running' | 'retry' | 'complete';
    retryCount?: number;
    resultCount?: number;
    resultLabel?: string;
}

interface ParallelLanesProps {
    animate?: boolean;
}

const lanes: Lane[] = [
    {
        id: 'jira', label: 'jiraSkill — Lane A', icon: <ClipboardList size={14} />,
        color: '#60a5fa', durationMs: 340, score: 0.94, status: 'complete',
        resultCount: 7, resultLabel: '7 tasks',
    },
    {
        id: 'minio', label: 'minioSkill — Lane B', icon: <Image size={14} />,
        color: '#fb923c', durationMs: 1240, score: 0.87, status: 'complete',
        retryCount: 3, resultCount: 12, resultLabel: '12 photos (3 retries)',
    },
    {
        id: 'fs', label: 'fileSystemSkill — Lane C', icon: <Folder size={14} />,
        color: '#cbd5e1', durationMs: 180, score: 0.91, status: 'complete',
        resultCount: 3, resultLabel: '3 PDFs',
    },
    {
        id: 'web', label: 'webSearchSkill — Lane D', icon: <Globe size={14} />,
        color: '#c084fc', durationMs: 520, score: 0.88, status: 'complete',
        resultCount: 3, resultLabel: '3 articles (2 filtered)',
    },
];

const MAX_DURATION = 1400; // for width calculation

const ParallelLanes: React.FC<ParallelLanesProps> = ({ animate = true }) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!animate) {
            setElapsed(MAX_DURATION);
            return;
        }
        setElapsed(0);
        const start = Date.now();
        const frame = () => {
            const ms = Date.now() - start;
            const scaled = ms * 0.7; // speed up visualization
            setElapsed(scaled);
            if (scaled < MAX_DURATION) {
                requestAnimationFrame(frame);
            }
        };
        requestAnimationFrame(frame);
    }, [animate]);

    return (
        <div className="glass p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Parallel Execution Lanes</span>
                <div className="flex items-center gap-1.5 font-mono text-amber-300">
                    <Clock size={11} />
                    <span>{Math.min(Math.round(elapsed), MAX_DURATION)}ms</span>
                </div>
            </div>

            {/* Lanes */}
            <div className="space-y-2">
                {lanes.map((lane) => {
                    const widthPct = Math.min((lane.durationMs / MAX_DURATION) * 100, 100);
                    const isComplete = elapsed >= lane.durationMs;
                    const progress = Math.min(elapsed / lane.durationMs, 1);

                    return (
                        <div key={lane.id} className="lane-track p-2.5 space-y-1.5">
                            {/* Label row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2" style={{ color: lane.color }}>
                                    {lane.icon}
                                    <span className="text-[11px] font-mono">{lane.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {lane.retryCount && (
                                        <span className="flex items-center gap-1 text-[9px] font-mono text-purple-400">
                                            <RefreshCw size={9} /> ×{lane.retryCount}
                                        </span>
                                    )}
                                    {isComplete ? (
                                        <Check size={12} className="text-green-400" />
                                    ) : progress > 0 ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        >
                                            <AlertTriangle size={10} style={{ color: lane.color }} />
                                        </motion.div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Progress track */}
                            <div className="relative h-3 bg-white/5 rounded overflow-hidden">
                                <motion.div
                                    className="h-full rounded"
                                    style={{
                                        background: `linear-gradient(90deg, ${lane.color}88, ${lane.color})`,
                                        width: `${widthPct * progress}%`,
                                    }}
                                    transition={{ duration: 0.1 }}
                                />
                                {/* Retry segments for minio */}
                                {lane.retryCount && lane.retryCount > 1 && (
                                    <>
                                        <div
                                            className="absolute top-0 h-full w-px bg-purple-400/50"
                                            style={{ left: `${(800 / MAX_DURATION) * 100}%` }}
                                        />
                                        <div
                                            className="absolute top-0 h-full w-px bg-purple-400/50"
                                            style={{ left: `${(1150 / MAX_DURATION) * 100}%` }}
                                        />
                                    </>
                                )}
                            </div>

                            {/* Bottom stats */}
                            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                                <span>{lane.durationMs}ms</span>
                                {isComplete && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-1"
                                    >
                                        <span style={{ color: lane.color }}>{lane.resultLabel}</span>
                                        <span className="text-slate-600">·</span>
                                        <span className={lane.score >= 0.8 ? 'text-green-400' : lane.score >= 0.6 ? 'text-yellow-400' : 'text-red-400'}>
                                            score: {lane.score.toFixed(2)}
                                        </span>
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(ParallelLanes);

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SceneStep } from '../types';
import ScoreBar from './ScoreBar';
import { Clock, Layers, AlertTriangle, FileCode } from 'lucide-react';
import { formatDuration } from '../utils/formatting';

interface StepCardProps {
    step: SceneStep;
    stepIndex: number;
    totalSteps: number;
}

const actLabels: Record<number, string> = {
    1: 'Act 1 — The Problem',
    2: 'Act 2 — Chaos',
    3: 'Act 3 — Configuration',
    4: 'Act 4 — System Boot',
    5: 'Act 5 — Request Entry',
    6: 'Act 6 — Parallel Execution',
    7: 'Act 7 — Post-Processing & Result',
};

const painPointLabels: Record<string, string> = {
    architecture_bloat: 'Architecture Bloat',
    redundant_engineering: 'Redundant Engineering',
    scalability: 'Scalability Issues',
    auth_risk: 'Auth Layer Risks',
    no_orchestration: 'No Orchestration',
};

const StepCard: React.FC<StepCardProps> = ({ step, stepIndex, totalSteps }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="glass-strong p-5 w-full max-w-xs max-h-[80vh] overflow-y-auto space-y-3"
                role="region"
                aria-live="polite"
                aria-label={`Step ${stepIndex + 1}: ${step.title}`}
            >
                {/* Header */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400/70">
                            {actLabels[step.actNumber]}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600">
                            {stepIndex + 1}/{totalSteps}
                        </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">{step.title}</h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>

                {/* Code refs */}
                {step.codeRefs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {step.codeRefs.map((ref, i) => (
                            <span key={i} className="code-ref flex items-center gap-1">
                                <FileCode size={9} className="text-slate-500" />
                                {ref.symbol ? `${ref.file} → ${ref.symbol}` : ref.file}
                            </span>
                        ))}
                    </div>
                )}

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-2">
                    {step.durationMs !== undefined && step.durationMs > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                            <Clock size={9} />
                            {formatDuration(step.durationMs)}
                        </span>
                    )}
                    {step.parallelGroup && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-teal-400/70">
                            <Layers size={9} />
                            {step.parallelGroup}
                        </span>
                    )}
                </div>

                {/* Relevance score */}
                {step.relevanceScore !== undefined && (
                    <ScoreBar score={step.relevanceScore} label="Relevance" />
                )}

                {/* Token info */}
                {step.tokenInfo && (
                    <div className="glass p-2 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-amber-300/70">
                            <span>Tokens: {step.tokenInfo.inputTokens}</span>
                            <span>Budget: {step.tokenInfo.budgetTotal}</span>
                        </div>
                        {step.tokenInfo.tokensUsed && (
                            <div className="text-[10px] font-mono text-slate-500">
                                Context: {step.tokenInfo.tokensUsed} / {step.tokenInfo.budgetTotal} ✓
                            </div>
                        )}
                    </div>
                )}

                {/* Pain points */}
                {step.painPoints && step.painPoints.length > 0 && (
                    <div className="space-y-1.5">
                        {step.painPoints.map((pp) => (
                            <div
                                key={pp}
                                className="flex items-center gap-2 text-[10px] font-mono px-2 py-1.5 rounded-md"
                                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}
                            >
                                <AlertTriangle size={10} className="text-red-400 shrink-0" />
                                <span className="text-red-300">{painPointLabels[pp] || pp}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Security event */}
                {step.securityEvent && (
                    <div
                        className="text-[10px] font-mono px-2 py-1.5 rounded-md flex items-center gap-2"
                        style={{
                            background: step.securityEvent.type === 'blocked'
                                ? 'rgba(248,113,113,0.1)'
                                : step.securityEvent.type === 'masked'
                                    ? 'rgba(34,197,94,0.1)'
                                    : 'rgba(34,211,238,0.1)',
                            border: `1px solid ${step.securityEvent.type === 'blocked' ? 'rgba(248,113,113,0.2)'
                                    : step.securityEvent.type === 'masked' ? 'rgba(34,197,94,0.2)'
                                        : 'rgba(34,211,238,0.2)'
                                }`,
                        }}
                    >
                        <span className={
                            step.securityEvent.type === 'blocked' ? 'text-red-400'
                                : step.securityEvent.type === 'masked' ? 'text-green-400'
                                    : 'text-cyan-400'
                        }>
                            {step.securityEvent.type === 'blocked' ? '✗ BLOCKED' : step.securityEvent.type === 'masked' ? '🛡 MASKED' : '✓ ALLOWED'}
                        </span>
                        <span className="text-slate-500">{step.securityEvent.target}</span>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default React.memo(StepCard);

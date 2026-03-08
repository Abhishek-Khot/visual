import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Hash, Brain, Eye, Shield, Cpu, GitMerge,
    Sparkles, FileOutput, ArrowRight, Check, Loader,
} from 'lucide-react';

interface PipelineStage {
    id: string;
    name: string;
    codeRef: string;
    icon: React.ReactNode;
    color: string;
    durationMs: number;
}

const stages: PipelineStage[] = [
    { id: 'entry', name: 'Gateway Entry', codeRef: 'gateway.py', icon: <Zap size={14} />, color: '#22d3ee', durationMs: 15 },
    { id: 'tokenizer', name: 'Tokenizer', codeRef: 'tiktoken', icon: <Hash size={14} />, color: '#fcd34d', durationMs: 25 },
    { id: 'thinking', name: 'ThinkingEngine', codeRef: 'thinkingEngine.py', icon: <Brain size={14} />, color: '#22d3ee', durationMs: 85 },
    { id: 'reflection', name: 'ReflectionEngine', codeRef: 'reflectionEngine.py', icon: <Eye size={14} />, color: '#22d3ee', durationMs: 45 },
    { id: 'security', name: 'Security Filter', codeRef: 'allowlists.py', icon: <Shield size={14} />, color: '#f87171', durationMs: 10 },
    { id: 'threading', name: 'Thread Manager', codeRef: 'connectionManager.py', icon: <Cpu size={14} />, color: '#5eead4', durationMs: 100 },
    { id: 'parallel', name: 'Parallel Exec', codeRef: 'skills/*.py', icon: <ArrowRight size={14} />, color: '#5eead4', durationMs: 1240 },
    { id: 'aggregation', name: 'Aggregation', codeRef: 'responseBuilder.py', icon: <GitMerge size={14} />, color: '#5eead4', durationMs: 30 },
    { id: 'llm', name: 'LLM Summarizer', codeRef: 'llm/client.py', icon: <Sparkles size={14} />, color: '#fde047', durationMs: 650 },
    { id: 'response', name: 'Response Builder', codeRef: 'schema/response.py', icon: <FileOutput size={14} />, color: '#22d3ee', durationMs: 20 },
];

interface GatewayPipelineProps {
    activeStageIndex: number; // -1 = none, 0..9 = which stage is active
}

const GatewayPipeline: React.FC<GatewayPipelineProps> = ({ activeStageIndex }) => {
    const renderStage = (stage: PipelineStage, index: number) => {
        const globalIndex = stages.indexOf(stage);
        const isActive = globalIndex === activeStageIndex;
        const isPast = globalIndex < activeStageIndex;
        const isFuture = globalIndex > activeStageIndex;

        return (
            <motion.div
                key={stage.id}
                initial={{ opacity: 0.3 }}
                animate={{
                    opacity: isFuture ? 0.25 : 1,
                    scale: isActive ? 1.05 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="glass px-2.5 py-1.5 min-w-[90px] flex flex-col items-center gap-1 relative"
                style={{
                    borderColor: isActive ? `${stage.color}55` : isPast ? `${stage.color}22` : 'transparent',
                    boxShadow: isActive ? `0 0 20px ${stage.color}33, 0 0 40px ${stage.color}11` : 'none',
                }}
            >
                {/* Traveling packet */}
                {isActive && (
                    <motion.div
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                        style={{ background: stage.color, boxShadow: `0 0 8px ${stage.color}` }}
                        animate={{ y: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                )}

                <div style={{ color: isActive ? stage.color : isPast ? stage.color : '#475569' }}>
                    {isActive ? stage.icon : isPast ? <Check size={14} /> : stage.icon}
                </div>
                <span className="text-[10px] font-semibold text-center"
                    style={{ color: isActive ? '#fff' : isPast ? '#94a3b8' : '#475569' }}>
                    {stage.name}
                </span>
                <span className="text-[8px] font-mono"
                    style={{ color: isActive ? `${stage.color}aa` : '#334155' }}>
                    {stage.codeRef}
                </span>
                {isActive && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[8px] font-mono text-slate-500"
                    >
                        ~{stage.durationMs}ms
                    </motion.span>
                )}
            </motion.div>
        );
    };

    return (
        <div
            className="glass-strong p-4 space-y-3 w-full"
            style={{ borderColor: 'rgba(34,211,238,0.2)', maxWidth: '100%' }}
        >
            {/* Container label */}
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-cyan-400">
                    <Zap size={12} />
                    ASGP Gateway — Internal Pipeline
                </div>
                <span className="text-[9px] font-mono text-slate-600">
                    {activeStageIndex >= 0 ? `Stage ${activeStageIndex + 1}/${stages.length}` : 'Idle'}
                </span>
            </div>

            {/* Row 1: Entry → Security */}
            <div className="mt-1 flex items-center gap-1.5 justify-between flex-nowrap">
                {stages.map((stage, i) => (
                    <React.Fragment key={stage.id}>
                        {renderStage(stage, i)}
                        {i < stages.length - 1 && (
                            <motion.div
                                animate={{
                                    opacity: stages.indexOf(stage) < activeStageIndex ? 1 : 0.2,
                                    color: stages.indexOf(stage) < activeStageIndex ? '#22d3ee' : '#1e293b',
                                }}
                                className="text-xs"
                            >
                                →
                            </motion.div>
                        )}
                    </React.Fragment>
                ))}
            </div>

        </div>
    );
};

export default React.memo(GatewayPipeline);
export { stages as pipelineStages };

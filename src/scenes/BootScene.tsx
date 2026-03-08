import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { getStepsForScene, allSteps } from '../data/storySteps';
import StepCard from '../components/StepCard';
import TimelineControls from '../components/TimelineControls';
import Legend from '../components/Legend';
import ConfigLoaderViz from '../components/ConfigLoaderViz';
import SkillInjectionViz from '../components/SkillInjectionViz';
import ThreadPoolViz from '../components/ThreadPoolViz';
import { getStepDelay } from '../utils/timelines';
import {
    Check, CheckCircle, Zap, Wrench, Database, FileCode,
    Clipboard, Image, Folder, Globe, Shield,
} from 'lucide-react';

/* ─── Pydantic validation cards ─── */
const PydanticValidation: React.FC<{ animate: boolean }> = ({ animate }) => {
    const cards = [
        { name: 'GatewayConfig', fields: ['host', 'port', 'log_level', 'timeout'], color: '#22d3ee' },
        { name: 'DatasourceConfig', fields: ['mongo', 'mysql', 'filesystem', 'minio', 'jira', 'websearch'], color: '#f9a8d4' },
        { name: 'SecurityConfig', fields: ['allowlists', 'blocked_tables', 'mutations', 'read_only'], color: '#f87171' },
    ];

    return (
        <div className="flex gap-3 justify-center flex-wrap">
            {cards.map((card, ci) => (
                <motion.div
                    key={card.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.3 }}
                    className="glass-strong p-3 w-[200px] space-y-2"
                    style={{ borderColor: `${card.color}33` }}
                >
                    <div className="flex items-center gap-1.5">
                        <Shield size={10} style={{ color: card.color }} />
                        <span className="text-xs font-mono font-bold" style={{ color: card.color }}>{card.name}</span>
                    </div>
                    <div className="space-y-1">
                        {card.fields.map((field, fi) => (
                            <motion.div
                                key={field}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: ci * 0.3 + fi * 0.15 + 0.3 }}
                                className="flex items-center justify-between text-[10px] font-mono"
                            >
                                <span className="text-slate-400">{field}</span>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: ci * 0.3 + fi * 0.15 + 0.5, type: 'spring', stiffness: 500 }}
                                >
                                    <Check size={10} className="text-green-400" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

/* ─── Tool registry animation ─── */
const ToolRegistry: React.FC<{ animate: boolean }> = ({ animate }) => {
    const tools = [
        { name: 'mongo_tool', icon: <Database size={11} />, color: '#4ade80' },
        { name: 'mysql_tool', icon: <Database size={11} />, color: '#60a5fa' },
        { name: 'filesystem_tool', icon: <Folder size={11} />, color: '#94a3b8' },
        { name: 'minio_tool', icon: <Image size={11} />, color: '#fb923c' },
        { name: 'jira_tool', icon: <Clipboard size={11} />, color: '#c084fc' },
        { name: 'websearch_tool', icon: <Globe size={11} />, color: '#fde047' },
    ];

    return (
        <div className="glass-strong p-4 max-w-sm w-full space-y-3">
            <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 flex items-center gap-1.5">
                    <Wrench size={12} /> Tool Registry
                </span>
                <span className="text-[9px] font-mono text-slate-600">toolRegistry.py</span>
            </div>
            <div className="space-y-1.5">
                {tools.map((tool, i) => (
                    <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: i * 0.25,
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                        }}
                        className="flex items-center justify-between glass px-2.5 py-1.5"
                        style={{ borderColor: `${tool.color}22` }}
                    >
                        <div className="flex items-center gap-2">
                            <span style={{ color: tool.color }}>{tool.icon}</span>
                            <span className="text-[11px] font-mono text-slate-300">{tool.name}</span>
                        </div>
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.25 + 0.15, type: 'spring', stiffness: 500 }}
                        >
                            <CheckCircle size={12} className="text-green-400" />
                        </motion.div>
                    </motion.div>
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="text-center text-[10px] font-mono text-green-400/70"
            >
                ✓ 6 tools registered
            </motion.div>
        </div>
    );
};

/* ─── SubAgent Factory ─── */
const SubAgentFactory: React.FC<{ animate: boolean }> = ({ animate }) => {
    const agents = [
        { name: 'JiraSubAgent', color: '#c084fc' },
        { name: 'MinioSubAgent', color: '#fb923c' },
        { name: 'FileSubAgent', color: '#94a3b8' },
        { name: 'WebSearchSubAgent', color: '#fde047' },
        { name: 'MongoSubAgent', color: '#4ade80' },
        { name: 'MySQLSubAgent', color: '#60a5fa' },
    ];

    return (
        <div className="glass-strong p-5 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-teal-400 flex items-center gap-1.5">
                    <Zap size={12} /> DynamicSubAgentFactory
                </span>
                <span className="text-[9px] font-mono text-slate-600">subAgentFactory.py</span>
            </div>

            {/* Blueprint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass px-3 py-2 text-center"
                style={{ borderColor: 'rgba(94,234,212,0.2)' }}
            >
                <FileCode size={12} className="inline text-teal-400 mr-1.5" />
                <span className="text-[11px] font-mono text-teal-300">baseSubAgent.py — Blueprint</span>
            </motion.div>

            {/* Spawned agents — orbit layout */}
            <div className="relative h-36 flex items-center justify-center">
                {/* Central gateway */}
                <motion.div
                    animate={{
                        boxShadow: [
                            '0 0 0px rgba(34,211,238,0)',
                            '0 0 20px rgba(34,211,238,0.3)',
                            '0 0 0px rgba(34,211,238,0)',
                        ],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-12 h-12 rounded-xl glass flex items-center justify-center z-10"
                    style={{ borderColor: 'rgba(34,211,238,0.3)' }}
                >
                    <Zap size={18} className="text-cyan-400" />
                </motion.div>

                {/* Orbiting agents */}
                {agents.map((agent, i) => {
                    const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
                    const rx = 110;
                    const ry = 55;
                    const cx = Math.cos(angle) * rx;
                    const cy = Math.sin(angle) * ry;

                    return (
                        <motion.div
                            key={agent.name}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: cx,
                                y: cy,
                            }}
                            transition={{
                                delay: i * 0.2 + 0.5,
                                type: 'spring',
                                stiffness: 200,
                                damping: 15,
                            }}
                            className="absolute glass px-2 py-1 text-[9px] font-mono"
                            style={{
                                borderColor: `${agent.color}33`,
                                boxShadow: `0 0 8px ${agent.color}22`,
                            }}
                        >
                            <span style={{ color: agent.color }}>{agent.name}</span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

/* ─── System ready card ─── */
const SystemReady: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="glass-strong p-8 max-w-md w-full text-center space-y-4"
    >
        <motion.div
            animate={{
                boxShadow: [
                    '0 0 0px rgba(34,211,238,0)',
                    '0 0 30px rgba(34,211,238,0.4)',
                    '0 0 0px rgba(34,211,238,0)',
                ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 rounded-2xl mx-auto glass flex items-center justify-center"
            style={{ borderColor: 'rgba(34,211,238,0.4)' }}
        >
            <Zap size={28} className="text-cyan-400" />
        </motion.div>
        <h3 className="text-lg font-bold text-white">ASGP Gateway — Initialized</h3>
        <div className="space-y-1.5 text-sm text-slate-400">
            {[
                '9 skills injected • 6 tools registered',
                '6 data sources configured',
                'Security allowlists active • READ ONLY',
                'Thread pool ready • Parallel execution enabled',
            ].map((line, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 + 0.3 }}
                    className="flex items-center justify-center gap-2"
                >
                    <CheckCircle size={12} className="text-green-400" />
                    <span>{line}</span>
                </motion.div>
            ))}
        </div>
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-xs font-mono text-cyan-400/60 pt-2"
        >
            Ready to accept queries →
        </motion.p>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
     BOOT SCENE
   ═══════════════════════════════════════════════════════════════ */

const BootScene: React.FC = () => {
    const { currentStepIndex, isPlaying, speed, nextStep } = useAppStore();
    const steps = useMemo(() => getStepsForScene('boot'), []);
    const step = steps[currentStepIndex] || steps[0];
    const globalIdx = allSteps.indexOf(step);

    useEffect(() => {
        if (!isPlaying) return;
        const delay = getStepDelay(speed);
        const timer = setTimeout(() => nextStep(), delay);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, speed, nextStep]);

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="w-full max-w-3xl px-6">
                <AnimatePresence mode="wait">
                    {/* Step 1: Config loading */}
                    {step.id === 'boot-1' && (
                        <motion.div
                            key="config-loader"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex justify-center"
                        >
                            <ConfigLoaderViz animate />
                        </motion.div>
                    )}

                    {/* Step 2: Pydantic validation */}
                    {step.id === 'boot-2' && (
                        <motion.div
                            key="pydantic"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PydanticValidation animate />
                        </motion.div>
                    )}

                    {/* Step 3: Security init */}
                    {step.id === 'boot-3' && (
                        <motion.div
                            key="security-init"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-strong p-6 max-w-md mx-auto space-y-3"
                            style={{ borderColor: 'rgba(248,113,113,0.2)' }}
                        >
                            <div className="flex items-center gap-2 text-sm font-mono text-red-400">
                                <Shield size={14} />
                                Security Layer Initialized
                            </div>
                            {[
                                { label: 'MySQL → orders, invoices, billing_history', status: '✓ allowed', color: '#4ade80' },
                                { label: 'MySQL → user_passwords, admin_tokens', status: '✗ blocked', color: '#f87171' },
                                { label: 'MongoDB → user_profiles, preferences', status: '✓ allowed', color: '#4ade80' },
                                { label: 'MongoDB → session_tokens, admin_users', status: '✗ blocked', color: '#f87171' },
                                { label: 'Mutations → allow_write: false', status: 'READ ONLY', color: '#22d3ee' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="flex items-center justify-between text-[10px] font-mono"
                                >
                                    <span className="text-slate-400">{item.label}</span>
                                    <span style={{ color: item.color }}>{item.status}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Step 4: Tool registry */}
                    {step.id === 'boot-4' && (
                        <motion.div
                            key="tool-registry"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex justify-center"
                        >
                            <ToolRegistry animate />
                        </motion.div>
                    )}

                    {/* Step 5: Skill injection */}
                    {step.id === 'boot-5' && (
                        <motion.div
                            key="skill-inject"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex justify-center"
                        >
                            <SkillInjectionViz animate />
                        </motion.div>
                    )}

                    {/* Step 6: SubAgent factory */}
                    {step.id === 'boot-6' && (
                        <motion.div
                            key="subagent"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex justify-center"
                        >
                            <SubAgentFactory animate />
                        </motion.div>
                    )}

                    {/* Step 7: System ready */}
                    {step.id === 'boot-7' && (
                        <motion.div
                            key="ready"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center"
                        >
                            <SystemReady />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Step card */}
            <div className="absolute top-4 left-4 z-30">
                <StepCard step={step} stepIndex={globalIdx} totalSteps={allSteps.length} />
            </div>

            <Legend />

            <div className="absolute bottom-0 left-0 right-0 z-30">
                <TimelineControls totalSteps={steps.length} currentIndex={currentStepIndex} />
            </div>
        </div>
    );
};

export default React.memo(BootScene);

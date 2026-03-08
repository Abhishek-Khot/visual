import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { getStepsForScene, allSteps } from '../data/storySteps';
import { mockJiraTasks, mockMinioPhotos, mockInvoices, mockNewsArticles } from '../data/mockData';
import StepCard from '../components/StepCard';
import TimelineControls from '../components/TimelineControls';
import ScoreBar from '../components/ScoreBar';
import { getStepDelay } from '../utils/timelines';
import {
    ClipboardList, Image, FileText, Globe, Shield, Clock,
    BarChart, Lock, ArrowRight, TrendingUp,
} from 'lucide-react';

const ResultScene: React.FC = () => {
    const { currentStepIndex, isPlaying, speed, nextStep } = useAppStore();
    const steps = useMemo(() => getStepsForScene('result'), []);
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
            <div className="w-full max-w-5xl p-6">
                <AnimatePresence mode="wait">
                    {/* Dashboard */}
                    {step.id === 'res-1' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-5"
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-1">Alex's Unified Dashboard</h2>
                                <p className="text-sm text-slate-500">All results — from 4 sources, in parallel, with security</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Jira Tasks */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="glass-strong p-4 space-y-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <ClipboardList size={16} className="text-blue-400" />
                                        <span className="text-sm font-semibold text-white">Jira Tasks</span>
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">7 open</span>
                                    </div>
                                    <ScoreBar score={0.94} label="Relevance" />
                                    <div className="space-y-1.5">
                                        {mockJiraTasks.map((task) => (
                                            <div key={task.id} className="flex items-center justify-between text-xs font-mono">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-cyan-400">{task.id}</span>
                                                    <span className="text-slate-400 truncate max-w-[180px]">{task.title}</span>
                                                </div>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-500/15 text-red-400' :
                                                        task.priority === 'MEDIUM' ? 'bg-yellow-500/15 text-yellow-400' :
                                                            'bg-slate-500/15 text-slate-400'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* MinIO Photos */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="glass-strong p-4 space-y-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <Image size={16} className="text-orange-400" />
                                        <span className="text-sm font-semibold text-white">Project Phoenix Photos</span>
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400">12 found</span>
                                    </div>
                                    <ScoreBar score={0.87} label="Relevance (after retry)" />
                                    <div className="grid grid-cols-3 gap-1">
                                        {mockMinioPhotos.slice(0, 9).map((photo, i) => (
                                            <div
                                                key={photo.key}
                                                className="aspect-square max-h-14 rounded bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center"
                                            >
                                                <Image size={12} className="text-orange-400/40" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-[9px] font-mono text-slate-600 flex items-center gap-1">
                                        <Lock size={8} /> +3 more · Retrieved after 3 retries (0.41→0.87)
                                    </div>
                                </motion.div>

                                {/* Invoices */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="glass-strong p-4 space-y-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-slate-300" />
                                        <span className="text-sm font-semibold text-white">Last 3 Invoices</span>
                                    </div>
                                    <ScoreBar score={0.91} label="Relevance" />
                                    <div className="space-y-2">
                                        {mockInvoices.map((inv) => (
                                            <div key={inv.file} className="flex items-center justify-between text-xs font-mono">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={10} className="text-slate-500" />
                                                    <span className="text-cyan-400">{inv.file}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-green-400">{inv.amount}</span>
                                                    <span className="text-slate-600">{inv.vendor}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* News */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="glass-strong p-4 space-y-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <Globe size={16} className="text-purple-400" />
                                        <span className="text-sm font-semibold text-white">Deadline News</span>
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">3 relevant</span>
                                    </div>
                                    <ScoreBar score={0.88} label="Top Relevance" />
                                    <div className="space-y-2">
                                        {mockNewsArticles.filter(a => a.score >= 0.6).map((article) => (
                                            <div key={article.title} className="text-xs space-y-1">
                                                <span className="text-slate-300">{article.title}</span>
                                                <div className="flex items-center gap-2 text-[9px] font-mono">
                                                    <span className="text-purple-400">{article.source}</span>
                                                    <span className="text-slate-600">score: {article.score.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Final Stats */}
                    {step.id === 'res-2' && (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-strong p-8 max-w-2xl mx-auto space-y-6"
                        >
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Mission Complete</h2>
                                <p className="text-sm text-slate-400">From scattered data to unified intelligence — that's ASGP</p>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Data Sources', value: '4', icon: <BarChart size={14} />, color: '#22d3ee' },
                                    { label: 'Parallel Lanes', value: '4', icon: <ArrowRight size={14} />, color: '#5eead4' },
                                    { label: 'Retries (MinIO)', value: '3', icon: <TrendingUp size={14} />, color: '#e879f9' },
                                    { label: 'Query Tokens', value: '47', icon: <Clock size={14} />, color: '#fcd34d' },
                                    { label: 'Context Tokens', value: '1,894', icon: <Clock size={14} />, color: '#fcd34d' },
                                    { label: 'PII Masked', value: '8 fields', icon: <Shield size={14} />, color: '#f87171' },
                                ].map((stat) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="glass p-3 text-center"
                                    >
                                        <div className="flex justify-center mb-1" style={{ color: stat.color }}>{stat.icon}</div>
                                        <div className="text-lg font-bold text-white">{stat.value}</div>
                                        <div className="text-[9px] text-slate-500 font-mono">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="glass p-4 space-y-2">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-slate-500">MinIO Score Improvement</span>
                                    <span className="text-green-400">0.41 → 0.87</span>
                                </div>
                                <ScoreBar score={0.89} label="Answer Confidence" />
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-slate-500">Total Latency</span>
                                    <span className="text-cyan-400">1,847ms</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating step card in top-left, slightly smaller so it doesn't cover dashboard tiles */}
            <div className="absolute top-4 left-4 z-30 scale-90 origin-top-left">
                <StepCard step={step} stepIndex={globalIdx} totalSteps={allSteps.length} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-30">
                <TimelineControls totalSteps={steps.length} currentIndex={currentStepIndex} />
            </div>
        </div>
    );
};

export default React.memo(ResultScene);

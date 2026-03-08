import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { getStepsForScene, allSteps } from '../data/storySteps';
import { sceneNodes } from '../data/nodes';
import { sceneEdges } from '../data/edges';
import FlowCanvas from '../flow/FlowCanvas';
import StepCard from '../components/StepCard';
import TimelineControls from '../components/TimelineControls';
import PainPointCallout from '../components/PainPointCallout';
import Legend from '../components/Legend';
import { getStepDelay } from '../utils/timelines';
import { Terminal, AlertTriangle } from 'lucide-react';

/* ─── Query terminal component ─── */
const QueryTerminal: React.FC<{ visible: boolean }> = ({ visible }) => {
    const lines = [
        'Show me all my open Jira tasks,',
        'find photos from Project Phoenix,',
        'pull my last 3 invoices,',
        'and check if there is news about my deadline next week.',
    ];
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        if (!visible) { setVisibleLines(0); return; }
        const interval = setInterval(() => {
            setVisibleLines((prev) => {
                if (prev >= lines.length) { clearInterval(interval); return prev; }
                return prev + 1;
            });
        }, 400);
        return () => clearInterval(interval);
    }, [visible, lines.length]);

    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="terminal max-w-lg"
        >
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <Terminal size={11} className="text-slate-500" />
                <span className="text-[9px] text-slate-600 font-mono">alex@local ~</span>
            </div>
            <div className="space-y-0.5">
                <span className="prompt">$ </span>
                <span className="text-slate-500 text-[10px]">query</span>
                {lines.slice(0, visibleLines).map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-cyan-300/90 pl-4"
                    >
                        {line}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

/* ─── Code snippet floating card ─── */
const CodeSnippet: React.FC<{ code: string; visible: boolean }> = ({ code, visible }) => {
    if (!visible) return null;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="terminal text-[11px] max-w-xs"
        >
            <pre className="text-green-300/90">{code}</pre>
        </motion.div>
    );
};

/* ─── Complexity counter ─── */
const ComplexityCounter: React.FC<{ visible: boolean }> = ({ visible }) => {
    const [counts, setCounts] = useState({ connectors: 0, tokens: 0, retry: 0, unified: 0, boilerplate: 0 });

    useEffect(() => {
        if (!visible) { setCounts({ connectors: 0, tokens: 0, retry: 0, unified: 0, boilerplate: 0 }); return; }
        const targets = { connectors: 6, tokens: 6, retry: 0, unified: 0, boilerplate: 847 };
        const duration = 1500;
        const start = Date.now();
        const frame = () => {
            const elapsed = Date.now() - start;
            const t = Math.min(elapsed / duration, 1);
            setCounts({
                connectors: Math.round(t * targets.connectors),
                tokens: Math.round(t * targets.tokens),
                retry: 0,
                unified: 0,
                boilerplate: Math.round(t * targets.boilerplate),
            });
            if (t < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }, [visible]);

    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-strong p-4 space-y-2 max-w-xs"
        >
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">System Complexity</div>
            {[
                { label: 'Connector files', value: counts.connectors, color: '#fb923c' },
                { label: 'Auth tokens scattered', value: counts.tokens, color: '#f87171' },
                { label: 'Retry logic', value: counts.retry, color: '#ef4444', bad: true },
                { label: 'Unified query', value: counts.unified, color: '#ef4444', bad: true },
                { label: 'Boilerplate lines', value: counts.boilerplate, color: '#f87171' },
            ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{item.label}</span>
                    <span
                        className="font-bold tabular-nums"
                        style={{ color: item.bad && item.value === 0 ? '#ef4444' : item.color }}
                    >
                        {item.value}
                    </span>
                </div>
            ))}
        </motion.div>
    );
};

/* ─── Overlay message ─── */
const OverlayMessage: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`glass px-4 py-2 text-sm font-medium text-slate-300 italic ${className}`}
    >
        "{text}"
    </motion.div>
);

/* ─── Connection status tooltip ─── */
const StatusTooltip: React.FC<{ text: string; type: 'success' | 'warning' | 'error' }> = ({ text, type }) => {
    const colors = {
        success: 'text-green-400 border-green-500/20 bg-green-500/5',
        warning: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
        error: 'text-red-400 border-red-500/20 bg-red-500/5',
    };
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`px-3 py-1.5 text-[10px] font-mono rounded-md border ${colors[type]}`}
        >
            {text}
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════════════
     MAIN SCENE
   ═══════════════════════════════════════════════════════════════ */

// Map step IDs → which nodes are active (glowing)
const stepActiveNodes: Record<string, string[]> = {
    'prob-1': ['alex'],
    'prob-2': ['alex'],
    'prob-3': ['alex', 'jira-silo'],
    'prob-4': ['alex', 'jira-silo', 'fs-silo', 'minio-silo'],
    'prob-5': ['alex', 'jira-silo', 'fs-silo', 'minio-silo', 'mysql-silo', 'web-silo'],
    'prob-6': ['alex', 'jira-silo', 'fs-silo', 'minio-silo', 'mysql-silo', 'mongo-silo', 'web-silo'],
    'prob-7': ['alex', 'jira-silo', 'fs-silo', 'minio-silo', 'mysql-silo', 'mongo-silo', 'web-silo'],
    'prob-8': ['alex'],
};

// Map step IDs → which edges are visible
const stepVisibleEdges: Record<string, string[]> = {
    'prob-1': [],
    'prob-2': [],
    'prob-3': ['e-alex-jira'],
    'prob-4': ['e-alex-jira', 'e-alex-fs', 'e-alex-minio'],
    'prob-5': ['e-alex-jira', 'e-alex-fs', 'e-alex-minio', 'e-alex-mysql', 'e-alex-web'],
    'prob-6': ['e-alex-jira', 'e-alex-fs', 'e-alex-minio', 'e-alex-mysql', 'e-alex-mongo', 'e-alex-web'],
    'prob-7': ['e-alex-jira', 'e-alex-fs', 'e-alex-minio', 'e-alex-mysql', 'e-alex-mongo', 'e-alex-web'],
    'prob-8': ['e-alex-jira', 'e-alex-fs', 'e-alex-minio', 'e-alex-mysql', 'e-alex-mongo', 'e-alex-web'],
};

const ProblemScene: React.FC = () => {
    const { currentStepIndex, isPlaying, speed, nextStep } = useAppStore();
    const steps = useMemo(() => getStepsForScene('problem'), []);
    const step = steps[currentStepIndex] || steps[0];
    const globalIdx = allSteps.indexOf(step);

    // Auto-advance
    useEffect(() => {
        if (!isPlaying) return;
        const delay = getStepDelay(speed);
        const timer = setTimeout(() => nextStep(), delay);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, speed, nextStep]);

    // Compute active nodes
    const activeNodeIds = useMemo(() => stepActiveNodes[step.id] || [], [step.id]);

    // Filter edges based on current step (connections appear incrementally)
    const visibleEdgeIds = useMemo(() => stepVisibleEdges[step.id] || [], [step.id]);
    const filteredEdges = useMemo(
        () => sceneEdges.problem.filter((e) => visibleEdgeIds.includes(e.id)),
        [visibleEdgeIds]
    );

    // Is it the spaghetti/problem steps?
    const isSpaghetti = step.id === 'prob-7' || step.id === 'prob-8';
    const isFinalMoment = step.id === 'prob-8';

    return (
        <div className="relative w-full h-full flex overflow-hidden">
            {/* Darken overlay for final moment */}
            <AnimatePresence>
                {isFinalMoment && (
                    <motion.div
                        key="darken"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black z-20 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* React Flow diagram */}
            <div className="flex-1 relative">
                <FlowCanvas
                    nodes={sceneNodes.problem}
                    edges={filteredEdges}
                    activeNodeIds={activeNodeIds}
                />

                {/* Center overlay messages */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <AnimatePresence mode="wait">
                        {step.id === 'prob-1' && (
                            <OverlayMessage key="msg1" text="My data is everywhere." />
                        )}
                        {isFinalMoment && (
                            <motion.div
                                key="final"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="text-center space-y-4"
                            >
                                <div
                                    className="text-2xl font-bold"
                                    style={{
                                        background: 'linear-gradient(90deg, #22d3ee, #60a5fa, #c084fc)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    "There must be a better way."
                                </div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.5 }}
                                    className="text-sm text-cyan-400/70 font-mono"
                                >
                                    Introducing AgenticSearchGatewayProtocol →
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Floating panels — positioned absolutely based on step */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
                    <AnimatePresence mode="wait">
                        {/* Query terminal — step 2 */}
                        {step.id === 'prob-2' && (
                            <QueryTerminal key="query" visible={true} />
                        )}

                        {/* Code snippets — steps 3-5 */}
                        {step.id === 'prob-3' && (
                            <div key="code3" className="flex items-center gap-3">
                                <CodeSnippet visible code={`jira = MCPServer("jira")\njira.connect()`} />
                                <StatusTooltip text="Connected ✓ — Only Jira data available" type="success" />
                            </div>
                        )}
                        {step.id === 'prob-4' && (
                            <div key="code4" className="flex items-center gap-3">
                                <CodeSnippet visible code={`filesystem = MCPServer("filesystem")\nfilesystem.connect()\n\nminio = MCPServer("minio")\nminio.connect()`} />
                                <StatusTooltip text="⚠ Separate auth · Separate queries · Separate APIs" type="warning" />
                            </div>
                        )}
                        {step.id === 'prob-5' && (
                            <div key="code5" className="flex items-center gap-3">
                                <CodeSnippet visible code={`mysql = MCPServer("mysql")\nmysql.connect()\n\nweb = MCPServer("websearch")\nweb.connect()`} />
                                <StatusTooltip text="⚠ Different query languages: SQL vs File vs REST vs Blob" type="warning" />
                            </div>
                        )}

                        {/* Complexity counter — step 6 */}
                        {step.id === 'prob-6' && (
                            <ComplexityCounter key="counter" visible />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Step card — top-left */}
            <div className="absolute top-4 left-4 z-30">
                <StepCard step={step} stepIndex={globalIdx} totalSteps={allSteps.length} />
            </div>

            {/* Pain point overlays — steps 7+ */}
            <PainPointCallout painPoints={step.painPoints} />

            {/* Legend */}
            <Legend />

            {/* Timeline controls */}
            <div className="absolute bottom-0 left-0 right-0 z-30">
                <TimelineControls totalSteps={steps.length} currentIndex={currentStepIndex} />
            </div>
        </div>
    );
};

export default React.memo(ProblemScene);

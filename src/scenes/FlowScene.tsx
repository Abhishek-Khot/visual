import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { getStepsForScene, allSteps } from '../data/storySteps';
import { sceneNodes } from '../data/nodes';
import { sceneEdges } from '../data/edges';
import FlowCanvas from '../flow/FlowCanvas';
import StepCard from '../components/StepCard';
import TimelineControls from '../components/TimelineControls';
import Legend from '../components/Legend';
import TokenViz from '../components/TokenViz';
import ParallelLanes from '../components/ParallelLanes';
import RetryMeter from '../components/RetryMeter';
import ThreadPoolViz from '../components/ThreadPoolViz';
import GatewayPipeline from '../components/GatewayPipeline';
import SecurityMask from '../components/SecurityMask';
import ScoreBar from '../components/ScoreBar';
import { getStepDelay } from '../utils/timelines';
import { alexQuery, sensitiveFields } from '../data/mockData';
import {
    Terminal, Brain, Eye, Shield, Check, X,
    ClipboardList, Image, Folder, Globe, ArrowRight,
    GitMerge, Sparkles, FileOutput,
} from 'lucide-react';

/* ─── Map step IDs → gateway pipeline stage index ─── */
const stepToPipelineStage: Record<string, number> = {
    'flow-1': -1,  // query arrives
    'flow-2': 0,   // gateway entry
    'flow-3': 1,   // tokenizer
    'flow-4': 2,   // thinking engine
    'flow-5': 3,   // reflection engine
    'flow-6': 5,   // thread manager (skip to 5)
    'flow-7': 4,   // security filter (4)
    'flow-8': 6,   // parallel exec
    'flow-9': 6,   // lane A
    'flow-10': 6,  // lane B retry 1
    'flow-11': 6,  // lane B retry 2-3
    'flow-12': 6,  // lane C
    'flow-13': 6,  // lane D
    'flow-14': 7,  // aggregation
    'flow-15': 7,  // security mutations
    'flow-16': 7,  // dedup
    'flow-17': 8,  // LLM
    'flow-18': 8,  // final scoring
    'flow-19': 9,  // response builder
};

/* ─── HTTP request packet animation ─── */
const HTTPPacket: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        className="glass-strong p-4 w-full"
    >
        <div className="flex items-center gap-2 mb-2 text-xs font-mono">
            <Terminal size={12} className="text-cyan-400" />
            <span className="text-cyan-300">POST</span>
            <span className="text-slate-400">/api/query</span>
        </div>
        <pre className="text-[10px] font-mono text-slate-400 leading-relaxed">{`{
  "query": "${alexQuery.slice(0, 60)}...",
  "userId": "alex_007",
  "context": { "session": "new" }
}`}</pre>
    </motion.div>
);

/* ─── ThinkingEngine intent bubbles ─── */
const IntentBubbles: React.FC = () => {
    const intents = [
        { label: 'Fetch Jira tasks', skill: 'jiraSkill', color: '#c084fc', icon: <ClipboardList size={10} /> },
        { label: 'Find photos', skill: 'minioSkill', color: '#fb923c', icon: <Image size={10} /> },
        { label: 'Get invoices', skill: 'fileSystemSkill', color: '#94a3b8', icon: <Folder size={10} /> },
        { label: 'Search news', skill: 'webSearchSkill', color: '#fde047', icon: <Globe size={10} /> },
    ];

    return (
        <div className="glass-strong p-4 w-full space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <Brain size={12} />
                Intent Extraction — 4 intents identified
            </div>
            <div className="space-y-2">
                {intents.map((intent, i) => (
                    <motion.div
                        key={intent.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.25 }}
                        className="flex items-center gap-2 text-[11px] font-mono"
                    >
                        <div className="flex items-center gap-1.5 glass px-2 py-1 flex-1"
                            style={{ borderColor: `${intent.color}22` }}>
                            {intent.icon}
                            <span className="text-slate-300">{intent.label}</span>
                        </div>
                        <ArrowRight size={10} className="text-slate-600" />
                        <span style={{ color: intent.color }}>{intent.skill}</span>
                    </motion.div>
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-[9px] font-mono text-teal-400/70 text-center"
            >
                Dependency graph: all 4 can run in parallel ⚡
            </motion.div>
        </div>
    );
};

/* ─── Reflection review card ─── */
const ReflectionReview: React.FC = () => {
    const checks = [
        { text: 'All 4 intents mapped', pass: true },
        { text: 'Parallel execution safe', pass: true },
        { text: 'MinIO: adding limit:10 constraint', pass: false, warning: true },
        { text: 'Plan validated and optimized', pass: true },
    ];

    return (
        <div className="glass-strong p-4 w-full space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <Eye size={12} />
                ReflectionEngine — Plan Self-Review
            </div>
            <div className="space-y-1.5">
                {checks.map((check, i) => (
                    <motion.div
                        key={check.text}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.4 }}
                        className="flex items-center gap-2 text-[11px] font-mono"
                    >
                        {check.warning ? (
                            <span className="text-yellow-400">⚠</span>
                        ) : check.pass ? (
                            <Check size={10} className="text-green-400" />
                        ) : (
                            <X size={10} className="text-red-400" />
                        )}
                        <span className={check.warning ? 'text-yellow-300' : 'text-slate-400'}>
                            {check.text}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

/* ─── Security check card ─── */
const SecurityCheck: React.FC = () => {
    const checks = [
        { query: "MySQL → 'invoices'", result: '✓ in allowlist → PROCEED', color: '#4ade80' },
        { query: "MySQL → 'admin_tokens'", result: '✗ BLOCKED', color: '#f87171' },
        { query: 'WRITE operations?', result: 'None detected → READ ONLY ✓', color: '#22d3ee' },
        { query: 'All queries', result: '✓ Cleared by security layer', color: '#4ade80' },
    ];

    return (
        <div className="glass-strong p-4 w-full space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-red-400">
                <Shield size={12} />
                Security Pre-Check — Allowlist Verification
            </div>
            <div className="space-y-2">
                {checks.map((check, i) => (
                    <motion.div
                        key={check.query}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.35 }}
                        className="flex items-center justify-between text-[10px] font-mono glass px-2 py-1.5"
                    >
                        <span className="text-slate-400">{check.query}</span>
                        <span style={{ color: check.color }}>{check.result}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

/* ─── Post-processing cards ─── */
const AggregationCard: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong p-4 w-full space-y-2"
    >
        <div className="flex items-center gap-1.5 text-xs font-mono text-teal-400">
            <GitMerge size={12} />
            Aggregation & Deduplication
        </div>
        <div className="text-[10px] font-mono text-slate-400 space-y-1">
            <div>7 Jira tasks + 12 photos + 3 invoices + 3 articles</div>
            <div className="text-green-400">→ Normalized, deduplicated, clean dataset ready</div>
        </div>
    </motion.div>
);

const LLMCard: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong p-4 w-full space-y-2"
    >
        <div className="flex items-center gap-1.5 text-xs font-mono text-yellow-400">
            <Sparkles size={12} />
            LLM Summarization — Context Assembly
        </div>
        <div className="text-[10px] font-mono text-slate-400 space-y-1">
            <div>
                Context: 1,847 tokens + Query: 47 ={' '}
                <span className="text-green-400">1,894 / 4,096 ✓</span>
            </div>
            <div className="text-yellow-300">
                Generating coherent narrative with source attribution...
            </div>
        </div>
        <ScoreBar score={0.89} label="Answer Confidence" />
    </motion.div>
);

const ResponseCard: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong p-4 w-full space-y-2"
    >
        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
            <FileOutput size={12} />
            Response Schema Validated
        </div>
        <div className="text-[10px] font-mono space-y-1">
            {[
                { field: 'answer: str', status: '✓' },
                { field: 'sources: Source[]', status: '✓' },
                { field: 'scores: float[]', status: '✓' },
                { field: 'metadata: ResponseMetadata', status: '✓' },
            ].map((f) => (
                <div key={f.field} className="flex justify-between text-slate-400">
                    <span>{f.field}</span>
                    <span className="text-green-400">{f.status}</span>
                </div>
            ))}
        </div>
        <div className="text-[9px] font-mono text-cyan-400/60 text-center pt-1">
            HTTP 200 → Alex's browser
        </div>
    </motion.div>
);

/* ─── Connection validation card ─── */
const ConnectionValidationCard: React.FC<{ hasDataSources: boolean; count: number }> = ({
    hasDataSources,
    count,
}) => {
    const color = hasDataSources ? '#4ade80' : '#f87171';
    const label = hasDataSources
        ? `✓ ${count} data source${count === 1 ? '' : 's'} available`
        : '✗ No data sources configured';

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-strong p-4 space-y-2 w-full max-w-xs"
        >
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Connection Validation
            </div>
            <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <span>Configured data sources</span>
                <span className="font-bold tabular-nums" style={{ color }}>
                    {count}
                </span>
            </div>
            <div className="text-[10px] font-mono" style={{ color }}>
                {label}
            </div>
            {!hasDataSources && (
                <div className="text-[9px] font-mono text-yellow-300/80">
                    Orchestration will not start until at least one data source is configured.
                </div>
            )}
        </motion.div>
    );
};

/* ─── Orchestration blocked banner ─── */
const OrchestrationBlockedBanner: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-strong px-4 py-3 w-full text-center space-y-1 border border-red-500/40"
    >
        <div className="text-xs font-mono text-red-400">
            Orchestration blocked — no data sources available
        </div>
        <div className="text-[10px] font-mono text-slate-300">
            Gateway validation detected zero configured data sources. Parallel execution lanes will not
            start until configuration is fixed.
        </div>
    </motion.div>
);

/* ─── Map flow step IDs → active nodes / visible edges ─── */
const flowStepActiveNodes: Record<string, string[]> = {
    'flow-1': ['alex-q'],
    'flow-2': ['alex-q', 'gateway'],
    'flow-3': ['gateway', 'tokenizer'],
    'flow-4': ['gateway', 'thinking'],
    'flow-5': ['thinking', 'reflection'],
    'flow-6': ['reflection', 'conn-mgr'],
    'flow-7': ['conn-mgr', 'security-check'],
    'flow-8': ['conn-mgr', 'skill-jira', 'skill-minio', 'skill-fs', 'skill-web'],
    'flow-9': ['skill-jira'],
    'flow-10': ['skill-minio', 'retry-minio'],
    'flow-11': ['skill-minio', 'retry-minio'],
    'flow-12': ['skill-fs'],
    'flow-13': ['skill-web'],
    'flow-14': ['skill-jira', 'retry-minio', 'skill-fs', 'skill-web', 'aggregator'],
    'flow-15': ['aggregator'],
    'flow-16': ['aggregator'],
    'flow-17': ['aggregator', 'llm'],
    'flow-18': ['llm'],
    'flow-19': ['response', 'alex-q'],
};

const flowStepVisibleEdges: Record<string, string[]> = {
    'flow-1': [],
    'flow-2': ['e-alex-gw'],
    'flow-3': ['e-alex-gw', 'e-gw-tok'],
    'flow-4': ['e-alex-gw', 'e-gw-tok', 'e-gw-think'],
    'flow-5': ['e-alex-gw', 'e-gw-think', 'e-think-ref'],
    'flow-6': ['e-alex-gw', 'e-gw-think', 'e-think-ref', 'e-ref-conn'],
    'flow-7': ['e-alex-gw', 'e-gw-think', 'e-think-ref', 'e-ref-conn', 'e-conn-sec'],
    'flow-8': [
        'e-alex-gw',
        'e-gw-think',
        'e-think-ref',
        'e-ref-conn',
        'e-conn-sec',
        'e-conn-jira',
        'e-conn-minio',
        'e-conn-fs',
        'e-conn-web',
        'e-minio-retry',
    ],
    'flow-9': [
        'e-alex-gw',
        'e-gw-think',
        'e-think-ref',
        'e-ref-conn',
        'e-conn-sec',
        'e-conn-jira',
        'e-conn-minio',
        'e-conn-fs',
        'e-conn-web',
        'e-minio-retry',
    ],
    'flow-10': [
        'e-alex-gw',
        'e-gw-think',
        'e-think-ref',
        'e-ref-conn',
        'e-conn-sec',
        'e-conn-minio',
        'e-minio-retry',
    ],
    'flow-11': [
        'e-alex-gw',
        'e-gw-think',
        'e-think-ref',
        'e-ref-conn',
        'e-conn-sec',
        'e-conn-minio',
        'e-minio-retry',
    ],
    'flow-12': [
        'e-alex-gw',
        'e-gw-think',
        'e-think-ref',
        'e-ref-conn',
        'e-conn-sec',
        'e-conn-fs',
    ],
    'flow-13': [
        'e-alex-gw',
        'e-gw-think',
        'e-think-ref',
        'e-ref-conn',
        'e-conn-sec',
        'e-conn-web',
    ],
    'flow-14': [
        'e-alex-gw',
        'e-gw-think',
        'e-think-ref',
        'e-ref-conn',
        'e-conn-sec',
        'e-conn-jira',
        'e-conn-minio',
        'e-conn-fs',
        'e-conn-web',
        'e-minio-retry',
        'e-jira-agg',
        'e-retry-agg',
        'e-fs-agg',
        'e-web-agg',
    ],
    'flow-15': [
        'e-alex-gw',
        'e-ref-conn',
        'e-conn-sec',
        'e-conn-jira',
        'e-conn-minio',
        'e-conn-fs',
        'e-conn-web',
        'e-minio-retry',
        'e-jira-agg',
        'e-retry-agg',
        'e-fs-agg',
        'e-web-agg',
    ],
    'flow-16': [
        'e-alex-gw',
        'e-ref-conn',
        'e-conn-sec',
        'e-conn-jira',
        'e-conn-minio',
        'e-conn-fs',
        'e-conn-web',
        'e-minio-retry',
        'e-jira-agg',
        'e-retry-agg',
        'e-fs-agg',
        'e-web-agg',
        'e-agg-llm',
    ],
    'flow-17': [
        'e-alex-gw',
        'e-ref-conn',
        'e-conn-sec',
        'e-conn-jira',
        'e-conn-minio',
        'e-conn-fs',
        'e-conn-web',
        'e-minio-retry',
        'e-jira-agg',
        'e-retry-agg',
        'e-fs-agg',
        'e-web-agg',
        'e-agg-llm',
        'e-llm-resp',
    ],
    'flow-18': [
        'e-alex-gw',
        'e-ref-conn',
        'e-conn-sec',
        'e-jira-agg',
        'e-retry-agg',
        'e-fs-agg',
        'e-web-agg',
        'e-agg-llm',
        'e-llm-resp',
    ],
    'flow-19': [
        'e-alex-gw',
        'e-ref-conn',
        'e-conn-sec',
        'e-jira-agg',
        'e-retry-agg',
        'e-fs-agg',
        'e-web-agg',
        'e-agg-llm',
        'e-llm-resp',
        'e-resp-alex',
    ],
};

/* ═══════════════════════════════════════════════════════════════
     FLOW SCENE
   ═══════════════════════════════════════════════════════════════ */

const FlowScene: React.FC = () => {
    const { currentStepIndex, isPlaying, speed, nextStep } = useAppStore();
    const steps = useMemo(() => getStepsForScene('flow'), []);
    const step = steps[currentStepIndex] || steps[0];
    const globalIdx = allSteps.indexOf(step);

    useEffect(() => {
        if (!isPlaying) return;
        const delay = getStepDelay(speed);
        const timer = setTimeout(() => nextStep(), delay);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, speed, nextStep]);

    const pipelineStageIndex = stepToPipelineStage[step.id] ?? -1;

    const activeNodeIds = useMemo(() => flowStepActiveNodes[step.id] || [], [step.id]);
    const visibleEdgeIds = useMemo(() => flowStepVisibleEdges[step.id] || [], [step.id]);

    const allFlowNodes = sceneNodes.flow;
    const allFlowEdges = sceneEdges.flow;

    const filteredEdges = useMemo(
        () =>
            allFlowEdges.filter(
                (e) => visibleEdgeIds.length === 0 || visibleEdgeIds.includes(e.id),
            ),
        [allFlowEdges, visibleEdgeIds],
    );

    const skillNodeIds = useMemo(
        () =>
            allFlowNodes
                .filter((n) => n.type === 'skillNode')
                .map((n) => n.id),
        [allFlowNodes],
    );

    const hasDataSources = skillNodeIds.length > 0;
    const orchestrationBlocked = !hasDataSources;

    // Determine which visualization panels to show
    const showHTTP = step.id === 'flow-1';
    const showIntents = step.id === 'flow-4';
    const showReflection = step.id === 'flow-5';
    const showThreadPool = step.id === 'flow-6';
    const showSecurity = step.id === 'flow-7';
    const canRunOrchestration = !orchestrationBlocked;
    const showParallel =
        canRunOrchestration &&
        ['flow-8', 'flow-9', 'flow-12', 'flow-13', 'flow-14'].includes(step.id);
    const showRetry =
        canRunOrchestration &&
        (step.id === 'flow-10' || step.id === 'flow-11') &&
        step.retryAttempts;
    const showSecurityMask = step.id === 'flow-15';
    const showAggregation = canRunOrchestration && step.id === 'flow-16';
    const showLLM = canRunOrchestration && (step.id === 'flow-17' || step.id === 'flow-18');
    const showResponse = canRunOrchestration && step.id === 'flow-19';

    const showValidationCard = step.id === 'flow-6' || step.id === 'flow-7';
    const showBlockedBanner = orchestrationBlocked && step.id === 'flow-8';

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Header: internal pipeline at top center, full width, no horizontal scroll */}
            <div className="pt-4 pb-3 px-6">
                <div className="w-full">
                    <GatewayPipeline activeStageIndex={pipelineStageIndex} />
                </div>
            </div>

            {/* Main 3-column layout */}
            <div className="flex-1 flex overflow-hidden px-4 pb-2 gap-4">
                {/* Left panel: step notes only */}
                <div className="w-72 max-w-xs flex-shrink-0">
                    <StepCard step={step} stepIndex={globalIdx} totalSteps={allSteps.length} />
                </div>

                {/* Center: main React Flow canvas */}
                <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden">
                    <FlowCanvas nodes={allFlowNodes} edges={filteredEdges} activeNodeIds={activeNodeIds} />
                </div>

                {/* Right panel: act visuals + validation/parallel/retries */}
                <div className="w-72 max-w-xs flex-shrink-0 flex flex-col gap-3">
                    {/* Act-specific visualization that used to sit below the act card */}
                    <div className="space-y-3">
                        <AnimatePresence mode="wait">
                            {showHTTP && (
                                <motion.div
                                    key="http"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <HTTPPacket />
                                </motion.div>
                            )}

                            {step.id === 'flow-2' && (
                                <motion.div
                                    key="gateway-entry"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="glass-strong p-6 text-center space-y-2"
                                >
                                    <div className="text-sm font-mono text-cyan-400">
                                        Gateway.handle_request()
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        Orchestration pipeline initializing...
                                    </div>
                                </motion.div>
                            )}

                            {step.id === 'flow-3' && (
                                <motion.div
                                    key="token"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="w-full"
                                >
                                    <TokenViz text={alexQuery} budget={4096} animate />
                                </motion.div>
                            )}

                            {showIntents && (
                                <motion.div
                                    key="intents"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <IntentBubbles />
                                </motion.div>
                            )}

                            {showReflection && (
                                <motion.div
                                    key="reflection"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <ReflectionReview />
                                </motion.div>
                            )}

                            {showThreadPool && (
                                <motion.div
                                    key="threads"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <ThreadPoolViz animate />
                                </motion.div>
                            )}

                            {showSecurity && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <SecurityCheck />
                                </motion.div>
                            )}

                            {showSecurityMask && (
                                <motion.div
                                    key="sec-mask"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="glass-strong p-5 space-y-3"
                                >
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-red-400 mb-2">
                                        <Shield size={12} />
                                        PII Redaction — Results Masking
                                    </div>
                                    {sensitiveFields.map((field, i) => (
                                        <motion.div
                                            key={field}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.4 }}
                                        >
                                            <SecurityMask
                                                fieldName={field}
                                                realValue={
                                                    field === 'password'
                                                        ? 's3cureP@ss!'
                                                        : 'ATT_jira_xoxb_12345'
                                                }
                                                showDuration={500 + i * 200}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {showAggregation && (
                                <motion.div
                                    key="agg"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <AggregationCard />
                                </motion.div>
                            )}

                            {showLLM && step.id === 'flow-17' && (
                                <motion.div
                                    key="llm"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-3"
                                >
                                    <LLMCard />
                                    <div className="w-full">
                                        <TokenViz
                                            text={`Context tokens: 1847 + Query: 47 = Total: 1894`}
                                            budget={4096}
                                            animate={false}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step.id === 'flow-18' && (
                                <motion.div
                                    key="final-score"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="glass-strong p-4 w-full space-y-3"
                                >
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                                        <Eye size={12} />
                                        Final Relevance Scoring & Reflection
                                    </div>
                                    <ScoreBar score={0.89} label="Overall Confidence" />
                                    <div className="text-[9px] font-mono text-green-400/70 text-center pt-1 border-t border-white/10">
                                        All 4 intents verified · No hallucinations · Quality: HIGH
                                    </div>
                                </motion.div>
                            )}

                            {showResponse && (
                                <motion.div
                                    key="response"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <ResponseCard />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Validation + parallel lanes + retries */}
                    <div className="flex-1 overflow-y-auto pl-1">
                        <AnimatePresence mode="wait">
                            {showValidationCard && (
                                <ConnectionValidationCard
                                    key="conn-validation"
                                    hasDataSources={hasDataSources}
                                    count={skillNodeIds.length}
                                />
                            )}

                            {showBlockedBanner && (
                                <OrchestrationBlockedBanner key="blocked" />
                            )}

                            {showParallel && (
                                <motion.div
                                    key="parallel"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="w-full"
                                >
                                    <ParallelLanes animate={step.id === 'flow-8'} />
                                </motion.div>
                            )}

                            {showRetry && step.retryAttempts && (
                                <motion.div
                                    key="retry"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="w-full"
                                >
                                    <RetryMeter attempts={step.retryAttempts} threshold={0.6} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Legend & timeline */}
            <div className="px-4 pb-2 flex justify-end">
                <Legend />
            </div>

            <div className="border-t border-white/10">
                <TimelineControls totalSteps={steps.length} currentIndex={currentStepIndex} />
            </div>
        </div>
    );
};

export default React.memo(FlowScene);

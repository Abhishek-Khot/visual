import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { getStepsForScene, allSteps } from '../data/storySteps';
import { gatewayYaml, securityYaml, sensitiveFields } from '../data/mockData';
import StepCard from '../components/StepCard';
import TimelineControls from '../components/TimelineControls';
import Legend from '../components/Legend';
import YAMLEditor from '../components/YAMLEditor';
import SecurityMask from '../components/SecurityMask';
import { getStepDelay } from '../utils/timelines';
import {
    Terminal, CheckCircle, Zap, Shield, ArrowRight,
} from 'lucide-react';

/* ─── Terminal install animation with Gateway appearance ─── */
const InstallTerminal: React.FC = () => (
    <div className="space-y-4 max-w-2xl w-full">
        {/* Terminal */}
        <div className="terminal">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <Terminal size={12} className="text-slate-500" />
                <span className="text-[10px] text-slate-500">bash — alex@dev</span>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <span className="prompt">$ </span>
                <span className="text-green-300">pip install</span>
                <span className="text-cyan-300"> AgenticSearchGatewayProtocol</span>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="text-slate-600 text-xs">
                Collecting AgenticSearchGatewayProtocol
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                className="text-slate-600 text-xs">
                {'  '}Downloading asgp-1.4.2-py3-none-any.whl (148 kB)
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
                className="text-slate-600 text-xs">
                Installing collected packages: pydantic, tiktoken, asgp
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
                className="flex items-center gap-2">
                <span className="success text-sm">Successfully installed AgenticSearchGatewayProtocol-1.4.2 ✓</span>
                <CheckCircle size={14} className="text-green-400" />
            </motion.div>
        </div>

        {/* Gateway node appearance */}
        <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2.5, type: 'spring', stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-2"
        >
            <motion.div
                animate={{
                    boxShadow: [
                        '0 0 0px rgba(34,211,238,0)',
                        '0 0 30px rgba(34,211,238,0.4)',
                        '0 0 0px rgba(34,211,238,0)',
                    ],
                }}
                transition={{ repeat: Infinity, duration: 2, delay: 3 }}
                className="glass-strong px-6 py-4 flex items-center gap-3"
                style={{ borderColor: 'rgba(34,211,238,0.4)' }}
            >
                <Zap size={20} className="text-cyan-400" />
                <div>
                    <div className="text-sm font-bold text-white">ASGP Gateway</div>
                    <div className="text-[10px] text-cyan-400/70 font-mono">Unified Orchestrator</div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
                className="flex items-center gap-2 text-[10px] font-mono text-slate-500"
            >
                <span className="text-red-400/60 line-through">Spaghetti connections</span>
                <ArrowRight size={10} className="text-cyan-400" />
                <span className="text-cyan-400">Single unified gateway</span>
            </motion.div>
        </motion.div>
    </div>
);

const ConfigScene: React.FC = () => {
    const { currentStepIndex, isPlaying, speed, nextStep } = useAppStore();
    const steps = useMemo(() => getStepsForScene('config'), []);
    const step = steps[currentStepIndex] || steps[0];
    const globalIdx = allSteps.indexOf(step);

    useEffect(() => {
        if (!isPlaying) return;
        const delay = getStepDelay(speed);
        const timer = setTimeout(() => nextStep(), delay);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, speed, nextStep]);

    const blockedTables = ['user_passwords', 'admin_tokens', 'internal_audit', 'auth_tokens', 'session_secrets', 'admin_users'];
    const allowedTables = ['orders', 'invoices', 'billing_history', 'user_profiles', 'preferences'];

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="w-full max-w-2xl px-6">
                <AnimatePresence mode="wait">
                    {/* Step 1: pip install + gateway appearance */}
                    {step.id === 'cfg-1' && (
                        <motion.div
                            key="install"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex justify-center"
                        >
                            <InstallTerminal />
                        </motion.div>
                    )}

                    {/* Step 2: gateway.yaml + security masks */}
                    {step.id === 'cfg-2' && (
                        <motion.div
                            key="gateway-yaml"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full space-y-4"
                        >
                            <YAMLEditor
                                content={gatewayYaml}
                                sensitiveKeys={sensitiveFields}
                                typingSpeed={30}
                            />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                                className="glass p-3 space-y-2"
                            >
                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-green-400 mb-2">
                                    <Shield size={10} />
                                    Credentials auto-masked
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['password', 'api_token', 'access_key', 'api_key'].map((field, i) => (
                                        <motion.div
                                            key={field}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 2.5 + i * 0.3 }}
                                        >
                                            <SecurityMask
                                                fieldName={field}
                                                realValue={field === 'password' ? 's3cureP@ss!' : 'xoxb_1234567890'}
                                                showDuration={600 + i * 200}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Step 3: Security config */}
                    {step.id === 'cfg-3' && (
                        <motion.div
                            key="security-yaml"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <YAMLEditor
                                content={securityYaml}
                                blockedItems={blockedTables}
                                allowedItems={allowedTables}
                                typingSpeed={35}
                            />
                        </motion.div>
                    )}

                    {/* Step 4: System configured summary */}
                    {step.id === 'cfg-4' && (
                        <motion.div
                            key="config-summary"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-strong p-8 max-w-md mx-auto text-center space-y-4"
                        >
                            <div className="text-4xl">🛡️</div>
                            <h3 className="text-lg font-bold text-white">System Configured</h3>
                            <div className="space-y-2 text-sm text-slate-400">
                                {[
                                    'READ ONLY mode — enforced at query layer',
                                    'PII masked in all configs',
                                    '6 data sources configured',
                                    'Allowlists & blocklists defined',
                                ].map((item, i) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.2 }}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={14} className="text-green-400" />
                                        <span>{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="text-xs font-mono text-cyan-400/60 pt-2"
                            >
                                Ready for system boot →
                            </motion.p>
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

export default React.memo(ConfigScene);

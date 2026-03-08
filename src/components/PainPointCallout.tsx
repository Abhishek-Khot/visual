import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { PainPointType } from '../types';

interface PainPointCalloutProps {
    painPoints?: PainPointType[];
}

const painPointData: Record<PainPointType, { label: string; detail: string }> = {
    architecture_bloat: {
        label: 'Architecture Bloat',
        detail: 'Too many direct hops; duplicated auth logic in every connector',
    },
    redundant_engineering: {
        label: 'Redundant Engineering',
        detail: 'Similar connector code reimplemented 5 times across tools',
    },
    scalability: {
        label: 'Scalability Issues',
        detail: 'Serial calls to high-latency backends; no parallel execution; no bulk fetch',
    },
    auth_risk: {
        label: 'Auth Layer Risks',
        detail: 'Token pass-through everywhere; coarse permission scopes; no per-skill allowlist',
    },
    no_orchestration: {
        label: 'No Orchestration',
        detail: 'Who decides what to call? In what order? What if one fails?',
    },
};

const PainPointCallout: React.FC<PainPointCalloutProps> = ({ painPoints }) => {
    if (!painPoints || painPoints.length === 0) return null;

    return (
        <div className="fixed bottom-20 right-6 z-50 space-y-2 max-w-xs">
            <AnimatePresence>
                {painPoints.map((pp, i) => {
                    const info = painPointData[pp];
                    return (
                        <motion.div
                            key={pp}
                            initial={{ opacity: 0, x: 40, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 40, scale: 0.9 }}
                            transition={{ delay: i * 0.15, type: 'spring', stiffness: 300, damping: 25 }}
                            className="px-3 py-2.5 rounded-lg flex items-start gap-2"
                            style={{
                                background: 'rgba(248,113,113,0.12)',
                                border: '1px solid rgba(248,113,113,0.25)',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <AlertTriangle size={12} className="text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <div className="text-[11px] font-semibold text-red-300">{info.label}</div>
                                <div className="text-[9px] text-red-400/70 mt-0.5">{info.detail}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(PainPointCallout);

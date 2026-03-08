import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const legendItems = [
    { label: 'User / Frontend', color: '#e2e8f0' },
    { label: 'Gateway / Orchestrator', color: '#22d3ee' },
    { label: 'MCP Server', color: '#c084fc' },
    { label: 'MongoDB', color: '#4ade80' },
    { label: 'MySQL', color: '#60a5fa' },
    { label: 'FileSystem', color: '#cbd5e1' },
    { label: 'MinIO / Blob', color: '#fb923c' },
    { label: 'Skills / SubAgents', color: '#5eead4' },
    { label: 'LLM', color: '#fde047' },
    { label: 'Security', color: '#f87171' },
    { label: 'Config / YAML', color: '#f9a8d4' },
    { label: 'tiktoken / Optimizer', color: '#fcd34d' },
    { label: 'Retry / Backoff', color: '#e879f9' },
];

const Legend: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed top-4 right-4 z-40">
            <button
                onClick={() => setOpen(!open)}
                className="glass px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
                Legend
                {open ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="glass mt-1 p-3 space-y-1.5 min-w-[160px]"
                    >
                        {legendItems.map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-sm shrink-0"
                                    style={{ background: item.color }}
                                />
                                <span className="text-[10px] text-slate-400">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(Legend);

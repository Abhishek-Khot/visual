import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileJson, Zap, Check, Shield } from 'lucide-react';

interface ConfigFile {
    name: string;
    icon: string;
    color: string;
    fields: number;
}

const configFiles: ConfigFile[] = [
    { name: 'gateway.yaml', icon: 'config', color: '#f9a8d4', fields: 6 },
    { name: 'security.yaml', icon: 'shield', color: '#f87171', fields: 8 },
    { name: 'datasources.yaml', icon: 'data', color: '#22d3ee', fields: 12 },
];

interface ConfigLoaderVizProps {
    animate?: boolean;
}

const ConfigLoaderViz: React.FC<ConfigLoaderVizProps> = ({ animate = true }) => {
    const [loadedFiles, setLoadedFiles] = useState(0);
    const [phase, setPhase] = useState<'scanning' | 'loading' | 'done'>('scanning');

    useEffect(() => {
        if (!animate) { setPhase('done'); setLoadedFiles(3); return; }
        const t1 = setTimeout(() => setPhase('loading'), 800);
        return () => clearTimeout(t1);
    }, [animate]);

    useEffect(() => {
        if (phase !== 'loading') return;
        let count = 0;
        const interval = setInterval(() => {
            count++;
            setLoadedFiles(count);
            if (count >= configFiles.length) {
                clearInterval(interval);
                setTimeout(() => setPhase('done'), 500);
            }
        }, 700);
        return () => clearInterval(interval);
    }, [phase]);

    return (
        <div className="glass-strong p-5 space-y-4 max-w-md w-full">
            <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 flex items-center gap-1.5">
                    <FileJson size={12} className="text-pink-400" />
                    load_config()
                </span>
                <span className="font-mono text-pink-400/70 text-[10px]">
                    src/asgp/loader/load_config.py
                </span>
            </div>

            {/* File cards */}
            <div className="space-y-2">
                {configFiles.map((file, i) => {
                    const isLoaded = loadedFiles > i;
                    const isLoading = loadedFiles === i && phase === 'loading';

                    return (
                        <motion.div
                            key={file.name}
                            initial={{ opacity: 0.3, x: -20 }}
                            animate={{
                                opacity: isLoaded ? 1 : isLoading ? 0.7 : 0.3,
                                x: isLoaded ? 0 : isLoading ? -5 : -20,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="flex items-center justify-between glass px-3 py-2"
                            style={{
                                borderColor: isLoaded ? `${file.color}44` : 'transparent',
                                boxShadow: isLoaded ? `0 0 12px ${file.color}22` : 'none',
                            }}
                        >
                            <div className="flex items-center gap-2">
                                {file.icon === 'shield' ? (
                                    <Shield size={12} style={{ color: file.color }} />
                                ) : (
                                    <FileJson size={12} style={{ color: file.color }} />
                                )}
                                <span className="text-xs font-mono text-slate-300">{file.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono text-slate-600">{file.fields} fields</span>
                                {isLoaded && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 500 }}
                                    >
                                        <Check size={12} className="text-green-400" />
                                    </motion.div>
                                )}
                                {isLoading && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                    >
                                        <Zap size={10} className="text-amber-400" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Summary */}
            <AnimatePresence>
                {phase === 'done' && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-[10px] font-mono text-green-400/80 pt-1"
                    >
                        ✓ 3 config files parsed → Typed config objects created
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(ConfigLoaderViz);

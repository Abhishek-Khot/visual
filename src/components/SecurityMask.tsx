import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

interface SecurityMaskProps {
    fieldName: string;
    realValue: string;
    showDuration?: number;
}

const SecurityMask: React.FC<SecurityMaskProps> = ({ fieldName, realValue, showDuration = 800 }) => {
    const [phase, setPhase] = useState<'real' | 'blur' | 'masked'>('real');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('blur'), showDuration);
        const t2 = setTimeout(() => setPhase('masked'), showDuration + 400);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [showDuration]);

    return (
        <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500 w-24 text-right">{fieldName}:</span>
            <AnimatePresence mode="wait">
                {phase === 'real' && (
                    <motion.span
                        key="real"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: 'blur(8px)' }}
                        className="text-red-300"
                    >
                        {realValue}
                    </motion.span>
                )}
                {phase === 'blur' && (
                    <motion.span
                        key="blur"
                        initial={{ opacity: 0.6, filter: 'blur(4px)' }}
                        animate={{ opacity: 0.3, filter: 'blur(12px)' }}
                        exit={{ opacity: 0 }}
                        className="text-red-300"
                    >
                        {realValue}
                    </motion.span>
                )}
                {phase === 'masked' && (
                    <motion.span
                        key="masked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 text-green-400"
                    >
                        <Shield size={10} className="text-green-400" />
                        ***MASKED***
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(SecurityMask);

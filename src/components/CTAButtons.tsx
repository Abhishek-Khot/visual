import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap } from 'lucide-react';
import { useAppStore } from '../state/store';

/* Generate star positions once */
function generateStars(count: number) {
    const stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            duration: Math.random() * 4 + 2,
            maxOpacity: Math.random() * 0.5 + 0.2,
            delay: Math.random() * 3,
        });
    }
    return stars;
}

const CTAButtons: React.FC = () => {
    const setScene = useAppStore((s) => s.setScene);
    const stars = useMemo(() => generateStars(120), []);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 overflow-hidden">
            {/* Star field */}
            <div className="star-field">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="star"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            '--duration': `${star.duration}s`,
                            '--max-opacity': star.maxOpacity,
                            animationDelay: `${star.delay}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-center z-10"
            >
                <h1 className="text-5xl font-bold tracking-tight mb-3">
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ASGP
                    </span>
                </h1>
                <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                    See how{' '}
                    <span className="text-cyan-400 font-semibold">AgenticSearchGatewayProtocol</span>{' '}
                    turns scattered data into unified intelligence
                </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex gap-5 z-10"
            >
                {/* Watch the Story */}
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(34,211,238,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setScene('problem')}
                    className="glass-strong px-8 py-4 flex items-center gap-3 text-white cursor-pointer group"
                    style={{ borderColor: 'rgba(34,211,238,0.3)' }}
                >
                    <Play size={20} className="text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                    <div className="text-left">
                        <div className="font-semibold text-sm">Watch the Story</div>
                        <div className="text-[10px] text-slate-500">Full narrative experience</div>
                    </div>
                </motion.button>

                {/* Architecture View */}
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(192,132,252,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setScene('flow')}
                    className="glass-strong px-8 py-4 flex items-center gap-3 text-white cursor-pointer group"
                    style={{ borderColor: 'rgba(192,132,252,0.3)' }}
                >
                    <Zap size={20} className="text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
                    <div className="text-left">
                        <div className="font-semibold text-sm">Architecture View</div>
                        <div className="text-[10px] text-slate-500">Technical diagram</div>
                    </div>
                </motion.button>
            </motion.div>

            {/* Footer text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-[11px] text-slate-600 font-mono z-10"
            >
                40 steps · ~8 min · Real codebase references
            </motion.p>
        </div>
    );
};

export default React.memo(CTAButtons);

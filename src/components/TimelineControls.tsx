import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Play, Pause, SkipBack, SkipForward, RotateCcw,
} from 'lucide-react';
import { useAppStore } from '../state/store';
import type { SceneName, SpeedOption } from '../types';
import { getStepsForScene } from '../data/storySteps';

const sceneLabels: Record<SceneName, string> = {
    problem: 'Problem',
    config: 'Config',
    boot: 'Boot',
    flow: 'Flow',
    result: 'Result',
};

const speeds: SpeedOption[] = [0.5, 1, 1.5, 2];

interface TimelineControlsProps {
    totalSteps: number;
    currentIndex: number;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({ totalSteps, currentIndex }) => {
    const {
        isPlaying, speed, currentScene,
        toggle, nextStep, prevStep, restart, setSpeed, setScene, goToStep,
    } = useAppStore();

    const sceneSteps = currentScene ? getStepsForScene(currentScene) : [];

    const handleSceneChange = useCallback((scene: SceneName) => {
        setScene(scene);
    }, [setScene]);

    return (
        <div className="glass-strong px-4 py-3 flex items-center gap-3 w-full">
            {/* Transport controls */}
            <div className="flex items-center gap-1.5">
                <button
                    onClick={restart}
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    aria-label="Restart"
                >
                    <RotateCcw size={14} />
                </button>
                <button
                    onClick={prevStep}
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    aria-label="Previous step"
                >
                    <SkipBack size={14} />
                </button>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggle}
                    className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </motion.button>
                <button
                    onClick={nextStep}
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    aria-label="Next step"
                >
                    <SkipForward size={14} />
                </button>
            </div>

            {/* Seekbar */}
            <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 relative h-2 bg-white/5 rounded-full overflow-hidden group cursor-pointer">
                    {/* Step dots */}
                    {sceneSteps.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToStep(i)}
                            className="absolute top-0 h-full w-1 hover:bg-white/40 transition-colors z-10"
                            style={{ left: `${(i / Math.max(sceneSteps.length - 1, 1)) * 100}%` }}
                            aria-label={`Go to step ${i + 1}`}
                        />
                    ))}
                    {/* Progress */}
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                        style={{ width: `${((currentIndex) / Math.max(sceneSteps.length - 1, 1)) * 100}%` }}
                        transition={{ duration: 0.2 }}
                    />
                </div>
                <span className="text-[10px] font-mono text-slate-500 w-12 text-right">
                    {currentIndex + 1}/{sceneSteps.length}
                </span>
            </div>

            {/* Speed selector */}
            <div className="flex items-center gap-1 border-l border-white/10 pl-3">
                {speeds.map((s) => (
                    <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${speed === s
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'text-slate-600 hover:text-slate-400'
                            }`}
                    >
                        {s}x
                    </button>
                ))}
            </div>

            {/* Scene selector */}
            <div className="flex items-center gap-1 border-l border-white/10 pl-3">
                {(Object.keys(sceneLabels) as SceneName[]).map((scene) => (
                    <button
                        key={scene}
                        onClick={() => handleSceneChange(scene)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${currentScene === scene
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'text-slate-600 hover:text-slate-400'
                            }`}
                    >
                        {sceneLabels[scene]}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default React.memo(TimelineControls);

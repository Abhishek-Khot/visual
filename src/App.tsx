import React, { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './state/store';
import CTAButtons from './components/CTAButtons';
import ProblemScene from './scenes/ProblemScene';
import ConfigScene from './scenes/ConfigScene';
import BootScene from './scenes/BootScene';
import FlowScene from './scenes/FlowScene';
import ResultScene from './scenes/ResultScene';

const sceneComponents: Record<string, React.FC> = {
    problem: ProblemScene,
    config: ConfigScene,
    boot: BootScene,
    flow: FlowScene,
    result: ResultScene,
};

const App: React.FC = () => {
    const { currentScene, toggle, nextStep, prevStep, restart } = useAppStore();

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!currentScene) return;
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    toggle();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextStep();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    prevStep();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    restart();
                    break;
            }
        },
        [currentScene, toggle, nextStep, prevStep, restart]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const SceneComponent = currentScene ? sceneComponents[currentScene] : null;

    return (
        <div className="w-full h-full bg-surface">
            <AnimatePresence mode="wait">
                {!currentScene && (
                    <motion.div
                        key="cta"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        <CTAButtons />
                    </motion.div>
                )}
                {currentScene && SceneComponent && (
                    <motion.div
                        key={currentScene}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full"
                    >
                        <SceneComponent />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;

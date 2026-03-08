import { create } from 'zustand';
import type { AppStore, SceneName, SpeedOption } from '../types';
import { allSteps } from '../data/storySteps';

function stepsForScene(scene: SceneName) {
    return allSteps.filter((s) => s.scene === scene);
}

export const useAppStore = create<AppStore>((set, get) => ({
    currentScene: null,
    currentStepIndex: 0,
    isPlaying: false,
    speed: 1,

    setScene: (scene: SceneName | null) =>
        set({ currentScene: scene, currentStepIndex: 0, isPlaying: false }),

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),

    nextStep: () => {
        const { currentScene, currentStepIndex } = get();
        if (!currentScene) return;
        const steps = stepsForScene(currentScene);
        if (currentStepIndex < steps.length - 1) {
            set({ currentStepIndex: currentStepIndex + 1 });
        } else {
            // Auto-advance to next scene
            const sceneOrder: SceneName[] = ['problem', 'config', 'boot', 'flow', 'result'];
            const idx = sceneOrder.indexOf(currentScene);
            if (idx < sceneOrder.length - 1) {
                set({ currentScene: sceneOrder[idx + 1], currentStepIndex: 0 });
            } else {
                set({ isPlaying: false });
            }
        }
    },

    prevStep: () => {
        const { currentScene, currentStepIndex } = get();
        if (!currentScene) return;
        if (currentStepIndex > 0) {
            set({ currentStepIndex: currentStepIndex - 1 });
        } else {
            const sceneOrder: SceneName[] = ['problem', 'config', 'boot', 'flow', 'result'];
            const idx = sceneOrder.indexOf(currentScene);
            if (idx > 0) {
                const prevScene = sceneOrder[idx - 1];
                const prevSteps = stepsForScene(prevScene);
                set({ currentScene: prevScene, currentStepIndex: prevSteps.length - 1 });
            }
        }
    },

    goToStep: (i: number) => set({ currentStepIndex: i }),

    restart: () => set({ currentScene: 'problem', currentStepIndex: 0, isPlaying: false }),

    setSpeed: (s: SpeedOption) => set({ speed: s }),
}));

/* Global step index helper — maps scene-local index to global */
export function getGlobalStepIndex(scene: SceneName, localIndex: number): number {
    const sceneOrder: SceneName[] = ['problem', 'config', 'boot', 'flow', 'result'];
    let total = 0;
    for (const s of sceneOrder) {
        if (s === scene) return total + localIndex;
        total += stepsForScene(s).length;
    }
    return total + localIndex;
}

export function getTotalSteps(): number {
    return allSteps.length;
}

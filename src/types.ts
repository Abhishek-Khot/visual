/* ─── Types ─── */

export type SceneName = 'problem' | 'config' | 'boot' | 'flow' | 'result';

export type PainPointType =
    | 'architecture_bloat'
    | 'redundant_engineering'
    | 'scalability'
    | 'auth_risk'
    | 'no_orchestration';

export interface CodeRef {
    file: string;
    symbol?: string;
    line?: number;
}

export interface RetryAttempt {
    attemptNumber: number;
    score: number;
    query: string;
    latencyMs: number;
    status: 'below' | 'pass';
}

export interface SecurityEvent {
    type: 'masked' | 'blocked' | 'allowed';
    target: string;
}

export interface TokenInfo {
    inputTokens: number;
    budgetTotal: number;
    tokensUsed?: number;
}

export interface SceneStep {
    id: string;
    title: string;
    description: string;
    codeRefs: CodeRef[];
    relevanceScore?: number;
    durationMs?: number;
    parallelGroup?: string;
    painPoints?: PainPointType[];
    retryAttempts?: RetryAttempt[];
    securityEvent?: SecurityEvent;
    tokenInfo?: TokenInfo;
    overlays?: string[];
    actNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    scene: SceneName;
}

export type SpeedOption = 0.5 | 1 | 1.5 | 2;

export interface AppStore {
    currentScene: SceneName | null;
    currentStepIndex: number;
    isPlaying: boolean;
    speed: SpeedOption;
    setScene: (scene: SceneName | null) => void;
    play: () => void;
    pause: () => void;
    toggle: () => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (i: number) => void;
    restart: () => void;
    setSpeed: (s: SpeedOption) => void;
}

/* ─── Mock Data Types ─── */

export interface MockJiraTask {
    id: string;
    title: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    due: string;
    status: string;
}

export interface MockPhoto {
    key: string;
    size: string;
    lastModified: string;
}

export interface MockInvoice {
    file: string;
    amount: string;
    vendor: string;
}

export interface MockArticle {
    title: string;
    score: number;
    source?: string;
}

/* ─── Node Types ─── */

export type FlowNodeType =
    | 'userNode'
    | 'gatewayNode'
    | 'mcpNode'
    | 'dataSourceNode'
    | 'subagentNode'
    | 'skillNode'
    | 'llmNode'
    | 'configNode'
    | 'sessionNode'
    | 'summarizerNode'
    | 'optimizerNode'
    | 'retryNode'
    | 'securityNode';

export interface NodeData {
    label: string;
    tag?: string;
    icon?: string;
    color?: string;
    active?: boolean;
    dimmed?: boolean;
    subType?: string;
}
